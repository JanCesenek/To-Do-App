import React, { useEffect, useState } from "react";
import classes from "./Subfield.module.css";
import { api } from "../../../core/api";
import UseInput from "../../../hooks/use-input";
import { v4 as uuidv4 } from "uuid";
import Item from "./Item/Item";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useParams } from "react-router-dom";
import { itemActions } from "../../../redux/item-slice";

const Subfield = (props) => {
  const { username } = useParams();
  const { category } = useParams();

  const dispatch = useDispatch();
  const location = useLocation();
  const selected = useSelector((state) => state.items.selected);
  const itemList = useSelector((state) => state.items.itemList);

  const [hidden, setHidden] = useState(true);

  const refreshItems = () => {
    api
      .get(`${location.pathname}/items`)
      .then((res) => {
        dispatch(itemActions.setItemList(res.data));
        console.log(res.data);
      })
      .catch((err) => {
        console.log(`Get req - ${err}`);
      });
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    changeHandler: nameChangeHandler,
    blurHandler: nameBlurHandler,
    reset: nameReset,
  } = UseInput((value) => /^[a-zA-Z]+$/.test(value));
  const {
    value: dateValue,
    isValid: dateIsValid,
    hasError: dateHasError,
    changeHandler: dateChangeHandler,
    blurHandler: dateBlurHandler,
    reset: dateReset,
  } = UseInput((value) => value !== `${NaN}/${NaN}/${NaN}`);

  const postReq = () => {
    const day = new Date(dateValue).getDate();
    const month = new Date(dateValue).getMonth() + 1;
    const year = new Date(dateValue).getFullYear();
    const finalName = nameValue[0]?.toUpperCase() + nameValue?.slice(1).toLowerCase();
    const postReqPayload = {
      _id: uuidv4(),
      name: finalName,
      date: `${day.toString()}/${month.toString()}/${year.toString()}`,
      difficulty: selected,
      importance: props.importance,
      username: username,
      category: props.default ? "Default" : category,
    };
    console.log(postReqPayload);
    api
      .post(`${location.pathname}/items`, postReqPayload)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(`Post req - ${err}`));
    refreshItems();
    nameReset();
    dateReset();
    setHidden(true);
  };

  const itemFilter = itemList.filter((el) => el.importance === props.importance);

  return (
    <div className={classes.Subfield}>
      <div className={classes.SubfieldTop}>
        <h2>{props.importance}</h2>
        <button type="button" onClick={() => setHidden(!hidden)}>
          {hidden ? "+" : "-"}
        </button>
        {!hidden && (
          <div>
            <input
              type="text"
              value={nameValue}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
              placeholder="Name your task"
            />
            {nameHasError && <p className={classes.HasError}>Not valid! Only letters allowed...</p>}
            <input
              type="date"
              value={dateValue}
              onChange={dateChangeHandler}
              onBlur={dateBlurHandler}
              name="deadline"
              id="deadline"
            />
            {dateHasError && <p className={classes.HasError}>Not valid! Enter a valid date...</p>}
            <select
              name="difficulty"
              id="difficulty"
              value={selected}
              onChange={(e) => dispatch(itemActions.setSelected(e.target.value || "easy"))}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <a className="AddItem" href={`/users/${username}/fields/${category}`}>
              <button className={!nameIsValid || !dateIsValid ? "Disabled" : ""} onClick={postReq}>
                &#10003;
              </button>
            </a>
          </div>
        )}
      </div>
      {itemFilter.map((el) => {
        return (
          <div className={classes.Item} key={el._id}>
            <Item name={el.name} deadline={el.date} difficulty={el.difficulty} id={el._id} />
          </div>
        );
      })}
    </div>
  );
};

export default Subfield;
