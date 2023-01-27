import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Error from "./components/404/404";
import Users from "./components/Users/Users";
import User from "./components/Users/User/User";
import Field from "./components/Field/Field";
import AddField from "./components/AddField/AddField";
import EditField from "./components/EditField/EditField";
import { api } from "./core/api";
import { userActions } from "./redux/user-slice";
import { useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        dispatch(userActions.setUserList(res.data));
        console.log(res.data);
      })
      .catch((err) => console.log(`Get req - ${err}`));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/users" />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:username" element={<User />} />
        <Route path="/users/:username/fields/default" element={<Field default />} />
        <Route path="/users/:username/fields/add" element={<AddField />} />
        <Route path="/users/:username/fields/:category" element={<Field />} />
        <Route path="/users/:username/fields/:category/edit" element={<EditField />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
};

export default App;
