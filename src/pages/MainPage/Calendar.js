import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useEffect, useState } from 'react';
import "../../styles/Calendar.css";

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export default function CustomCalendar({initialDate=new Date(), onDateChange, onMonthChange, todosByDate={}, remainingByDate = {}}) {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [activeStartDate, setActiveStartDate] = useState(
        new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
    );

    useEffect(() => {
        setSelectedDate(initialDate);
        setActiveStartDate(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    }, [initialDate]);

    const handledDateChange = (value) => {
        const next = value instanceof Date ? value : value?.[0];
        setSelectedDate(next);
        onDateChange?.(next);
    };

    // Calendar.js의 getDayMeta 함수 부분

    const getDayMeta = (date) => {
        const key = toDateKey(date);

        // ✅ 1순위: 월별 캘린더 API에서 준 데이터 확인
        if (Object.prototype.hasOwnProperty.call(remainingByDate, key)) {
            const remaining = remainingByDate[key];
            // 할 일이 있는데 남은 게 0이면 '모두 완료'
            return { 
                hasTodos: true, 
                remaining: remaining, 
                allDone: remaining === 0 
            };
        }

        // ✅ 2순위: fallback (상세 할 일 목록 기준)
        const list = todosByDate[key] ?? [];
        if (list.length === 0) return { hasTodos: false, remaining: 0, allDone: false };

        const remaining = list.filter((t) => !t.completed).length;
        return { hasTodos: true, remaining, allDone: remaining === 0 };
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handledDateChange}
                value={selectedDate}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate }) => {
                    setActiveStartDate(activeStartDate);
                    onMonthChange?.(activeStartDate);
                }}
                calendarType='gregory'
                view='month'
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={true}
                formatDay={(locale, date) => String(date.getDate())}
                tileContent={({ date, view }) => {
                    if (view !== 'month') return null;
                    const { hasTodos, remaining, allDone } = getDayMeta(date);
                    if (!hasTodos) return null;

                    return (
                        <div className="tile-meta">
                            {allDone ? "★" : remaining}
                        </div>
                    );
                }}
                tileClassName={({ date, view }) => {
                    if (view !== 'month') return "";
                    const { hasTodos, allDone } = getDayMeta(date);
                    if (!hasTodos) return "";
                    return allDone ? "tile-done" : "tile-has";
                }}
            />
        </div>
    );
}