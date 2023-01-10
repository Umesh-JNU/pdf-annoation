import React from "react";
//
const Box = ({ x1, y1, x2, y2, type }) => {
  return (
    <div className="box">
      <div>{`x: ${x1},`}</div>
      <div>{`y: ${y1},`}</div>
      <div>{`height: ${x2 - x1},`}</div>
      <div>{`width: ${y2 - y1}`}</div>
      <div className={type === "#ff744170" ? "title" : "author"}>
        {type === "#ff744170" ? "Title" : "Author"}
      </div>
    </div>
  );
};

export default Box;
