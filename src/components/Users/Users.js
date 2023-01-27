import React from "react";
import classes from "./Users.module.css";
import UseInput from "../../hooks/use-input";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/user-slice";
import { api } from "../../core/api";
import { v4 as uuidv4 } from "uuid";

const Users = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const refreshUserData = () => {
    api
      .get("/users")
      .then((res) => {
        console.log(res.data);
        dispatch(userActions.setUserList(res.data));
      })
      .catch((err) => console.log(`Get req - ${err}`));
  };

  const userList = useSelector((state) => state.users.userList);
  const loggedIn = useSelector((state) => state.users.loggedIn);
  const newUser = useSelector((state) => state.users.newUser);

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    changeHandler: firstNameChangeHandler,
    blurHandler: firstNameBlurHandler,
    reset: firstNameReset,
  } = UseInput((value) => /^[a-zA-Z]+$/.test(value) && value.length >= 2);
  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    changeHandler: lastNameChangeHandler,
    blurHandler: lastNameBlurHandler,
    reset: lastNameReset,
  } = UseInput((value) => /^[a-zA-Z]+$/.test(value) && value.length >= 2);
  const {
    value: usernameValue,
    isValid: usernameIsValid,
    hasError: usernameHasError,
    changeHandler: usernameChangeHandler,
    blurHandler: usernameBlurHandler,
    reset: usernameReset,
  } = UseInput((value) => value.trim !== "");
  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    changeHandler: passwordChangeHandler,
    blurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = UseInput((value) => value.length >= 8 && value.length <= 16);
  const {
    value: passwordCheckValue,
    isValid: passwordCheckIsValid,
    hasError: passwordCheckHasError,
    changeHandler: passwordCheckChangeHandler,
    blurHandler: passwordCheckBlurHandler,
    reset: passwordCheckReset,
  } = UseInput((value) => value.length >= 8 && value.length <= 16);

  const hardReset = () => {
    firstNameReset();
    lastNameReset();
    usernameReset();
    passwordReset();
    passwordCheckReset();
  };

  const signUpValid =
    firstNameIsValid && lastNameIsValid && passwordIsValid && passwordCheckIsValid;
  const logInValid = usernameIsValid && passwordIsValid;

  const logIn = (data) => {
    const match = userList.find(
      (el) => el.username === data.username && el.password === data.password
    );
    const letUserIn = () => {
      console.log(location.pathname);
      navigate(`${location.pathname}/${data.username}`);
      dispatch(userActions.logIn());
    };
    match ? letUserIn() : alert("Incorrect details, please enter a valid username and password!");
    hardReset();
  };

  const addUser = () => {
    const firstName = firstNameValue[0]?.toUpperCase() + firstNameValue?.slice(1).toLowerCase();
    const lastName = lastNameValue[0]?.toUpperCase() + lastNameValue?.slice(1).toLowerCase();
    const username = firstName[0] + lastName[0] + Math.trunc(Math.random() * 1000);
    const password = passwordValue;
    const postReqPayload = {
      _id: uuidv4(),
      firstName,
      lastName,
      username,
      password,
    };
    api
      .post("/api/users", postReqPayload)
      .then((res) => {
        console.log(res.data);
        dispatch(userActions.setUserList(res.data));
      })
      .catch((err) => console.log(`Post req - ${err}`));
    refreshUserData();
    logIn({ username, password });
  };

  return (
    <div>
      {!loggedIn && (
        <div>
          <button
            className={classes.SwitchButton}
            onClick={() => {
              dispatch(userActions.toggleNewUser());
              hardReset();
            }}>
            {newUser ? "I already have an account" : "I don't have an account yet"}
          </button>
          {newUser ? (
            <form className={classes.DefaultForm} action="/user/:username" onSubmit={addUser}>
              <div className={classes.DefaultFormInputs}>
                <label htmlFor="firstName">First name:</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={firstNameValue}
                  onChange={firstNameChangeHandler}
                  onBlur={firstNameBlurHandler}
                  style={
                    firstNameHasError ? { border: "1px solid red" } : { border: "1px solid green" }
                  }
                />
              </div>
              <div className={classes.DefaultFormInputs}>
                <label htmlFor="lastName">Last name:</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={lastNameValue}
                  onChange={lastNameChangeHandler}
                  onBlur={lastNameBlurHandler}
                  style={
                    lastNameHasError ? { border: "1px solid red" } : { border: "1px solid green" }
                  }
                />
              </div>
              <div className={classes.DefaultFormInputs}>
                <label htmlFor="password">Password (8-16 characters):</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={passwordValue}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  style={
                    passwordHasError ? { border: "1px solid red" } : { border: "1px solid green" }
                  }
                />
              </div>
              <div className={classes.DefaultFormInputs}>
                <label htmlFor="passwordCheck">Type your password again (security reasons):</label>
                <input
                  type="password"
                  name="passwordCheck"
                  id="passwordCheck"
                  value={passwordCheckValue}
                  onChange={passwordCheckChangeHandler}
                  onBlur={passwordCheckBlurHandler}
                  style={
                    passwordCheckHasError
                      ? { border: "1px solid red" }
                      : { border: "1px solid green" }
                  }
                />
              </div>
              <button className={signUpValid ? "" : "Disabled"}>Sign up</button>
            </form>
          ) : (
            <form
              className={classes.DefaultForm}
              onSubmit={() => logIn({ username: usernameValue, password: passwordValue })}>
              <div className={classes.DefaultFormInputs}>
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={usernameValue}
                  onChange={usernameChangeHandler}
                  onBlur={usernameBlurHandler}
                  style={
                    usernameHasError ? { border: "1px solid red" } : { border: "1px solid green" }
                  }
                />
              </div>
              <div className={classes.DefaultFormInputs}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={passwordValue}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  style={
                    passwordHasError ? { border: "1px solid red" } : { border: "1px solid green" }
                  }
                />
              </div>
              <button className={logInValid ? "" : classes.Disabled}>Log in</button>
            </form>
          )}
          {userList.length && <h1>List of users:</h1>}
          <div className={classes.UserListContainer}>
            {userList.map((el) => {
              return (
                <div key={Math.random()} className={classes.UserList}>
                  <p key={Math.random()}>{el.firstName}</p>
                  <p key={Math.random()}>{el.lastName}</p>
                  <p key={Math.random()}>{el.username}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
