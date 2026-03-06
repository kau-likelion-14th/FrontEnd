// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendSearch.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get } from "../../Api";
import "../../styles/FriendSearch.css";

// ✅ [추가] "이름#태그" 분리
function splitUserName(userName = "") {
  const [name, tag] = String(userName).split("#");
  return { name: name || userName, tag: tag || "" };
}

// ✅ [추가] API 응답 유저 -> UI 모델
function toUserModel(apiUser) {
  const { name, tag } = splitUserName(apiUser?.userName);
  return {
    id: String(apiUser?.userId),
    userId: apiUser?.userId,
    userName: apiUser?.userName,
    name,
    tag,
    bio: apiUser?.introduction || "",
    profileImageUrl: apiUser?.profileImageUrl || null,
    introduction: apiUser?.introduction || null,
  };
}

function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow,
  followingList = [],
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id));
  }, [followingList]);

  // ✅ 프로필 클릭 시 친구 투두 상세로 이동
  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } });
  };

  // ✅ 디바운스 검색: /api/follow/search?nickname=...
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setErrorMsg("");
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const res = await get("/api/follow/search", {
          nickname: q,
          page: 0,
          size: 10,
        });

        const content = res?.result?.content || [];
        setResults(content.map(toUserModel));
      } catch (e) {
        console.error(e);
        setErrorMsg("검색에 실패했습니다.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

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

      {query.trim() === "" ? null : loading ? (
        <div className="friend-search__empty">검색 중...</div>
      ) : errorMsg ? (
        <div className="friend-search__empty">{errorMsg}</div>
      ) : results.length === 0 ? (
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
                    if (e.key === "Enter" || e.key === " ")
                      goFriendDetail(user);
                  }}
                >
                  <div className="friend-avatar" aria-hidden="true">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>
                    <div className="friend-info__bio">
                      {user.bio || "한 줄 소개"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`friend-follow-btn ${isFollowing ? "is-disabled" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollow?.(user); // ✅ 여기서 FriendPage의 POST /api/follow 호출
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
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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