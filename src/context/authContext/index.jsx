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
                                                    <p>By accessing this service, you agree to abide by these terms and conditions.</p>
                                                    
                                                    <p><strong>2. User Responsibilities</strong></p>
                                                    <p>You must use this service responsibly and legally.</p>
                                        
                                                    <p><strong>3. Privacy Policy</strong></p>
                                                    <p>Your personal data is protected under our privacy policy.</p>
                                        
                                                    <p><strong>4. Service Limitations</strong></p>
                                                    <p>We reserve the right to modify or terminate the service at any time.</p>
                                        
                                                    <p><strong>5. Acceptance</strong></p>
                                                    <p>Clicking "I Agree" means you accept these terms in full.</p>
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