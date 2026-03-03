// FriendList.js
// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendList.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendList.css";

function FriendList({
  title = "팔로우 목록",
  friends = [],
  onClickRemove,
  emptyText = "아직 팔로우한 친구가 없습니다.",
}) {
  const navigate = useNavigate();

  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } });
  };

  return (
    <section className="friend-list">
      <h2 className="friend-list__title">{title}</h2>

      {friends.length === 0 ? (
        <div className="friend-list__empty">{emptyText}</div>
      ) : (
        <ul className="friend-list__items">
          {friends.map((friend) => (
            <li key={friend.id} className="friend-list__item">
              {/* ✅ 프로필 클릭 영역 */}
              <div
                className="friend-list__left"
                role="button"
                tabIndex={0}
                onClick={() => goFriendDetail(friend)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goFriendDetail(friend);
                }}
              >
                <div className="friend-avatar" aria-hidden="true">
                  {/* ✅ [추가] 프로필 이미지가 있으면 보여주고, 없으면 기존 아이콘 */}
                  {friend.profileImageUrl ? (
                    <img
                      src={friend.profileImageUrl}
                      alt=""
                      className="friend-avatar__img"
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>

                <div className="friend-info">
                  <div className="friend-info__top">
                    <span className="friend-info__name">{friend.name}</span>
                    <span className="friend-info__tag">#{friend.tag}</span>
                  </div>

                  {friend.bio ? (
                    <div className="friend-info__bio">{friend.bio}</div>
                  ) : (
                    <div className="friend-info__bio friend-info__bio--empty">
                      &nbsp;
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="friend-remove-btn"
                aria-label="삭제"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ 삭제 클릭 시 상세 이동 방지
                  onClickRemove?.(friend); // ✅ 여기만 변경
                }}
              >
                <img
                  src="/icon/delete.png"
                  alt="삭제"
                  className="friend-remove-icon"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function UserIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendList;