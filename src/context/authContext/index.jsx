import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doSignOut } from "../../config/auth.jsx"; // ✅ Fixed Import Path
import { createUserInFirestore } from "../../services/userService";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
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
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    console.log("📡 Firebase auth state changed...");

                    try {
                        if (user) {
                            if (user.email.endsWith("@bc.edu")) {
                                if (!currentUser || currentUser.email !== user.email) {
                                    console.log("✅ Valid user signed in:", user.email);
                                    createUserInFirestore(user);
                                    setCurrentUser(user);
                                    setUserLoggedIn(true);
                                    
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
