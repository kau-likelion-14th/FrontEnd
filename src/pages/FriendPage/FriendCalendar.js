import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useEffect, useState } from "react";
import "../../styles/Calendar.css";

export default function CustomCalendar({ initialDate = new Date(), onDateChange }) {
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
    // react-calendar: range면 배열, 아니면 Date
    const next = value instanceof Date ? value : value?.[0];

    // ✅ next가 없으면 크래시 방지
    if (!next) return;

    setSelectedDate(next);
    onDateChange?.(next);
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handledDateChange}
        value={selectedDate || new Date()}   // ✅ value 안전장치
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatDay={(locale, date) => String(date?.getDate?.() ?? "")} // ✅ 안전장치
      />
    </div>
  );
}
