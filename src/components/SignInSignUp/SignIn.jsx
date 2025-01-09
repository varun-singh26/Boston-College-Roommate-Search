import React from "react";
import css from "./styles/SignIn.module.css"

const SignIn = () => {
    return (
      <section className={css["signin-container"]}>
        <div className="signinDiv">
          <h1>Sign In</h1>
          <form action="/signin" method="POST">
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign In</button>
          </form>
          <a href="/signUp">Don't have an account? Sign Up</a>
          <a href="/forgot-password">Forgot your password?</a>
        </div>
      </section>
    )
};

export default SignIn