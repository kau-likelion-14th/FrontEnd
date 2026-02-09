// FriendPage.js에서 필요한 부분만 반영하면 됨
import React, { useMemo, useState } from "react";
import FriendList from "./FriendList";
import FriendSearch from "./FriendSearch";
import FriendUnfollowModal from "./FriendUnfollowModal"; 
import "../../styles/FriendPage.css";

function FriendPage() {
  const [followList, setFollowList] = useState([
    { id: "u1", name: "김예나", tag: "1234", bio: "안녕하세요" },
    { id: "u4", name: "김동현", tag: "4444", bio: "." },
  ]);

  const [searchUsers] = useState([
    { id: "u1", name: "김예나", tag: "1234", bio: "안녕하세요" },
    { id: "u2", name: "전유안", tag: "1111", bio: "우왕" },
    { id: "u3", name: "전성환", tag: "5555", bio: ";ㅁ;" },
    { id: "u4", name: "김동현", tag: "4444", bio: "." },
    { id: "u5", name: "문채영", tag: "5555", bio: "네?" },
    { id: "u6", name: "이서정", tag: "6666", bio: "?" },
    { id: "u7", name: "이승주", tag: "7777", bio: "뭐요" },
    { id: "u8", name: "권용현", tag: "8888", bio: "허허허" },
    { id: "u9", name: "강민준", tag: "9999", bio: "이예에에~~??" },
    { id: "u10", name: "양지말", tag: "0000", bio: "엥" },
  ]);

  const followIds = useMemo(() => new Set(followList.map((x) => x.id)), [followList]);

  // ✅ 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleRemove = (friend) => {
    setFollowList((prev) => prev.filter((x) => x.id !== friend.id));
  };

  const handleFollow = (user) => {
    if (followIds.has(user.id)) return;
    setFollowList((prev) => [...prev, user]);
  };

  // ✅ 삭제 버튼 클릭 시: 모달만 띄움
  const handleClickRemove = (friend) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  };

  // ✅ 모달에서 "예" 누르면 실제 삭제
  const handleConfirmRemove = () => {
    if (selectedFriend) handleRemove(selectedFriend);
    setIsModalOpen(false);
    setSelectedFriend(null);
  };

  // ✅ 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFriend(null);
  };

  return (
    <div className="friend-page">
      <div className="friend-page__inner">
        <div className="friend-page__grid">
          <FriendList friends={followList} onClickRemove={handleClickRemove} />
          <FriendSearch users={searchUsers} onFollow={handleFollow} followingList={followList} />
        </div>
      </div>

      {/* ✅ 모달 */}
      <FriendUnfollowModal
        isOpen={isModalOpen}
        friend={selectedFriend}
        onConfirm={handleConfirmRemove}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default FriendPage;
