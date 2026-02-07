// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendSearch.js
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendSearch.css";

function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  users = [],
  onFollow,
  followingList = [],
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id));
  }, [followingList]);

  // ✅ 이름(name) + 태그(tag)만으로 검색 (소개 bio는 제외)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const tag = String(u.tag || "").toLowerCase();
      return name.includes(q) || tag.includes(q);
    });
  }, [query, users]);

  // ✅ 프로필 클릭 시 친구 투두 상세로 이동
  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } });
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>

      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src="/icon/search.png"
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        <input
          className="friend-search__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {query.trim() === "" ? null : results.length === 0 ? (
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        <ul className="friend-search__list">
          {results.map((user) => {
            const isFollowing = followingIdSet.has(user.id);

            return (
              <li key={user.id} className="friend-search__item">
                {/* ✅ 프로필 클릭 영역 */}
                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}
                  onClick={() => goFriendDetail(user)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user);
                  }}
                >
                  <div className="friend-avatar" aria-hidden="true">
                    <UserIcon />
                  </div>

                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>
                    {/* 소개 표시(UI)는 유지해도 되고, 빼도 됨 */}
                    <div className="friend-info__bio">{user.bio || "한 줄 소개"}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`friend-follow-btn ${isFollowing ? "is-disabled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ 버튼 클릭 시 상세 이동 방지
                    onFollow?.(user);
                  }}
                  disabled={isFollowing}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
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

export default FriendSearch;
