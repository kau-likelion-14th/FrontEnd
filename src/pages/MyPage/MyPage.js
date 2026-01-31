import React from "react";
import Statistics from "./Status";
import Profile from "./Profile";
import "../../styles/MyPage.css";

const MyPage = () => {
  return (
    <div className="page-container">
      <Profile />
      <Statistics />
    </div>
  );
};

export default MyPage;