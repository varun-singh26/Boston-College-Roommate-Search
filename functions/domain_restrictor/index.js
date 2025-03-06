/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.restrictEmailDomain = functions.auth.user().onCreate((user) => {
    const allowedDomain = "bc.edu";  // Change to your allowed domain
    const email = user.email || "";

    if (!email.endsWith(`@${allowedDomain}`)) {
        return admin.auth().deleteUser(user.uid)
            .then(() => console.log(`❌ Unauthorized sign-up blocked: ${email}`))
            .catch(error => console.error("Error deleting user:", error));
    }

    console.log(`✅ Authorized user: ${email}`);
    return null;
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
