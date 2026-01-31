import React from "react";
import profileImg from "../../assets/image/profile.png";
import profileEdit from "../../assets/image/imgedit.png";
import profilemusic from "../../assets/image/search.png";

const Profile = () => {

  return (
    <div className="profile-container">
        <div className="profile-section">
            <div className="profile-image">
                <img 
                    src={profileImg} 
                    alt="프로필 이미지" 
                    className="profile-img" 
                />
                <img
                    src={profileEdit}
                    alt="프로필 수정 아이콘"
                    className="profile-img-edit"
                />
            </div>
            <div className="profile-name">
                    Likelion#1253
            </div>
            <button className="profile-edit">프로필 저장</button>
        </div>
        <div className="profile-info">
            <div className="profile-details">
                <div className="profile-title">
                    한 줄 소개
                </div>
                <div className="profile-content-box">
                    <div className="profile-content">
                        안녕하세요
                    </div>
                </div>
            </div>
            <div className="profile-details">
                <div className="profile-title">
                    좋아하는 노래
                </div>
                <div className="profile-content-box">
                    <div className="profile-content">
                        🎵 내꺼하자 - 인피니트
                    </div>
                    <img
                        src={profilemusic}
                        alt="프로필 노래 수정 아이콘"
                        className="profile-search-icon"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;