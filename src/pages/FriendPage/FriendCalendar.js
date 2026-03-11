// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendCalendar.js
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect, useState } from "react";
import "../../styles/Calendar.css";

const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function FriendCalendar({
  initialDate = new Date(),
  onDateChange,
  onMonthChange,
  todosByDate = {},
  remainingByDate = {},
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // ✅ 부모에서 initialDate가 바뀌면 내부 state도 동기화
  useEffect(() => {
    const next =
      initialDate instanceof Date
        ? initialDate
        : initialDate
        ? new Date(initialDate)
        : new Date();

    setSelectedDate(next);
  }, [initialDate]);

  const handledDateChange = (value) => {
    const next = value instanceof Date ? value : value?.[0];
    if (!next) return;
    setSelectedDate(next);
    onDateChange?.(next);
  };

  const getDayMeta = (date) => {
    const key = toDateKey(date);

    // ✅ 1순위: 월별 캘린더 API에서 준 날짜별 메타
    const hasKey = Object.prototype.hasOwnProperty.call(remainingByDate, key);
    if (hasKey) {
      const dayInfo = remainingByDate[key];

      // number 형태로 들어오는 경우도 방어
      if (typeof dayInfo === "number") {
        const remaining = Number(dayInfo) || 0;
        return { hasTodos: true, remaining, allDone: remaining === 0 };
      }

      const hasTodos = Boolean(dayInfo?.hasTodo);
      const remaining = Number(dayInfo?.remaining) || 0;

      if (!hasTodos) {
        return { hasTodos: false, remaining: 0, allDone: false };
      }

      return { hasTodos: true, remaining, allDone: remaining === 0 };
    }

    // ✅ 2순위: fallback (일별 todosByDate 기반)
    const list = todosByDate[key] ?? [];
    if (list.length === 0) return { hasTodos: false, remaining: 0, allDone: false };

    const remaining = list.filter((t) => !t.completed).length;
    return { hasTodos: true, remaining, allDone: remaining === 0 };
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handledDateChange}
        value={selectedDate || new Date()} // ✅ value 안전장치
        onActiveStartDateChange={({ activeStartDate }) => {
          onMonthChange?.(activeStartDate);
        }}
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(locale, date) => String(date?.getDate?.() ?? "")} // ✅ 안전장치
        tileContent={({ date, view }) => {
          if (view !== "month") return null;
          const { hasTodos, remaining, allDone } = getDayMeta(date);
          if (!hasTodos) return null;

          return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
        }}
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";
          const { hasTodos, allDone } = getDayMeta(date);
          if (!hasTodos) return "";
          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}