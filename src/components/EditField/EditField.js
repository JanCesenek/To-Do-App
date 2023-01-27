import React, { useState } from "react";
import classes from "./EditField.module.css";
import { api } from "../../core/api";
import { fieldActions } from "../../redux/field-slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

const EditField = () => {
  const { username } = useParams();
  const { category } = useParams();

  const dispatch = useDispatch();
  const fieldList = useSelector((state) => state.fields.fieldList);
  const [redirect, setRedirect] = useState("");
  const [enteredValue, setEnteredValue] = useState(category);
  const [isTouched, setIsTouched] = useState(false);
  const valueIsValid = /^[a-zA-Z]+$/.test(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const fieldMatch = fieldList.find((el) => el.category === category);

  const changeHandler = (event) => {
    setEnteredValue(event.target.value);
  };

  const blurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  const refreshFields = () => {
    api
      .get(`/users/${username}/fields`)
      .then((res) => {
        console.log(res.data);
        dispatch(fieldActions.setFieldList(res.data));
      })
      .catch((err) => console.log(`Error! Post method went wrong 😥 ${err}`));
  };

  const putReq = (id) => {
    const finalValue = enteredValue[0]?.toUpperCase() + enteredValue?.slice(1).toLowerCase();
    const putReqPayload = {
      _id: id,
      category: finalValue,
      username: username,
    };
    setRedirect(`/users/${username}/fields/${finalValue}`);
    console.log(putReqPayload);
    api
      .put(`/users/${username}/fields/${category}`, putReqPayload)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(`Error! Put request went wrong 😥 ${err}`));
    refreshFields();
    reset();
  };

  return (
    <div className="Form">
      <form action={redirect} onSubmit={() => putReq(fieldMatch._id)}>
        <input
          type="text"
          placeholder="Category"
          id="Category"
          value={enteredValue}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {hasError && <p className="HasError">Not valid!</p>}
        <button className={valueIsValid ? "" : "Disabled"}>Submit</button>
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

export default EditField;
