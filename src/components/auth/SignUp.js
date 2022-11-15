import React, { useState } from "react";
import "./SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function emailOnChange(e) {
    let emailError = document.getElementById("email-error");
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      emailError.className = "alert alert-danger signup-alert email";
    } else {
      emailError.className = "alert alert-danger signup-alert email hidden";
    }
  }

  function passwordOnChange(e) {
    const value = e.target.value;
    const id = e.target.id;
    let passwordError = document.getElementById("password-error");
    let matchingError1 = document.getElementById("matching-error1");
    let matchingError2 = document.getElementById("matching-error2");

    if (id === "password-signup") {
      //if we are int he password field, not the confirm password, set password
      setPassword(value);
      let confirmPassword = document.getElementById("confirm-password-signup");

      //if password and confirmPassword fields are not ===
      if (value !== confirmPassword.value) {
        //only want to show one error at a time
        passwordError.className =
          "alert alert-danger signup-alert password hidden";
        //show non matching error
        matchingError1.className = "alert alert-danger signup-alert matching";
        matchingError2.className = "alert alert-danger signup-alert matching ";
      } else if (!value) {
        //only want one error message to show
        matchingError1.className =
          "alert alert-danger signup-alert matching hidden";
        matchingError2.className =
          "alert alert-danger signup-alert matching hidden";

        //unhide correct error message
        passwordError.className = "alert alert-danger signup-alert password";
      } else {
        //hide error messages, no issues
        passwordError.className =
          "alert alert-danger signup-alert password hidden";
        matchingError1.className =
          "alert alert-danger signup-alert matching hidden";
        matchingError2.className =
          "alert alert-danger signup-alert matching hidden";
      }
    }
    //if we are looking at the value of confirmPassword
    else {
      let passwordSignup = document.getElementById("password-signup");
      //if the passwords dont match
      if (value !== passwordSignup.value) {
        //set non matching errors
        matchingError1.className = "alert alert-danger signup-alert matching";
        matchingError2.className = "alert alert-danger signup-alert matching";
        //hide no password error, only want one error to show
        passwordError.className =
          "alert alert-danger signup-alert password hidden";
      }
      //if there is no value for confirmPassword
      else if (!value) {
        //clear mathcing errors, only want one error to show
        matchingError1.className =
          "alert alert-danger signup-alert matching hidden";
        matchingError2.className =
          "alert alert-danger signup-alert matching hidden";

        //show no empty password error
        passwordError.className = "alert alert-danger signup-alert password";
      } else {
        passwordError.className =
          "alert alert-danger signup-alert password hidden";
        matchingError1.className =
          "alert alert-danger signup-alert matching hidden";
        matchingError2.className =
          "alert alert-danger signup-alert matching hidden";
      }
    }
  }

  function usernameOnChange(e) {
    const value = e.target.value;
    let usernameError = document.getElementById("username-error");

    setUsername(value);
    if (!value) {
      usernameError.className = "alert alert-danger signup-alert username";
    } else {
      usernameError.className +=
        "alert alert-danger signup-alert username hidden";
    }
  }
  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-5">
          <form className="px-4 py-3 needs-validation">
            <h3 className="text-center">Sign Up!</h3>
            <div className="mb-3">
              <label
                htmlFor="exampleDropdownFormUsername1"
                className="form-label"
              >
                Username
              </label>
              <div
                id="username-error"
                className="alert alert-danger signup-alert username hidden"
                role="alert"
              >
                Username cannot be blank
              </div>
              <input
                type="text"
                className="form-control"
                id="exampleDropdownFormUsername1"
                placeholder="Enter Username"
                value={username}
                onChange={usernameOnChange}
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="exampleDropdownFormPassword1"
                className="form-label"
              >
                Password
              </label>
              <div
                id="password-error"
                className="alert alert-danger signup-alert password hidden"
                role="alert"
              >
                Password cannot be blank
              </div>
              <div
                id="matching-error1"
                className="alert alert-danger signup-alert matching hidden"
                role="alert"
              >
                Passwords must match
              </div>
              <input
                type="password"
                className="form-control"
                id="password-signup"
                placeholder="Enter Password"
                onChange={passwordOnChange}
                value={password}
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="exampleDropdownFormPassword1"
                className="form-label"
              >
                Confirm Password
              </label>
              <div
                id="matching-error2"
                className="alert alert-danger signup-alert matching hidden"
                role="alert"
              >
                Passwords must match
              </div>
              <div
                id="password-error"
                className="alert alert-danger signup-alert password hidden"
                role="alert"
              >
                Password cannot be blank
              </div>
              <input
                type="password"
                className="form-control"
                id="confirm-password-signup"
                placeholder="Enter Password"
                onChange={passwordOnChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleDropdownFormEmail1" className="form-label">
                Email address
              </label>
              <div
                id="email-error"
                className="alert alert-danger signup-alert email hidden"
                role="alert"
              >
                Email cannot be blank
              </div>
              <input
                type="email"
                className="form-control"
                id="exampleDropdownFormEmail1"
                placeholder="Enter Email"
                onChange={emailOnChange}
                value={email}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => {
                console.log(email);
                console.log(username);
                console.log(password);
              }}
            >
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
