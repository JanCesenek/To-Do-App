import React, { useEffect } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../../core/api";
import { fieldActions } from "../../../redux/field-slice";
import Error from "../../404/404";

const User = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userList = useSelector((state) => state.users.userList);
  const fieldList = useSelector((state) => state.fields.fieldList);

  const { username } = useParams();
  const existingUser = userList.find((el) => el.username === username);

  useEffect(() => {
    api
      .get(`${location.pathname}/fields`)
      .then((res) => {
        console.log(userList);
        fieldList.length > 0 && dispatch(fieldActions.setFieldList(res.data));
        console.log(res.data);
      })
      .catch((err) => console.log(`Get req - ${err}`));
  }, []);

  return existingUser ? <Navigate to={`${location.pathname}/fields/default`} /> : <Error />;
};

export default User;
