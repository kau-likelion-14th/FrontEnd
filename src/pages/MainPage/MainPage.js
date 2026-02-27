import React, { useEffect, useMemo, useState } from "react";
import CustomCalendar from "./Calendar";
import Todo from "./Todo";
import "../../styles/MainPage.css";
import { get } from "../../Api";
import config from "../../Config";

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

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  
  const [todosByDate, setTodosByDate] = useState({});
  const [remainingByDate, setRemainingByDate] = useState({});

  const year = useMemo(() => viewDate.getFullYear(), [viewDate]);
  const month = useMemo(() => viewDate.getMonth() + 1, [viewDate]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const res = await get(config.CALENDAR.GET, { year, month });
        const data = res?.data ?? res;

        // ✅ 공통 응답에서 진짜 payload는 result
        const result = data?.result ?? data;
        setRemainingByDate(result?.remainingCountByDate ?? {});
      } catch (e) {
        console.error("calendar fetch fail:", e);
        console.error("status:", e?.response?.status);
        console.error("data:", e?.response?.data);
      }
    };

  fetchCalendar();
}, [year, month]);

  useEffect(() => {
    const fetchByDate = async () => {
      const dateKey = toDateKey(selectedDate);

      try {
        const res = await get(config.TODOS.LIST, { date: dateKey });
        const data = res?.data ?? res;

        const payload = data?.result ?? data; // ✅ 공통 result 대응
        const list = payload?.todos ?? payload?.items ?? payload?.list ?? payload ?? [];
        const normalized = Array.isArray(list) ? list.map(normalizeTodo) : [];

        setTodosByDate((prev) => ({ ...prev, [dateKey]: normalized }));
      } catch (e) {
        console.error("todos fetch fail:", e);
      }
    };

    fetchByDate();
  }, [selectedDate, year, month]);

  return (
    <div className="mainpage-container">
      <CustomCalendar 
        initialDate={selectedDate}
        onDateChange={setSelectedDate}
        onMonthChange={(d) => {
          setViewDate(d);
          setSelectedDate(d);
        }}
        todosByDate={todosByDate}
        remainingByDate={remainingByDate}
      />
      <Todo 
        selectedDate={selectedDate}
        todosByDate={todosByDate}
        setTodosByDate={setTodosByDate}
        remainingByDate={remainingByDate}
        setRemainingByDate={setRemainingByDate}
      />
    </div>
  );
};

export default MainPage;