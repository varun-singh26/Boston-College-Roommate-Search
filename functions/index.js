/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */



const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler"); 


const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");


// 📝 This initializes Firestore using Firebase Admin SDK directly within the Cloud Functions backend.
// Firebase Admin SDK allows privileged access to Firestore (no authentication required)
// This is necessary to read/write data in Firestore from the backend (rather than from the react frontend/client side)
admin.initializeApp();
const db = admin.firestore();

// 📨 Sets up Nodemailer to Send Emails
// Creates an email sender (SMTP transport) using Gmail
// DON'T use actual gmail password! Instead generate an app password for security
{/*const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vrjsingh04@gmail.com", //The Gmail address that will send emails. Replace with email of Heights housing
        pass: "wjsgkalhzpixzixx"
    }
});*/}

// 📨 Sets up Nodemailer to Send Emails
// Creates an email sender (SMTP transport/Outgoing server) using our Hostinger Email
// Password is the same as email password
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "team@heightshousing.com", //Address that will send emails.
        pass: "0nTh-He19hts@25"
    }
});

// 🚀 Function 1: Send Email Notification When a Ping is Created
//Triggers when a new document is created inside the pings collection
//Extracts the ping data (who sent it, their email, and the listing ID).
//Auto sends an email
exports.notifyListingAdmin = onDocumentCreated("pings/{pingId}", async (event) => {
    try {
        console.log("Triggering notifyListingAdmin function...");
        const snap = event.data; // Extract Firestore document snapshot
        if (!snap) {
            console.error("No data found in Firestore trigger.");
            return;
        }

        const pingData = snap.data(); // Extract the data from the document snapshot

        //Gets the posting which the ping was sent for
        //Gets the posting admin's email from Firestore
        //We need to know who to notify (the posting admin)
        const postingRef = db.collection("postings").doc(pingData.postID);
        const postingDoc = await postingRef.get();

        if (!postingDoc.exists) {
            console.error("Listing not found!");
            return;
        }
    
        const posting = postingDoc.data();
        const adminEmail = posting.adminContact?.email;

        if (!adminEmail) {
            console.warn(`Can't send ping for posting with id ${postingDoc.id} - No admin email found for this posting.`);
            return;
        }

        console.log(`Sending email to: ${adminEmail}`);

        // ✅ Construct action links
        const baseUrl = "https://us-central1-bcrs-e15d9.cloudfunctions.net/updatePostingStatus"; //cloud functions stored in us-central1 region?
        const fulfillLink = `${baseUrl}?postId=${postingDoc.id}&pingId=${event.params.pingId}&status=Fulfilled`; //How does this line of code work?
        const unfulfillLink = `${baseUrl}?postId=${postingDoc.id}&pingId=${event.params.pingId}&status=Unfulfilled`;

        // ✅ Create HTML email with clickable buttons
        //inludes the searcher's email and message
        const mailOptions = {
            from: '"Heights Housing" <team@heightshousing.com>',
            to: adminEmail,
            subject: `Interest in Your Posting for ${posting.dorm || posting.address}, which is in need of ${posting.curNumSeek || "an unknown number of"} more people`,
            html: `
                <p>A group is interested in your listing.</p>
                <p><strong>Name:</strong> ${pingData.name}</p>
                <p><strong>Message:</strong> ${pingData.message || "No message"}</p>
                <p><strong>Contact:</strong> ${pingData.searcherEmail}</p>
                <p> Follow up with them and see if they fulfill your housing needs. </p>
                <p> If they do, please Accept their interest and mark this posting (posting ID: ${postingDoc.id}) as "Fulfilled" by clicking the <strong> "Fulfilled" </strong> link below.</p>
                <p> If they don't please Reject their interest mark this posting mark as "Unfulfilled" by clicking the <strong> "Unfulfilled" </strong> link below, so that the group can continue their search.</p>
                <p> Currently your posting is marked as "Likely Fulfilled", so that other users are aware that this posting may become fullfilled should you agree to live with the interest party that sent this ping.</p>
                <p> <strong> If you are considering this interested party and need time to reach out, leave the status of this posting as is ("Likely Fulfilled"). </strong> </p>

                <p> Update the status of your posting:</p>
                <a href="${fulfillLink}" style="display: block; margin-bottom: 10px; background-color: green; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">✅ Accept and Mark Posting as Fulfilled</a>
                <a href="${unfulfillLink}" style="display: block; margin-bottom: 10px; background-color: red; color: white; padding: 10px 15px; text-decoration: none; margin-left: 10px; border-radius: 5px;">❌ Reject and Mark Posting as Unfulfilled</a>
                <a href="${unfulfillLink}" style="display: block; margin-bottom: 10px; background-color: gray; color: white; padding: 10px 15px; text-decoration: none; margin-left: 10px; border-radius: 5px;"> Unsubscribe from notifications regarding this ping</a>
                <p>Thank you for using Heights Housing!</p>
            `,
        };

        //Send the notification email to the admin, using Gmail

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email sent to ${adminEmail} regarding posting ID ${postingDoc.id}: ${info.response}`);

            // Update Firestore to "Likely Fulfilled" after email is sent
            await postingRef.update({ status: "Likely Fulfilled" });

            return info.response;
        } catch (error) {
            console.error(`Error sending email to admin ${adminEmail} for posting ID ${postingDoc.id}, triggered by ping sent by ${pingData.searcherEmail}:`, error);
            //throw new functions.https.HttpsError("internal", "Email sending failed", error); // Throws a structured error in Firebase Cloud Functions.
                                                                                            // throw stops function execution immediately. functions.https.HttpsError creates a Firebase-friendly error object.
                                                                                            // Internal is an error code used by firebase. Indicates that a server side error occurred.
            return null; // ✅ Ensure Promise resolves
        }
    } catch (error) {
        console.error("Error processing ping:", error);
        return null; // ✅ Ensure Promise resolves
    }
});

// Function 2a: Helper function for updatePostingStatus
// This helper function will send an email to all other searchers who sent a ping for a particular posting, but didn't get it fulfilled, notifying them of Unfullfillment.
const ignoreOtherPingsAndNotifySearchers = async (postId) => {

    try {
        console.log("Marking all other pings for this listing as 'Ignored'...");

        const otherPingsRef = db.collection("pings")
            .where("postID", "==", postId)
            .where("status", "==", "Pending")
            .get(); // ???

        const otherPingsSnapshot = await otherPingsRef.get();

        if (otherPingsSnapshot.empty) {
            console.log("No other pending pings to ignore.");
            return;
        }

        const batch = db.batch();
        otherPingsSnapshot.forEach((otherPing) => {
            batch.update(otherPing.ref, { status: "Ignored" });
        });

        await batch.commit();
        console.log(`Marked ${otherPingsSnapshot.docs.length} other pings as 'Ignored'.`);

        // Fetch corresponding posting
        const postingRef = db.collection("postings").doc(postId);
        const postingDoc = await postingRef.get();
        let posting;
        if (postingDoc.exists) {
            posting = postingDoc.data();
        } else {
            posting = null
        }

        // Send email to respective searcher of each ping
        await Promise.all(otherPingsSnapshot.docs.map(async (ping) => {
            const mailOptions = {
                from: '"Heights Housing" <team@heightshousing.com>',
                to: ping.data().searcherEmail,
                subject: "Your Interest in a Posting was Not Accepted",
                html: `<p> Hello ${ping.data().name}, </p>
                    <p> Unfortunately, ${posting?.adminContact?.name}'s posting for ${posting?.dorm || posting?.address} looking for ${posting?.curNumSeek} additional people has been fulfilled by another group.</p>
                    <p>We are sorry for this inconvenience and recommend checking out other available postings on Heights Housing.</p>
                    <p>Thank you for using our platform and we hope to continue serving you.</p>
                    <p> -Heights Housing Team</p>
                    `,
            };
            return transporter.sendMail(mailOptions);
        }));
        console.log("Notified all searchers whose pings were ignored.");
    } catch (error) {
        console.error("Error ignoring pings:", error);
    }
};

// Function 2c: Helper function for updatePostingStatus
// Depending on the value of status (Fulfilled or Unfulfilled), 
//this helper function will send an email to the specific user whose ping was accepted (confirm Fulfillment) or rejected (confirm Unfulfillment).
const notifySearcher = async (postId, pingId, status) => {
    try {

        const pingRef = db.collection("pings").doc(pingId);
        const postingRef = db.collection("postings").doc(postId); 
        const pingDoc = await pingRef.get(); // Get specific ping doc
        const postingDoc = await postingRef.get(); // Get specific posting doc

        // Ensure the document of the ping exists
        if (!pingDoc.exists) {
            console.warn(`Ping with ID ${pingId} not found. No notification sent.`);
            return;
        }
        console.log("Ping doc:", pingDoc);

        // Ensure the document of the posting exists
        if (!postingDoc.exists) {
            console.error(`Posting with ID ${postId} not found. No notification to searcher sent.`);
            return;
        }
        console.log("Posting doc:", postingDoc);

        const pingData = pingDoc.data();
        const posting = postingDoc.data();

        const searcherEmail = pingData.searcherEmail;

        if (!searcherEmail) {
            console.warn(`No email found for ping ${pingId}. Notification skipped.`);
            return;
        }

        // Email options
        let mailOptions; //intialize

        // Construct email based on status
        // Specify the Posting which did or didn't accept the searcher's ping

        if (status === "Fulfilled") {
            mailOptions = {
                from: '"Heights Housing" <team@heightshousing.com>',
                to: searcherEmail,
                subject: `ACCEPTED! Your Interest in ${posting.adminContact?.name}'s Posting for ${posting.dorm || posting.address} was Accepted!`,
                html: `
                    <p>Hello ${pingData.name},</p>
                    <p> <strong>${posting.adminContact?.name}'s </strong> posting for <strong>${posting.dorm || posting.address}</strong> looking for <strong>${posting.curNumSeek || "an unknown number of"} additional roommates</strong> has accepted your group's interest!</p>
                    <p> We thank you for using our platform to connect with the administrator of this on-campus housing post and wish you a wonderful living experience for the next year.</p>
                    <p>Reach out to us if need anything else or have feedback through the Contact Form on the Heights Housing website </p>
                    <p> All the best</p>
                    <p> -Heights Housing Team</p>`
            };
    
        } else if (status === "Unfulfilled") {
            mailOptions = {
                from: '"Heights Housing" <team@heightshousing.com>',
                to: searcherEmail,
                subject: `NOT ACCEPTED. Your Interest in ${posting.adminContact?.name}'s Posting for ${posting.dorm || posting.address} was Not Accepted`,
                html: `
                    <p>Hi ${searcherEmail},</p>
                    <p>Unfortunately, <strong> ${posting.adminContact?.name}'s </strong> Posting for <strong> ${posting.dorm || posting.address} </strong> looking for <strong> ${posting.curNumSeek || "an unknown number of"} additional roommates </strong> was not able to accommodate you.</p>
                    <p>We are sorry for the inconvenience. We recommend checking out other available postings on Heights Housing and reaching out to additional groups.</p>
                    <p>We appreciate you for using Heights Housing and hope to continue serving you.</p>`
            };
        }

        try {

            // Wraps the transporter.senMail function (which uses a callback) into a Promise-based structure,
            // making it work with async/await

            const info = await new Promise((resolve, reject) => {

                // Callback based function from node-mailer, meaning it does not return a promise
                transporter.sendMail(mailOptions, (error, response) => {
                    if (error) reject(error); // If error exists, calls reject(error) which makes the await statement throw an error
                    else resolve(response); // If successful, calls resolve(response) which makes the await statement return the response
                });
            });

            {/*const info = await transporter.sendMail(mailOptions); */}

            console.log(`Notification email sent to ${searcherEmail} for ${status === "Fulfilled" ? "Fulfilled" : "Ignored"} ping ${pingId} regarding ${posting.adminContact?.name}'s post for ${posting.dorm || posting.address}: ${info.response}`);
            return info.response;
        } catch (error) {
            console.error(`Error sending notification for ping ${pingId}:`, error);
            return null;
        }
        
    } catch (error) {
        console.error(`Error sending ignored ping notification for ping ${pingId}:`, error);
        return null
    }
};

// Function 2: updatePostingStatus

//Triggers when the updatePostingStatus HTTP endpoint is called
//Updates the status of a posting in Firestore to "Fulfilled" or "Unfulfilled"
//When  a ping is created, the email will contain clickable buttons 
//Clicking a button will send a request to updatePostingStatus function, which will update Firestore 
//and send back a confirmation message

// This function is an API endpoint that listens for GET requests
// Function parameters:
// req (request object) which represents the incoming HTTP request from the user"
    // Contains HTTPS method, the URL that request came from, query paramters (ie. status), 
// res (response object) which is used to send a response (data) back to the requesting user
    // Contains methods to send data (res.send), methods to set HTTP status codes (res.status(400), etc.) 
exports.updatePostingStatus = onRequest(async (req, res) => {
    try {
        console.log("Received request:", req.query); // ✅ Debugging
        const { postId, pingId, status } = req.query; // Extract parameters from URL

        if (!postId || !pingId || !status) return res.status(400).send("Missing postId, pingId, or status parameter.");

        const postingRef = db.collection("postings").doc(postId);
        const pingRef = db.collection("pings").doc(pingId);

        // Fetch documents in parallel
        const [postingDoc, pingDoc] = await Promise.all([postingRef.get(), pingRef.get()]);

        // Ensure the document of posting exists
        if (!postingDoc.exists) {
            console.error(`Posting with ID ${postId} not found.`);
            return res.status(404).send("Posting not found.");
        }
        console.log("Posting doc:", postingDoc);

        // Ensure ping doc exists
        if (!pingDoc.exists) {
            console.error(`Ping with ID ${pingId} not found.`);
            return res.status(404).send("Ping not found.");
        }
        console.log("Ping doc:", pingDoc);

        // Update the posting status in Firestore
        await postingRef.update({ status }); // How does the line of code work?
        console.log(`Posting ${postId} updated to ${status}`);


        // Determine new status for the ping
        const newPingStatus = status === "Fulfilled" ? "Fulfilled" : "Ignored";
        // Update only the specific ping in Firestore
        await pingRef.update({ status: newPingStatus });
        console.log(`Ping ${pingId} updated to '${newPingStatus}'`);

         // Handle additional actions based on the status update

        if (status === "Fulfilled") {
            await notifySearcher(postId, pingId, status);
            await ignoreOtherPingsAndNotifySearchers(postId);
        }

        {/* Admin's posting is marked as Unfulfilled and they'll receive follow-up emails regarding pending pings for this posting*/}
        if (status === "Unfulfilled") {
            await notifySearcher(postId, pingId, status);
        }

        return res.status(200).send(`Posting status and specific ping status updated to ${status} and ${newPingStatus}, respectively.`); // ✅ Return a response to the user
    } catch (error) {
        console.error("Error updating posting and/or ping status:", error);
        return res.status(500).send("Internal Server Error");
    }
});




// Function 3: followUpOnPendingPings (Admin)
// How followUpOnPendingPings implements the above goal:
    // Runs every 2 hours.
    // Finds all pings that have been "Pending" for over 2 hours.
    //Send a follow-up email to the posting admin, asking them to confirm or reject the specific ping.

    //If an admin responds to a ping with "Fulfilled" via email: 
        //Update that accepted ping to "Fulfilled" and Send a notification email confirming Fulfillment to the sender of that ping.
        //notify the admin that all other pings for that posting will be ignored.
        //Update all other pings for the posting to "Ignored" and email each searching party to confirm rejection.

    //If an admin responds to a ping with "Unfulfilled" via email: 
        //Update the rejected ping to "Unfulfilled" and send a notification email confirming Rejection to the sender of that ping.

exports.followUpOnPendingPings = onSchedule("every 2 hours", async () => {
    try {
        console.log("Running scheduled follow-up on pending pings...");

        const twoHoursAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 2 * 60 * 60 * 1000);

        // Find pings that have been "Pending" for over 48 hours
        const pingsSnapshot = await db.collection("pings")
            .where("status", "==", "pending")
            .where("timestamp", "<=", twoHoursAgo) // Pings older than 2 hours. TODO: Will the data type of timestamp field work with this implementation?
            .get();

        if (pingsSnapshot.empty) {
            console.log("No pending pings older than 2 hours found.");
            return null;
        }

        console.log(`Found ${pingsSnapshot.docs.length} pings to follow up on.`);

        // Process each ping
        const emailPromises = pingsSnapshot.docs.map(async (doc) => {
            const ping = doc.data();
            const postingRef = db.collection("postings").doc(ping.postID);
            const postingDoc = await postingRef.get();

            if (!postingDoc.exists) {
                console.warn(`Posting with ID ${ping.postID} not found for ping ${doc.id}.`);
                return null;
            }

            // Get post admin from each ping
            const posting = postingDoc.data();
            const adminEmail = posting.adminContact?.email;

            if (!adminEmail) {
                console.warn(`No admin email found for posting ${ping.postID}.`);
                return null;
            }

            const baseUrl = "https://us-central1-bcrs-e15d9.cloudfunctions.net/updatePostingStatus";
            // Generate unique links for this specific ping
            const fulfillLink = `${baseUrl}?postId=${ping.postID}&pingId=${doc.id}&status=Fulfilled`;
            const unfulfillLink = `${baseUrl}?postId=${ping.postID}&pingId=${doc.id}&status=Unfulfilled`;

            // Send follow-up email
            const mailOptions = {
                from: '"Heights Housing" <team@heightshousing.com>',
                to: adminEmail,
                subject: `Pending Interest in Your Listing for ${posting.dorm || posting.address}`,
                html: `
                    <p>You received an expression of interest from ${ping.searcherEmail} on ${ping.timestamp} for your posting for <strong>${posting.dorm || posting.address}</strong> looking for <strong>${posting.curNumSeek} additional roommates </strong>, but haven't responded yet.</p>
                    <p><strong>Message:</strong> ${ping.message || "No message provided"}</p>
                    <p> Currently your posting is marked as "Likely Fulfilled", so that other users are aware that this posting may become fullfilled should you agree to live with the interest party that sent this ping.</p>
                    <p> If you are considering this interested party and need time to reach out, take no action and leave the status of this posting as is ("Likely Fulfilled"). </p>
                    <p>If not, and you know you do or don't want to live with this group, please confirm the status of this inquiry:</p>
                    <a href="${fulfillLink}" style="display: block; margin-bottom: 10px; background-color: green; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">✅ Accept and Mark Posting as Fulfilled</a>
                    <a href="${unfulfillLink}" style="display: block; margin-bottom: 10px; background-color: red; color: white; padding: 10px 15px; text-decoration: none; margin-left: 10px; border-radius: 5px;">❌ Reject and Mark Posting as Unfulfilled</a>
                    <a href="${unfulfillLink}" style="display: block; margin-bottom: 10px; background-color: gray; color: white; padding: 10px 15px; text-decoration: none; margin-left: 10px; border-radius: 5px;"> Unsubscribe from notifications regarding this ping</a>
                    <p>Thank you for using Heights Housing!</p>
                `,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`Follow-up email sent to ${adminEmail} for ping ${doc.id} from searcher ${ping.searcherEmail}: ${info.response}`);
            return info.response;
        });

        await Promise.all(emailPromises); // Wait for all emails to send before exiting function
        console.log(`Follow-up on pending pings completed.`);
        return null;

    } catch (error) {
        console.error("Error processing follow-up on pending pings which have existed for more than 2hrs and remain pending:", error);
        return null;
    }
});


// ⌛️ Function 4: checkPendingPings (Searcher) 
// Runs automatically every 2 hours to check for pings that have been pending for over 2 hours.
// Notifies searchers that their ping has gone unanswered (neither accepted or rejected) and suggests looking for other postings.


exports.checkPendingPings = onSchedule("every 2 hours", async () => {
    try {
        console.log("Checking for pending pings...");

        const twoHoursAgo = admin.firestore.Timestamp.fromMillis(Date.now() - 2 * 60 * 60 * 1000); //How does this function work?
        const pingsRef = db.collection("pings");

        const snapshot = await pingsRef
        .where("status", "==", "pending") // Check only unresponded pings
        .where("timestamp", "<=", twoHoursAgo) // Older than 2 hours. TODO: Will the data type of timestamp field work with this implementation?
        .get();

        if (snapshot.empty) {
            console.log("No pending pings found.");
            return null;
        }

        //TODO: Fetch Post in this function and send email to searcher
        
        console.log(`Found ${snapshot.docs.length} pending pings.`);

        const emailPromises = snapshot.docs.map(async (doc) => {
            const pingData = doc.data();
            const userEmail = pingData.searcherEmail;

            // Fetch corresponding posting for each ping
            const postingRef = db.collection("postings").doc(pingData.postID);
            const postingDoc = await postingRef.get();
            let posting;
            if (postingDoc.exists) {
                posting = postingDoc.data();
            } else {
                posting = null
            }


            if (!userEmail) {
                console.warn(`Skipping ping ${doc.id} - No user email found.`);
                return null;
            }

            // ✅ Construct withdraw interest link
            const baseUrl = "https://us-central1-bcrs-e15d9.cloudfunctions.net/updatePostingStatus";
            const unfulfillLink = `${baseUrl}?postId=${postingDoc.id}&pingId=${event.params.pingId}&status=Unfulfilled`;

            try {
                const mailOptions = {
                    from: '"Heights Housing" <team@heightshousing.com>',
                    to: userEmail,
                    subject: "No Response from Listing Admin",
                    text: `Hello ${userEmail},\n\nYour interest in ${posting?.adminContact?.name}'s posting for ${posting?.dorm || posting?.address} looking for ${posting?.curNumSeek} additional people has not received a response within 2 hours. 
                            We recommend checking other available listings to continue your search.\n\n
                            Thank you for using Heights Housing!`,
                    html: `
                            <p>If you want to withdraw interest for this posting and not receive anymore notifications regarding it, click the link below</p>
                            <a href="${unfulfillLink}" style="background-color: red; color: white; padding: 10px 15px; text-decoration: none; margin-left: 10px; border-radius: 5px;"> Withdraw interest from <strong> ${posting?.adminContact?.name}'s </strong> post for <strong> ${posting?.dorm || posting?.address} </strong> looking for <strong> ${posting?.curNumSeek} </strong> additional people </a>
                          `
                          
                };

                const info = await transporter.sendMail(mailOptions);
                console.log(`Notification email sent to ${userEmail}: ${info.response}`);

                // ✅ Mark the ping as "Ignored" ?
                //await doc.ref.update({ status: "Ignored" });

                return info.response;
            } catch (emailError) {
                console.error(`Error sending pending (ignored) ping email to ${userEmail}:`, emailError);
                return null;
            }
        });
        
        await Promise.all(emailPromises);
        console.log(`Processed ${snapshot.docs.length} ignored pings.`);
        return null;
    } catch (error) {
        console.error("Error checking pending (ignored) pings:", error);
        return null;
    }
});


















//TODO (Decide if this function is necessary):
// ⏳ Function 3: Follow-up Email for "Likely Fulfilled Posts" (After 1 days)
//Runs automatically every 24 hours (Firebase Scheduler)
//Finds listings that have been marked "Likely Fulfilled".
//Sends a reminder email to listing admins asking them to confirm "Fulfillment" or signify "Unfulfillment"
//This function is deployed to Firebase and runs independently. It does not need user interaction.

{/*
    exports.sendFollowUpEmail = onSchedule("every 24 hours", async (event) => {
    //Tells Firebase to run this every day at the same time
    try {
        console.log("Running scheduled sendFollowUpEmail function...");
        const postingsRef = db.collection("postings");
        //Queries Firestore for all listings with "Likely Fulfilled" status
        //Listings marked "Likely Fulfilled" need admin confirmation
        const snapshot = await postingsRef.where("status", "==", "Likely Fulfilled").get(); //TODO: (Track the date it was marked as "Likely Fulfilled" ???) 
        if (snapshot.empty) {
            console.log("No 'Likely Fulfilled' postings found.");
            return null; // No postings to process, exit function. // ✅ Return explicitly
        }

        console.log(`Found ${snapshot.docs.length} listings to follow up.`);


        //Sends emails and collect results
        //Loops through all "likely fulfilled" postings
        //Sends a follow-up email asking the admin to confirm if their posting is "Fulfilled" or "Unfulfilled"
        //Ensure old postings get updated and don't stay "Likely Fulfilled" forever
        const emailPromises = snapshot.docs.map(async (doc) => {
                const posting = doc.data();
                const adminEmail = posting.adminContact?.email;

                if (!adminEmail) {
                    console.warn(`Skipping posting ${doc.id} - No admin email found.`);
                    return null; // ✅ Make sure every promise returns a value
                }

                try {

                    // This might be causing the issue
                    const fulfillLink = `https://us-central1-bcrs-e15d9.cloudfunctions.net/updatePostingStatus?postId=${doc.id}&status=Fulfilled`; //Need to add specific pingId as a parameter
                    const unfulfillLink = `https://us-central1-bcrs-e15d9.cloudfunctions.net/updatePostingStatus?postId=${doc.id}&status=Unfulfilled`;

                    const mailOptions = {
                        from: "vrjsingh04@gmail.com",
                        to: adminEmail,
                        subject: "Is your posting fulfilled?",
                        text: `Has your posting been fulfilled? Click below to confirm:\n\n✅ Yes (Auto-mark as Fulfilled) 
                        \n ⏳ If not, do you want to keep its status as "Likely Fulfilled" while you reach out to the current interested groups (So as to limit additional groups from reaching out to you?
                        \n 🔍 Or are none of the current interested groups fulfilling your needs and do you want to mark the postings as "Unfullfilled" to attract new potential roommates to your posting? 
                        \n Click your choice!`,
                        html: `
                        <p>Has your posting been fulfilled? Click below to confirm:</p>
                        <p> Update the status of your posting:</p>
                        <a href="${fulfillLink}" style="background-color: green; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">✅ Mark as Fulfilled</a>
                        <a href="${unfulfillLink}" style="background-color: red; color: white; padding: 10px 15px; text-decoration: none; margin-left: 10px; border-radius: 5px;">❌ Mark as Unfulfilled</a>
                        <p>Thank you for using Heights Housing!</p>`,
                    };

                    const info = await transporter.sendMail(mailOptions);
                    console.log(`Follow-up email sent to ${adminEmail}: ${info.response}`);
                    return info.response; // ✅ Return the result to resolve the Promise
                } catch (emailError) {
                    console.error(`Error sending email for posting ${doc.id}:`, emailError);
                    return null; // ✅ Make sure the Promise resolves
                }
            });
        
            await Promise.all(emailPromises); //Wait for all emails to send before exiting function

            console.log(`Follow-up email job completed. Sent ${emailPromises.length} emails.`);
            return null; // ✅ Properly return result to Firebase

        } catch (error) {
            console.error("Error processing follow-up emails:", error);
            //throw new functions.https.HttpsError("internal", "Failed to send follow-up emails", error); // Throws a structured error in Firebase Cloud Functions.
                                                                                                        // throw stops function execution immediately. functions.https.HttpsError creates a Firebase-friendly error object
                                                                                                        // Internal us an error code used by firebase. Indicates that a server side error occurred.
            return null; // ✅ Ensure Promise resolves
        }
    }); */}

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
