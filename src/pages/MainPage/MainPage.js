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
  text: t?.content ?? t?.text ?? "",
  category: t?.category ?? "공부",
  completed: Boolean(t?.completed ?? t?.isCompleted ?? t?.done),
  raw: t,
});

const MainPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [todosByDate, setTodosByDate] = useState({});
  const year = useMemo(() => selectedDate.getFullYear(), [selectedDate]);
  const month = useMemo(() => selectedDate.getMonth() + 1, [selectedDate]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const data = await get(config.CALENDAR.GET, { year, month });

        const map = data?.todosByDate ?? data?.calendar ?? data;
        if (map && typeof map === "object" && !Array.isArray(map)) {
          const next = {};
          Object.entries(map).forEach(([dateKey, list]) => {
            next[dateKey] = (list ?? []).map(normalizeTodo);
          });
          setTodosByDate((prev) => ({ ...prev, ...next }));
        }
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
        const data = await get(config.TODOS.LIST, { date: dateKey });

        const list = data?.todos ?? data?.items ?? data?.list ?? data ?? [];
        const normalized = Array.isArray(list) ? list.map(normalizeTodo) : [];

        setTodosByDate((prev) => ({ ...prev, [dateKey]: normalized }));
      } catch (e) {
        console.error("todos fetch fail:", e);
      }
    };

    fetchByDate();
  }, [selectedDate]);

  return (
    <div className="mainpage-container">
      <CustomCalendar 
        initialDate={selectedDate}
        onDateChange={setSelectedDate}
        todosByDate={todosByDate}
      />
      <Todo 
        selectedDate={selectedDate}
        todosByDate={todosByDate}
        setTodosByDate={setTodosByDate}
      />
    </div>
  );
};

export default MainPage;