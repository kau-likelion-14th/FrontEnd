import React, {useRef, useState} from "react";
import profileImg from "../../assets/image/profile.png";
import profileEdit from "../../assets/image/imgedit.png";
import profilemusic from "../../assets/image/search.png";


import { uploadProfile } from "../../Api";
import Config from "../../Config";
import YoutubeModal from "./YoutubeModal";

const Profile = () => {
  const fileInputRef = useRef(null);

  const [nickname, setNickname] = useState("Likelion#1253");
  const [intro, setIntro] = useState("안녕하세요");
  const [song, setSong] = useState("내꺼하자 - 인피니트");

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [isYoutubeOpen, setIsYoutubeOpen] = useState(false);

  const handleClickEditIcon = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const displayImageSrc = previewUrl || profileImageUrl || profileImg;

  const handleSave = async () => {
    try {
      // ✅ 서버가 받는 키가 "introduction"일 가능성이 높음(스웨거 result에 introduction이 있음)
      const data = await uploadProfile(
        Config.PROFILE.PUT,
        {
          intro: undefined, // 안 씀
          song: undefined,  // 안 씀
          imageFile: selectedImageFile,
          // uploadProfile이 intro/song 키로 넣도록 되어있으니 옵션으로 필드명 맞춤
        },
        {
          introField: "introduction",
          songField: "song", // 서버에 없으면 무시될 수 있음
          imageField: "image",
        }
      );

      // ✅ 스웨거 응답 구조 반영
      const result = data?.result;
      if (result?.profileImageUrl) {
        setProfileImageUrl(result.profileImageUrl);
      }
      if (result?.introduction !== undefined) {
        setIntro(result.introduction);
      }
      if (result?.userName) {
        setNickname(result.userName);
      }

      // 미리보기 정리
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedImageFile(null);

      alert("프로필 저장 완료!");
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      console.error("status:", error?.response?.status);
      console.error("data:", error?.response?.data);
      alert("프로필 저장 실패! 콘솔(status/data) 확인");
    }
  };

  return (
    <div className="profile-container">
        <div className="profile-section">
            <div className="profile-image">
                <img 
                    src={displayImageSrc} 
                    alt="프로필 이미지" 
                    className="profile-img" 
                />
                <img
                    src={profileEdit}
                    alt="프로필 수정 아이콘"
                    className="profile-img-edit"
                    onClick={handleClickEditIcon}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>
            <div className="profile-name">
                    {nickname}
            </div>
            <button className="profile-edit" onClick={handleSave}>프로필 저장</button>
        </div>
        <div className="profile-info">
            <div className="profile-details">
                <div className="profile-title">
                    한 줄 소개
                </div>
                <div className="profile-content-box">
                    <div className="profile-content">
                        <input
                            className="profile-content-input"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="profile-details">
                <div className="profile-title">
                    좋아하는 노래
                </div>
                <div className="profile-content-box">
                    <div className="profile-content">
                        <input
                            className="profile-content-input"
                            value={song}
                            onChange={(e) => setSong(e.target.value)}
                        />
                    </div>
                    <img
                        src={profilemusic}
                        alt="프로필 노래 수정 아이콘"
                        className="profile-search-icon"
                        onClick={() => setIsYoutubeOpen(true)}
                        style={{cursor: "pointer"}}
                    />
                </div>
            </div>
        </div>
        <YoutubeModal
          isOpen={isYoutubeOpen}
          onClose={() => setIsYoutubeOpen(false)}
          onPick={(picked) => setSong(picked.displayText || picked.title || "")}
        />
    </div>
  );
};

export default Profile;