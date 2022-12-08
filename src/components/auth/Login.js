import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SignUp.css";

const Login = () => {
  require("react-dom");
  window.React2 = require("react");
  console.log(window.React1 === window.React2);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  function passwordOnChange(e) {
    setLoginError(false);
    const value = e.target.value;
    let passwordError = document.getElementById("password-error");

    //set password
    setPassword(value);

    //if password and confirmPassword fields are not ===
    if (!value) {
      //unhide correct error message
      passwordError.className = "alert alert-danger signup-alert password";
    } else {
      //hide error messages, no issues
      passwordError.className =
        "alert alert-danger signup-alert password hidden";
    }
  }

  function usernameOnChange(e) {
    setLoginError(false);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(
        `https://mighty-island-30403.herokuapp.com/https://dimensional-dungeon-api.herokuapp.com/api/v1/login?username=${username}&password=${password}`
      )
      .then((response) => {
        console.log(response);
        const data = response.data;
        const { username, authorities, access_token, refreshToken } = data;
        const roles = [];
        for (let i = 0; i < authorities.length; i++) {
          roles.push(authorities[i].authority);
        }
        setUserInfo({
          username: username,
          roles: roles,
          access_token: access_token,
          refreshToken: refreshToken,
        });

        console.log(username);
      });
    // .catch(function (error) {
    //   setLoginError(true);
    // });
  };

  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-5">
          <form className="px-4 py-3 needs-validation">
            <h3 className="text-center">Log In!</h3>
            {loginError ? (
              <div
                id="login-error"
                className="alert alert-danger login-error"
                role="alert"
              >
                Invalid credentials
              </div>
            ) : null}
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

            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => {
                console.log(username);
                console.log(password);
                onSubmit(e);
              }}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
