import React from "react";
import classes from "./Item.module.css";
import { api } from "../../../../core/api";
import { useLocation } from "react-router-dom";
import { itemActions } from "../../../../redux/item-slice";
import { useDispatch } from "react-redux";

const Item = (props) => {
  const dispatch = useDispatch();
  const classNames = require("classnames");
  const easy = props.difficulty === "easy" && classes.ItemEasy;
  const medium = props.difficulty === "medium" && classes.ItemMedium;
  const hard = props.difficulty === "hard" && classes.ItemHard;
  const itemColor = classNames(easy, medium, hard);
  const location = useLocation();

  const refreshFields = () => {
    api
      .get(`${location.pathname}/items`)
      .then((res) => {
        console.log(res.data);
        dispatch(itemActions.setItemList(res.data));
      })
      .catch((err) => console.log(`Error! Get method went wrong 😥 ${err}`));
  };

  const deleteReq = (id) => {
    api
      .delete(`${location.pathname}/items/${id}`)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(`Error! Delete method went wrong 😥 ${err}`));
    refreshFields();
  };

  return (
    <div className={`${itemColor} ${classes.Item}`}>
      <div className="ItemName">{props.name}</div>
      <div className="ItemDate">{props.deadline}</div>
      <a href={location.pathname} className={classes.NoSpecialEffects}>
        <div className="Cross" onClick={() => deleteReq(props.name)}>
          &#10005;
        </div>
      </a>
    </div>
  );
};

export default Item;
