import React, { useRef, useState, useEffect } from "react";
import profileImg from "../../assets/image/profile.png";
import profileEdit from "../../assets/image/imgedit.png";
import profilemusic from "../../assets/image/search.png";


import { uploadProfile, get, put, post } from "../../Api";
import config from "../../Config";
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

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const data = await get(config.PROFILE.GET); 
      const result = data?.result;

      if (result) {
        // null이나 undefined가 올 경우를 대비해 "" (빈 문자열)을 넣어줍니다.
        console.log("프로필 데이터 확인:", result);
        setNickname(result.userName || "");
        setIntro(result.introduction || "");
        setSong(result.song || "");
        
        if (result.profileImageUrl) {
          setProfileImageUrl(result.profileImageUrl);
        }
      }
    } catch (error) {
      console.error("프로필 정보를 가져오는데 실패했습니다:", error);
    }
  };

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
      // 1. 한 줄 소개 저장 (JSON API: /api/profile/intro)
      // 스웨거 이미지에서 확인한 대로 'introduce' 키값을 사용합니다.
      await put(config.PROFILE.Intro, {
        introduce: intro 
      });
      console.log("한 줄 소개 저장 완료:", intro);

      // 2. 이미지 및 노래 정보 저장 (Multipart API: /api/profile)
      // ⚠️ 이미지를 새로 선택했을 때만 호출하여 '파일 비어있음' 에러(IMG_4001)를 방지합니다.
      if (selectedImageFile) {
        await uploadProfile(
          config.PROFILE.PUT,
          {
            // 백엔드 구조에 따라 노래 제목(song) 혹은 ID를 함께 보냅니다.
            song: song, 
            imageFile: selectedImageFile,
          },
          {
            songField: "song",  // 서버가 받는 노래 필드명 확인
            imageField: "image", // 스웨거의 'image' 필드명 일치
          }
        );
        console.log("이미지 업로드 완료");
      }

      // 3. 모든 저장이 끝난 후 최신 데이터를 다시 불러와 화면을 갱신합니다.
      await fetchProfileData();

      // 상태 초기화 (미리보기 및 선택된 파일 비우기)
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setSelectedImageFile(null);

      alert("프로필 정보가 저장되었습니다!");
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
      const errorMsg = error.response?.data?.message || "저장 실패";
      alert(`오류: ${errorMsg}`);
    }
  };

  const handlePickSong = async (picked) => {
  try {
    const songId = picked.songId || picked.id || picked.videoId;
    const songText = picked.displayText || `${picked.title} - ${picked.artist}`;

    // A. 내 저장곡 목록에 추가 (이미 구현된 부분)
    await post(config.YOUTUBE.SAVE, {
      songId: songId,
      title: picked.title,
      artist: picked.artist
    });

    // B. 프로필의 '좋아하는 노래' 필드 업데이트
    // 서버 API 구조에 따라 (1)Multipart 업로드 혹은 (2)일반 PUT 요청을 보냅니다.
    // 여기서는 간단하게 노래 텍스트만 서버로 보낸다고 가정합니다.
    await put(config.PROFILE.PUT_SONG_ONLY, { // 해당 API가 있는지 확인 필요
       song: songText 
    });

    alert("프로필 노래가 변경되었습니다!");
    await fetchProfileData(); // 최신 정보로 갱신
  } catch (error) {
    console.error("노래 저장 실패:", error);
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
          onPick={(picked) => {
            const songText = picked.displayText || `${picked.title} - ${picked.artist}`;
            setSong(songText); 
            handlePickSong(picked);
          }}
        />
    </div>
  );
};

export default Profile;