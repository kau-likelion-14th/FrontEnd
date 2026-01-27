import React from "react";
import profileImg from "../../assets/image/profile.png";
import musicImg from "../../assets/image/music.png";

const Profile = () => {
  return (
    <div className="profile-container">
        <div className="profile-section">
            <div className="profile-element">
                <img 
                    src={profileImg} 
                    alt="프로필 이미지" 
                    className="profile-image" 
                />
                <div className="profile-info">
                    <div className="profile-name">
                        LikeLion
                        <span className="profile-id">#1253</span>
                    </div>
                    <div className="profile-details">
                        <div className="profile-write">안녕하세요</div>
                        <div className="profile-music">
                            <img 
                                src={musicImg} 
                                alt="음악 아이콘" 
                                className="music-icon" 
                            />
                            노래
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="profile-section">
            <button className="profile-edit">프로필 편집</button>
        </div>
    </div>
  );
};

export default Profile;