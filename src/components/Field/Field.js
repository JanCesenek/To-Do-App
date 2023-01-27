import React, { useEffect } from "react";
import classes from "./Field.module.css";
import Subfield from "./Subfield/Subfield";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { fieldActions } from "../../redux/field-slice";
import { api } from "../../core/api";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/user-slice";

const Field = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams();
  const { category } = useParams();
  const fieldList = useSelector((state) => state.fields.fieldList);

  const modifiedCategory =
    !props.default && category[0]?.toUpperCase() + category?.slice(1).toLowerCase();

  const refreshFields = () => {
    api
      .get(`/users/${username}/fields`)
      .then((res) => {
        console.log(res.data);
        dispatch(fieldActions.setFieldList(res.data));
      })
      .catch((err) => console.log(`Get req - ${err}`));
  };

  useEffect(() => {
    dispatch(userActions.logIn());
    refreshFields();
  }, []);

  const deleteReq = () => {
    api
      .delete(`${location.pathname}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(`Delete req - ${err}`));
    refreshFields();
  };

  const logOut = () => {
    dispatch(userActions.logOut());
    navigate("/");
  };

  const deleteUser = () => {
    api
      .delete(`/users/${username}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(`Delete req - ${err}`));
    logOut();
  };
  return (
    <div className={classes.Background}>
      <div className={classes.Field}>
        <h2>{props.default ? "Default" : modifiedCategory}</h2>
        <Link to={`/users/${username}/fields/add`}>
          <button>Add New Category</button>
        </Link>
      </div>
      <Subfield importance="Insignificant" default={props.default ? true : false} />
      <Subfield importance="Important" default={props.default ? true : false} />
      <Subfield importance="Crucial" default={props.default ? true : false} />
      <ul className={classes.Links}>
        <li key="105">
          <Link to={`/users/${username}`}>Default</Link>
        </li>
        {fieldList.map((el) => {
          return (
            <li key={el._id}>
              <Link to={`/users/${username}/fields/${el.category}`}>{el.category}</Link>
            </li>
          );
        })}
      </ul>
      {!props.default && (
        <div className={classes.Buttons}>
          <Link to={`${location.pathname}/edit`}>
            <button>Edit &#10000;</button>
          </Link>
          <Link to={`/users/${username}`}>
            <button onClick={deleteReq}>Delete &#10005;</button>
          </Link>
        </div>
      )}
      <button className={classes.LogOut} onClick={logOut}>
        Log out
      </button>
      <button className={classes.DeleteUser} onClick={deleteUser}>
        Delete User
      </button>
    </div>
  );
};

export default Field;
