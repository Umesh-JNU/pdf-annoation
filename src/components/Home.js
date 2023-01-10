import React from "react";

const urlList = ["2212.08011", "2212.07937", "2212.07931"];

const Home = () => {
  return (
    <div className="css-heading">
      <div className="css-sub-heading">Documents</div>
      <div className="list">
        {urlList.map((url, i) => (
          <div className="list-items" key={i}>
            <a href={`/pdf-page/${url}`}>Sample document {i}.pdf</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
