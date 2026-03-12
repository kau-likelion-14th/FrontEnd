// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendDetailPage.js
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import FriendCalendar from "./FriendCalendar";
import FriendTodo from "./FriendTodo";

import { get } from "../../Api";
import config from "../../Config";

import "../../styles/FriendDetailPage.css";

// ✅ 친구 투두 카테고리 색은 메인처럼 서버 카테고리로 맞추고 싶으면
//    "친구 카테고리 조회 API"가 필요함. 없으면 일단 동일 preset으로 씀.
const Categories = {
  공부: { backgroundColor: "#E5F8F1", color: "#333" },
  일상: { backgroundColor: "#FFC8BE", color: "#333" },
  동아리: { backgroundColor: "#B6DAFF", color: "#333" },
};

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const normalizeTodo = (t) => ({
  id: t?.todoId ?? t?.id,
  text: t?.description ?? t?.content ?? t?.text ?? "",
  category: t?.categoryName ?? t?.category ?? "공부",
  completed: Boolean(t?.completed ?? t?.isCompleted ?? t?.done),
  raw: t,
});

function FriendDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // ✅ FriendList/FriendSearch에서 navigate할 때 state로 넘겨주면 자동 반영
  // 예: navigate("/friends/detail/3", { state: { friend } })
  const passedFriend = location.state?.friend ?? null;

  // ✅ 새로고침/직접접속 대비: params.id 지원
  // ✅ followId가 가장 중요하므로 우선순위 높게
  const followId = useMemo(() => {
    return (
      passedFriend?.followId ??
      passedFriend?.id ??
      params?.followId ??
      params?.id ??
      null
    );
  }, [passedFriend, params]);

  // ✅ 프로필
  const [friend, setFriend] = useState(
    passedFriend ?? {
      followId: followId ?? "",
      name: "",
      tag: "",
      bio: "",
      profileImage: null,
    }
  );

  // ✅ 저장한 곡 목록
  const [savedSongs, setSavedSongs] = useState([]);

  // ✅ 캘린더/투두 상태
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  const [todosByDate, setTodosByDate] = useState({});
  const [remainingByDate, setRemainingByDate] = useState({});

  const year = useMemo(() => viewDate.getFullYear(), [viewDate]);
  const month = useMemo(() => viewDate.getMonth() + 1, [viewDate]);

  // ✅ 최신 저장곡 1개만 상단에 노출
  const latestSong = useMemo(() => {
    if (!Array.isArray(savedSongs) || savedSongs.length === 0) return null;
    return savedSongs[0];
  }, [savedSongs]);

  // ✅ 방어: followId 없으면 목록으로
  useEffect(() => {
    if (!followId) {
      navigate("/friends");
    }
  }, [followId, navigate]);

  // 1) 친구 프로필 상세 조회
  useEffect(() => {
    if (!followId) return;

    const fetchFriend = async () => {
      try {
        const data = await get(config.FRIEND.PROFILE(followId));
        const result = data?.result ?? {};

        setFriend((prev) => ({
          ...prev,
          followId,
          name: result?.userName ?? prev?.name ?? "",
          bio: result?.introduction ?? prev?.bio ?? "",
          profileImage: result?.profileImageUrl ?? prev?.profileImage ?? null,
        }));

        // ✅ savedSongs도 같은 API 응답에서 같이 저장
        setSavedSongs(Array.isArray(result?.savedSongs) ? result.savedSongs : []);
      } catch (e) {
        console.error("friend profile fetch fail:", e);
        console.error("status:", e?.response?.status);
        console.error("data:", e?.response?.data);
        setSavedSongs([]);
      }
    };

    fetchFriend();
  }, [followId, navigate]);

  // 2) 친구 월 캘린더 조회
  useEffect(() => {
    if (!followId) return;

    const fetchCalendar = async () => {
      try {
        const data = await get(config.FRIEND.CALENDAR.GET(followId), { year, month });
        const result = data?.result ?? {};
        const days = Array.isArray(result?.days) ? result.days : [];

        const mapped = {};
        days.forEach((day) => {
          if (!day?.date) return;
          mapped[day.date] = {
            remaining: Number(day?.remaining) || 0,
            hasTodo: Boolean(day?.hasTodo),
          };
        });

        setRemainingByDate(mapped);
      } catch (e) {
        console.error("friend calendar fetch fail:", e);
        console.error("status:", e?.response?.status);
        console.error("data:", e?.response?.data);
      }
    };

    fetchCalendar();
  }, [followId, year, month]);

  // 3) 친구 일별 투두 조회
  useEffect(() => {
    if (!followId) return;

    const fetchByDate = async () => {
      const dateKey = toDateKey(selectedDate);

      try {
        const data = await get(config.FRIEND.TODOS.LIST(followId), { date: dateKey });
        const result = data?.result ?? [];
        const list = Array.isArray(result) ? result : [];
        const normalized = list.map(normalizeTodo);

        setTodosByDate((prev) => ({ ...prev, [dateKey]: normalized }));
      } catch (e) {
        console.error("friend todos fetch fail:", e);
        console.error("status:", e?.response?.status);
        console.error("data:", e?.response?.data);
        setTodosByDate((prev) => ({ ...prev, [dateKey]: [] }));
      }
    };

    fetchByDate();
  }, [followId, selectedDate]);

  const todos = useMemo(() => {
    const key = toDateKey(selectedDate);
    return todosByDate[key] ?? [];
  }, [selectedDate, todosByDate]);

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-page__inner">
        {/* 상단: 뒤로가기 + 프로필 + 저장곡 */}
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
              {friend?.profileImage ? (
                <img
                  src={friend.profileImage}
                  alt="profile"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <UserIcon />
              )}
            </div>

            <div className="friend-detail-page__profile-info">
              <div className="friend-detail-page__name-line">
                <span className="friend-detail-page__name">{friend?.name || " "}</span>
              </div>
              <div className="friend-detail-page__bio">{friend?.bio || "한 줄 소개"}</div>
            </div>
          </div>

          {/* ✅ 저장곡: 프로필과 같은 가로줄에 배치 */}
          <div className="friend-detail-page__songs-inline">
            {latestSong ? (
              <div className="friend-detail-page__song-inline-item">
                <div className="friend-detail-page__song-inline-cover">
                  {latestSong?.imageUrl ? (
                    <img
                      src={latestSong.imageUrl}
                      alt={latestSong.title || "album"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : null}
                </div>

                <div className="friend-detail-page__song-inline-info">
                  <div className="friend-detail-page__song-inline-title">
                    {latestSong?.title || "제목 없음"}
                  </div>
                  <div className="friend-detail-page__song-inline-artist">
                    {latestSong?.artist || "아티스트 정보 없음"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="friend-detail-page__songs-inline-empty">
                저장한 곡이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 본문: 캘린더 + 투두 */}
        <div className="friend-detail-page__grid">
          <div className="friend-detail-page__calendar">
            <FriendCalendar
              initialDate={selectedDate}
              onDateChange={(d) => d && setSelectedDate(d)}
              onMonthChange={(d) => {
                if (!d) return;
                setViewDate(d);
              }}
              todosByDate={todosByDate}
              remainingByDate={remainingByDate}
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