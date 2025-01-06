import React from 'react';
import css from "./styles/TopPost.module.css";

const Top = ({ building }) => {
    console.log(building);

  return (
    <div
      className={css.top}
      style={{
        backgroundImage: `url('/assets/oncampus/${building}.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );
};

export default Top;