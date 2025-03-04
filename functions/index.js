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
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vrjsingh04@gmail.com", //The Gmail address that will send emails. Replace with email of Heights housing
        pass: "wjsgkalhzpixzixx"
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
        const fulfillLink = `${baseUrl}?postId=${postingDoc.id}&status=Fulfilled`;
        const unfulfillLink = `${baseUrl}?postId=${postingDoc.id}&status=Unfulfilled`;

        // ✅ Create HTML email with clickable buttons
        //inludes the searcher's email and message
        const mailOptions = {
            from: '"Heights Housing" <vrjsingh04@gmail.com>',
            to: adminEmail,
            subject: `Interest in Your Posting for ${posting.dorm || posting.address}, which is in need of ${posting.curNumSeek || "an unknown number of"} more people`,
            html: `
                <p>Someone is interested in your listing.</p>
                <p><strong>Contact:</strong> ${pingData.searcherEmail}</p>
                <p><strong>Message:</strong> ${pingData.message || "No message"}</p>
                <p> Follow up with them and see if they fulfill your housing needs. </p>
                <p> If they do, please mark this posting (posting ID: ${postingDoc.id}) as "Fulfilled" by clicking the <strong> "Fulfilled" </strong> link below.</p>
                <p> If they don't please mark this posting mark as "Unfulfilled" by clicking the <strong> "Unfulfilled" </strong> link below, so that the group can continue their search.</p>
                <p> Currently your posting is marked as "Likely Fulfilled", so that other users are aware that this posting may become fullfilled should you agree to live with the interest party that sent this ping.</p>
                <p> If you are considering this interested party and need time to reach out, leave the status of this posting as is ("Likely Fulfilled"). </p>

                <p> Update the status of your posting:</p>
                <a href="${fulfillLink}" style="background-color: green; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">✅ Mark as Fulfilled</a>
                <a href="${unfulfillLink}" style="background-color: red; color: white; padding: 10px 15px; text-decoration: none; margin-left: 10px; border-radius: 5px;">❌ Mark as Unfulfilled</a>
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

    {/*}
    try {
        const mailOptions = {
            from: '"Heights Housing" <vrjsingh04@gmail.com>', // Shows as "Heights Housing" 
            to: adminEmail,
            subject: `Hello ${posting.adminContact?.name || "there"}, a group has expressed interest in Your Posting for ${posting.dorm || posting.address} which is looking for ${posting.curNumSeek} more people. 
                    Follow up with them and see if they fulfill your housing needs. If they do, please mark this posting (posting ID: ${postingDoc.id}) as "Fulfilled" on your profile. 
                    If not mark it as "Unfulfilled" so that the group can continue their search. Or have us do it for you. 
                    Currently your posting is marked as "Likely Fulfilled", 
                    so that other users are aware that this posting may become fullfilled should you agree to live 
                    with the interest party that sent this ping.
                    Thank you!`,
            text: `Someone is interested in your listing. \n\nContact: ${pingData.searcherEmail} \nMessage: ${pingData.message || "No message"}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        //Update the status of the posting to "Likely Fulfilled" if email is sent successfully
        await updateDoc(postingRef, { status: "Likely Fulfilled" });

        return info.response; // Properly return result to Firebase
    } catch (error) {
        console.error("Error sending email:", error);
        throw new functions.https.HttpsError("internal", "Email sending failed", error); // Throws a structured error in Firebase Cloud Functions.
                                                                                         // throw stops function execution immediately. functions.https.HttpsError creates a Firebase-friendly error object.
                                                                                         // Internal is an error code used by firebase. Indicates that a server side error occurred.
    } */}
});


// Function 2: Update Posting Status
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
        const { postId, status } = req.query; // Extract parameters from URL

        if (!postId || !status) {
            console.error("Missing postId or status parameter.");
            return res.status(400).send("Missing postId or status parameter.");
        }

        const postingRef = db.collection("postings").doc(postId);

        // Ensure the document exists
        const postingDoc = await postingRef.get();
        console.log("Posting doc:", postingDoc);
        if (!postingDoc.exists) {
            console.error(`Posting with ID ${postId} not found.`);
            return res.status(404).send("Posting not found.");
        }

        // Update Firestore with the new status
        await postingRef.update({ status }); // How does the line of code work?
        console.log(`Posting ${postId} updated to ${status}`);

        return res.status(200).send(`Posting status updated to ${status}`);
    } catch (error) {
        console.error("Error updating posting status:", error);
        return res.status(500).send("Internal Server Error");
    }
});


//TODO:
// ⏳ Function 3: Follow-up Email for "Likely Fulfilled Posts" (After 1 days)
//Runs automatically every 24 hours (Firebase Scheduler)
//Finds listings that have been marked "Likely Fulfilled".
//Sends a reminder email to listing admins asking them to confirm "Fulfillment" or signify "Unfulfillment"
//This function is deployed to Firebase and runs independently. It does not need user interaction.
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
                    const fulfillLink = `https://us-central1-bcrs-e15d9.cloudfunctions.net/updatePostingStatus?postId=${doc.id}&status=Fulfilled`;
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
    });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
