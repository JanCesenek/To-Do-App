import React, { useState } from "react";
import classes from "./AddField.module.css";
import { api } from "../../core/api";
import UseInput from "../../hooks/use-input";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { fieldActions } from "../../redux/field-slice";
import { useDispatch, useSelector } from "react-redux";

const AddField = () => {
  const [redirect, setRedirect] = useState();
  const { value, isValid, hasError, changeHandler, blurHandler, reset } = UseInput((value) =>
    /^[a-zA-Z]+$/.test(value)
  );
  const dispatch = useDispatch();
  const fieldList = useSelector((state) => state.fields.fieldList);
  const { username } = useParams();

  const refreshFields = () => {
    api
      .get(`/users/${username}/fields`)
      .then((res) => {
        console.log(res.data);
        dispatch(fieldActions.setFieldList(res.data));
      })
      .catch((err) => console.log(`Error! Get method went wrong 😥 ${err}`));
  };

  const postReq = () => {
    const finalValue = value[0]?.toUpperCase() + value?.slice(1).toLowerCase();
    const postReqPayload = {
      _id: uuidv4(),
      category: finalValue,
      username: username,
    };
    console.log(postReqPayload);
    setRedirect(`/users/${username}/fields/${finalValue}`);
    api
      .post(`/users/${username}/fields`, postReqPayload)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(`Error! Post method went wrong 😥 ${err}`));
    refreshFields();
    reset();
  };

  return (
    <div className="Form">
      <form action={redirect} onSubmit={postReq}>
        <input
          type="text"
          placeholder="Category"
          id="Category"
          value={value}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {hasError && <p className={classes.HasError}>Not valid!</p>}
        <button className={isValid ? "" : "Disabled"}>Submit</button>
      </form>
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
    </div>
  );
};

export default AddField;
