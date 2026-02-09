// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendDetailPage.js
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import "../../styles/FriendDetailPage.css";

const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  운동: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const toKey = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function FriendDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FriendList/FriendSearch에서 navigate할 때 state로 넘겨주면 자동 반영
  // 예: navigate("/friend/detail", { state: { friend } })
  const friend = location.state?.friend ?? {
    id: "u1",
    name: "김예나",
    tag: "1234",
    bio: "한 줄 소개",
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  // ✅ 더미 데이터(나중에 API로 교체)
  // 백에서 날짜별 todo를 주면 todoByDate 형태로 만들면 편해
  const [todoByDate] = useState(() => ({
    [toKey(new Date())]: [
      { id: "t1", text: "오늘은 또 뭘해볼까", category: "공부", completed: true },
      { id: "t2", text: "오늘은 또 뭘해볼까", category: "공부", completed: true },
      { id: "t3", text: "오늘은 또 뭘해볼까", category: "운동", completed: false },
      { id: "t4", text: "오늘은 또 뭘해볼까", category: "동아리", completed: false },
      { id: "t5", text: "오늘은 또 뭘해볼까", category: "동아리", completed: false },
    ],
  }));

  const todos = useMemo(() => {
    const key = toKey(selectedDate);
    return todoByDate[key] ?? [];
  }, [selectedDate, todoByDate]);

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        {/* 상단: 뒤로가기 + 프로필 */}
        <div className="friend-detail-page__top">
          <button
            type="button"
            className="friend-detail-page__back"
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
          >
            ‹
          </button>

          <div className="friend-detail-page__profile">
            <div className="friend-detail-page__avatar" aria-hidden="true">
              <UserIcon />
            </div>

            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">{friend.name}</span>
                <span className="friend-detail-page__tag">#{friend.tag}</span>
              </div>
              <div className="friend-detail-page__bio">{friend.bio || "한 줄 소개"}</div>
            </div>
          </div>
        </div>

        {/* 본문: 캘린더 + 투두 */}
        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(d) => d && setSelectedDate(d)}
            />
          </div>

          <div className="friend-detail-page__todo">
            <FriendTodo title="To do List" todos={todos} categories={Categories} />
          </div>
        </div>
      </div>
    </div>
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

export default FriendDetailPage;
