import React, { useEffect, useMemo, useState } from "react";
import FriendList from "./FriendList";
import FriendSearch from "./FriendSearch";
import FriendUnfollowModal from "./FriendUnfollowModal";
import { get, post, del } from "../../Api";
import "../../styles/FriendPage.css";

function splitUserName(userName = "") {
  const [name, tag] = String(userName).split("#");
  return { name: name || userName, tag: tag || "" };
}

function toFriendModel(apiUser) {
  const { name, tag } = splitUserName(apiUser?.userName);
  return {
    id: String(apiUser?.userId),
    userId: apiUser?.userId,
    name,
    tag,
    bio: apiUser?.introduction || "",
    profileImageUrl: apiUser?.profileImageUrl || null,
  };
}

function FriendPage() {
  const [followList, setFollowList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const followIds = useMemo(
    () => new Set(followList.map((x) => x.id)),
    [followList]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // ✅✅ "내가 팔로우한 목록"은 followings!
  const fetchFollowings = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await get("/api/follow/followings"); // ✅ 여기 핵심
      const list = Array.isArray(data?.result) ? data.result : [];
      setFollowList(list.map(toFriendModel));
    } catch (e) {
      console.error(e);
      setLoadError("팔로우 목록을 불러오지 못했습니다.");
      setFollowList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 팔로우 추가: POST /api/follow {toUserId}
  const handleFollow = async (user) => {
    if (!user?.userId) return;
    if (followIds.has(String(user.userId))) return;

    try {
      const res = await post("/api/follow", { toUserId: user.userId });

      // 이미 팔로우(4091)는 백에서 isSuccess:false로 주니까 여기서 처리 가능
      if (res?.isSuccess === false && res?.code === "FOLLOW_4091") return;

      await fetchFollowings();
    } catch (e) {
      console.error(e);
      alert("팔로우 추가 실패");
    }
  };

  const handleClickRemove = (friend) => {
    setSelectedFriend(friend);
    setIsModalOpen(true);
  };

  // ✅ 언팔로우: DELETE /api/follow (body로 toUserId 보내는 타입이면 options에 data)
  const handleConfirmRemove = async () => {
    if (!selectedFriend) return;

    try {
      await del("/api/follow", { data: { toUserId: selectedFriend.userId } }); // ✅ DELETE body
      await fetchFollowings();
    } catch (e) {
      console.error(e);
      alert("언팔로우 실패");
    } finally {
      setIsModalOpen(false);
      setSelectedFriend(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFriend(null);
  };

  return (
    <div className="friend-page">
      <div className="friend-page__inner">
        <div className="friend-page__grid">
          <FriendList
            friends={followList}
            onClickRemove={handleClickRemove}
            emptyText={
              loading
                ? "불러오는 중..."
                : loadError
                ? loadError
                : "아직 팔로우한 친구가 없습니다."
            }
          />

          {/* 오른쪽: 검색 결과는 FriendSearch가 /api/follow/search 로 처리 */}
          <FriendSearch onFollow={handleFollow} followingList={followList} />
        </div>
      </div>

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