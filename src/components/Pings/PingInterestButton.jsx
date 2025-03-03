import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { db } from "../../config/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";



const PingInterestButton = ({postID, admin}) => {

    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    //destructure currentUser from AuthContext
    const { currentUser, userLoggedIn } = useContext(AuthContext);

    console.log("currentUser:", currentUser);
    console.log("admin of post:", admin);

    const handlePing = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Please log in to ping interest");
            return;
        }

        if (currentUser.uid === admin.uid) {
            alert("You can't ping interest on your own post");
            return;
        }

        try {
            await addDoc(collection(db, "pings"), {
                postID,
                "searcherID": currentUser.uid,
                "searcherEmail": currentUser.email,
                message,
                "adminID": admin.uid,
                "timestamp": serverTimestamp(),
                "status": "pending", // Intitial status
            });

            alert("Your interest has been noted. The admin will contact you shortly.");
            setShowForm(false);
        } catch (error) {
            console.error("Error sending interest:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div>
            <button onClick={() => setShowForm(!showForm)}> Ping Interest</button>
            {showForm && (
                <form onSubmit={handlePing}>
                    <input
                        type="text"
                        value={postID}
                        readOnly
                    />
                     <input
                        type="text"
                        value={currentUser?.uid || ""}
                        readOnly
                    />
                    <input
                        type="text"
                        value={admin?.uid || ""}
                        readOnly
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value = {currentUser?.email || ""}
                        readOnly = {!!currentUser} //Explicit Boolean conversion of currentUser
                        required
                    />
                    <textarea
                        placeholder="Message (optional)"
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