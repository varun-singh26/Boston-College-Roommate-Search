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

// Import functions to update documents in Firestore
import { updateDoc } from 'firebase/firestore';

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
        console.warn(`Skipping posting ${postingDoc.id} - No admin email found.`);
        return;
    }

    //Send the notification email to the admin, using Gmail
    //inludes the searcher's email and message

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
    }
});

//TODO:
// ⏳ Function 2: Follow-up Email for "Likely Fulfilled Posts" (After 1 days)
//Runs automatically every 24 hours (Firebase Scheduler)
//Finds listings that have been marked "Likely Fulfilled".
//Sends a reminder email to listing admins asking them to confirm "Fulfillment" or signify "Unfulfillment"
//This function is deployed to Firebase and runs independently. It does not need user interaction.
exports.sendFollowUpEmail = onSchedule("every 24 hours", async (event) => {
    //Tells Firebase to run this every day at the same time
    try {
        const postingsRef = db.collection("postings");
        //Queries Firestore for all listings with "Likely Fulfilled" status
        //Listings marked "Likely Fulfilled" need admin confirmation
        const snapshot = await postingsRef.where("status", "==", "Likely Fulfilled").get(); //TODO: (Track the date it was marked as "Likely Fulfilled" ???) 
        if (snapshot.empty) {
            console.log("No 'Likely Fulfilled' postings found.");
            return null; // No postings to process, exit function
        }

        //Loops through all "likely fulfilled" postings
        //Sends a follow-up email asking the admin to confirm if their posting is "Fulfilled" or "Unfulfilled"
        //Ensure old postings get updated and don't stay "Likely Fulfilled" forever
        const emailPromises = snapshot.docs.map(async (doc) => {
            try {
                const posting = doc.data();
                const adminEmail = posting.adminContact?.email;

                if (!adminEmail) {
                    console.warn(`Skipping posting ${doc.id} - No admin email found.`);
                    return;
                }

                const mailOptions = {
                    from: "vrjsingh04@gmail.com",
                    to: adminEmail,
                    subject: "Is your posting fulfilled?",
                    text: `Has your posting been fulfilled? Click below to confirm:\n\n✅ Yes (Auto-mark as Fulfilled) 
                    \n ⏳ If not, do you want to keep its status as "Likely Fulfilled" while you reach out to the current interested groups (So as to limit additional groups from reaching out to you?
                    \n 🔍 Or are none of the current interested groups fulfilling your needs and do you want to mark the postings as "Unfullfilled" to attract new potential roommates to your posting? 
                    \n Click your choice!`,
                };

                const info = await transporter.sendMail(mailOptions);
                    console.log(`Follow-up email sent to ${adminEmail}: ${info.response}`);
                } catch (emailError) {
                    console.error(`Error sending email for posting ${doc.id}:`, emailError);
                }
            });
        
            await Promise.all(emailPromises); //Wait for all emails to send before exiting function

            console.log(`Follow-up email job completed. Sent ${emailPromises.length} emails.`);
            return null; // Properly return result to Firebase

        } catch (error) {
            console.error("Error processing follow-up emails:", error);
            throw new functions.https.HttpsError("internal", "Failed to send follow-up emails", error); // Throws a structured error in Firebase Cloud Functions.
                                                                                                        // throw stops function execution immediately. functions.https.HttpsError creates a Firebase-friendly error object
                                                                                                        // Internal us an error code used by firebase. Indicates that a server side error occurred.
        }
    });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
