import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence, deleteUser } from "firebase/auth";
import { doSignOut } from "../../config/auth.jsx"; // ✅ Fixed Import Path
import { createUserInFirestore } from "../../services/userService";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firestore";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

const result = null;

const checkUserExists = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    console.log("current user:", currentUser);
    console.log("user is logged in?:", userLoggedIn);
    console.log("loading:", loading);

    useEffect(() => {
        console.log("🔄 useEffect triggered: Checking authentication state...");

        // ✅ Set persistence to remember authentication across page reloads
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                const unsubscribe = onAuthStateChanged(auth, async (user) => {
                    console.log("📡 Firebase auth state changed...");

                    try {
                        if (user) {
                            if (user.email.endsWith("@bc.edu")) {
                                if (!currentUser || currentUser.email !== user.email) {
                                    if (await checkUserExists(user)) {
                                        console.log("✅ Valid user signed in:", user.email);
                                        setCurrentUser(user);
                                        setUserLoggedIn(true);
                                    } 
                                    if (!await checkUserExists(user)) {
                                        console.log("✅ Valid user signed in:", user.email);
                                        createUserInFirestore(user);
                                        setCurrentUser(user);
                                        setUserLoggedIn(true);
                                        const result = await Swal.fire({
                                            icon: "info",
                                            title: "Terms & Conditions",
                                            html: `
                                                <div style="max-height: 300px; overflow-y: auto; text-align: left; padding: 10px; border: 1px solid #ccc;">
                                                    <p><strong>1. Introduction</strong></p>
                                                    <p>Heights Housing is a platform designed to help individuals at Boston College find potential roommates. By using our website, you acknowledge and agree to the terms outlined in this Privacy & Liability Disclaimer.</p>

                                                    <p><strong>2. Data Collection & Security</strong></p>
                                                    <p>We collect limited personal information, including but not limited to:</p>
                                                    <ul>
                                                        <li>School email addresses</li>
                                                        <li>Group members’ names</li>
                                                        <li>Optional profile pictures</li>
                                                        <li>Housing location/address</li>
                                                    </ul>
                                                    <p>This information is used solely for the purpose of connecting users and facilitating roommate matching. While we implement reasonable security measures to protect user data, we cannot guarantee absolute security, and users submit their information at their own risk.</p>

                                                    <p><strong>3. User Responsibility</strong></p>
                                                    <p>By using our platform, you agree that:</p>
                                                    <ul>
                                                        <li>You are responsible for the accuracy of the information you provide.</li>
                                                        <li>You will not share false, misleading, or inappropriate content.</li>
                                                        <li>You will exercise caution and discretion when interacting with potential roommates, including when deciding to meet in person.</li>
                                                    </ul>

                                                    <p><strong>4. No Background Checks</strong></p>
                                                    <p>We do not conduct background checks, identity verification, or any form of screening on users. It is your sole responsibility to assess the compatibility and trustworthiness of potential roommates. However, only @bc.edu accounts are allowed to use the platform.</p>

                                                    <p><strong>5. Limitation of Liability</strong></p>
                                                    <p>By using our website, you acknowledge and agree that we are not liable for:</p>
                                                    <ul>
                                                        <li>Any disputes, conflicts, or damages arising from interactions between users.</li>
                                                        <li>Any harm, injury, theft, or misconduct that may result from roommate arrangements made through our platform.</li>
                                                        <li>Any unauthorized access to user data despite reasonable security measures.</li>
                                                    </ul>

                                                    <p><strong>6. Third-Party Links & Services</strong></p>
                                                    <p>Our website may contain links to third-party websites or services. We are not responsible for their content, policies, or practices. Users should review the privacy policies of third-party sites before providing any information.</p>

                                                    <p><strong>7. Changes to This Disclaimer</strong></p>
                                                    <p>We reserve the right to modify this Privacy & Liability Disclaimer at any time. Continued use of our website constitutes acceptance of any updates.</p>

                                                    <p><strong>8. Contact Information</strong></p>
                                                    <p>For any questions or concerns regarding this policy, please contact us at <a href="mailto:team@heightshousing.com">team@heightshousing.com</a></p>
                                                </div>

                                            `,
                                            width: 600, // Adjust modal width if needed
                                            showConfirmButton: true,
                                            confirmButtonText: "I Agree",
                                            confirmButtonColor: "#3085d6",
                                            showCancelButton: true,
                                            cancelButtonText: "I Disagree",
                                            cancelButtonColor: "#d33",
                                            allowOutsideClick: false,
                                        });
                                        
                                    
                                    if (result.isConfirmed) {
                                        console.log("User agreed to terms.");
                                        // const userRef = doc(db, "users", user.uid);
                                        // await setDoc(userRef, { 
                                        //     acceptedTerms: true, 
                                        //     termsAcceptedAt: serverTimestamp(),
                                        // });
                                        // const updatedUser = await getDoc(userRef);
                                        // console.log("User document updated:", updatedUser.data());
                                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                                        console.log("❌ User disagreed to terms. Signing out...");
                                        const user = auth.currentUser;

                                        if (user) {
                                            try {
                                                Swal.fire({
                                                    icon: "info",
                                                    title: "You must accept the terms to use Heights Housing.",
                                                    timer: 3000,
                                                    showConfirmButton: false,
                                                });
                                                await deleteUser(user); // Deletes the Firebase Auth account
                                                await doSignOut(); // Ensures user is completely logged out
                                                setUserLoggedIn(false);
                                                setCurrentUser(null);
                                
                                    
                                            } catch (error) {
                                                console.error("Error deleting user:", error);
                                                if (error.code === "auth/requires-recent-login") {
                                                    Swal.fire({
                                                        icon: "error",
                                                        title: "Session Expired",
                                                        text: "Please sign in again to accept the Terms & Conditions.",
                                                        timer: 4000,
                                                        showConfirmButton: false,
                                                    });
                                                    await doSignOut();
                                                }
                                            }
                                        }
                                    }
                                }                             
                                    // Swal.fire({
                                    //     icon: 'success',
                                    //     title: 'Welcome to Heights Housing!',
                                    //     text: 'You are now signed in.',
                                    //     showConfirmButton: false,
                                    //     timer: 3000
                                    // });
                                }
                            } else {
                                console.log("🚫 Invalid email domain, signing out...");
                                doSignOut();
                                setUserLoggedIn(false);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Access restricted. Only @bc.edu emails are allowed.',
                                    showConfirmButton: false,
                                    timer: 3000
                                });
                            }
                        } else {
                            console.log("🚪 No user signed in.");
                            setCurrentUser(null);
                            setUserLoggedIn(false);
                        }
                    } catch (error) {
                        console.error("Error handling authentication state change", error);
                    } finally {
                        setLoading(false);
                    }
                });

                return () => {
                    console.log("🛑 Cleanup: Unsubscribing from auth listener...");
                    unsubscribe();
                };
            })
            .catch((error) => {
                console.error("🔥 Error setting auth persistence:", error);
                setLoading(false);
            });

    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userLoggedIn, loading, setLoading }}>  {/* ✅ Fixed Context */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;