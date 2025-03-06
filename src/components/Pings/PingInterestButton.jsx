import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { db } from "../../config/firestore";
import { collection, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import Swal from "sweetalert2";



const PingInterestButton = ({postID, admin}) => {

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    //destructure currentUser from AuthContext
    const { currentUser, userLoggedIn } = useContext(AuthContext);

    console.log("currentUser:", currentUser);
    console.log("admin of post:", admin);

    const handlePing = async (e) => {
        e.preventDefault();

        console.log("Post ID:", postID);
        const postingRef = doc(db, "postings", postID); // Get reference to specific posting doc
        const postingDoc = await getDoc(postingRef) // Get specific posting doc
        const post = postingDoc.data() // Get data from posting doc
        console.log("Fetched post data:", post); // Debugging statement


        if (!currentUser) {
            Swal.fire({
                icon: "error",
                title: "Please log in.",
                text: "You must be logged in to ping interest to another group.",
                confirmButtonColor: "#501315",
                confirmButtonText: "OK",
              });
            return;
        }

        if (currentUser.uid === admin.uid) {
            Swal.fire({
                icon: "error",
                title: "Can't ping interest.",
                text: "You can't ping interest for your own post",
                confirmButtonColor: "#501315",
                confirmButtonText: "OK",
              });
            return;
        }

        if (post.status === "Fulfilled") {
            Swal.fire({
                icon: "error",
                title: "Post Fulfilled",
                text: "This post has already been fulfilled",
                confirmButtonColor: "#501315",
                confirmButtonText: "OK",
              });
            return;
        }

        

        try {
            // Show loading alert
            Swal.fire({
                title: "Sending Ping...",
                text: "Please wait while we notify the posting administrator of your interest.",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            await addDoc(collection(db, "pings"), {
                postID,
                "searcherID": currentUser.uid,
                "searcherEmail": currentUser.email,
                message,
                "adminID": admin.uid,
                "timestamp": serverTimestamp(),
                "status": "pending", // Intitial status
            });

            // Show success alert
            Swal.fire({
                icon: "success",
                title: "Ping Sent to Post Administrator!",
                text: `The administrator of this posting has been notified of your group's interest via email.`,
                confirmButtonColor: "#501315",
                confirmButtonText: "OK",
              });

            setShowForm(false);
        } catch (error) {
            console.error("Error sending interest:", error);
            // Show error alert
            Swal.fire({
                icon: "error",
                title: "Unable to send Ping to Post Administrator",
                text: "An error occurred while trying to notify the administrator of this post of your group's interest. Please try again.",
                confirmButtonColor: "#501315",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div>
            <button onClick={() => setShowForm(!showForm)}> Ping Interest</button>
            {showForm && (
                <form onSubmit={handlePing}>
                    <input
                        type="text"
                        value={`Post ID: ${postID}`}
                        readOnly
                    />
                    <input
                        type="text"
                        value={`Post Admin ID: ${admin?.uid}` || ""}
                        readOnly
                    />
                     <input
                        type="text"
                        value={`Your User ID: ${currentUser?.uid}` || ""}
                        readOnly
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value = {`Your email: ${currentUser?.email}` || ""}
                        readOnly = {!!currentUser} //Explicit Boolean conversion of currentUser
                        required
                    />
                    <textarea
                        placeholder="Message from you to the post admin (We recommend introducing yourself and your group, what you're looking for in terms of living situation, and dropping an email, phone number, or other contact info)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit">Send Interest</button>
                </form>
            )}
        </div>
    );
};

export default PingInterestButton;