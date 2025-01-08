import React from "react";
import css from "./styles/SignUp.module.css"


const SignUp = () => {
    return (
        <section className={css["signup-container"]}>
            <div className="signupDiv">
                <h1>Sign Up</h1>
                <form action="/signup" method="POST">
                    <input type="text" name="name" placeholder="Full Name" required />
                    <input type="email" name="email" placeholder="Email Address" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
                    <input type="date" name="dob" placeholder="Date of Birth" required />
                    <label>
                        <input type="checkbox" name="isBCStudent" value="yes" />
                            Are you a Boston College student?
                    </label>
                    <input type="tel" name="phone" placeholder="Phone Number (Optional)" />
                    <button type="submit">Sign Up</button>
                </form>
                <a href="/signIn">Already have an account? Sign In</a>
            </div>
      </section>
    )

};

export default SignUp;