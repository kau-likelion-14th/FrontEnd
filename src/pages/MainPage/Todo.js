import React, {useMemo, useEffect, useState} from "react";
import "../../styles/Todo.css";
import TodoModal from "./TodoModal";
import { get, post, put, del } from "../../Api";
import config from "../../Config";

const Categories = {
    공부: { backgroundColor: '#E5F8F1', color: '#333' },
    운동: { backgroundColor: '#FFC8BE', color: '#333' },
    동아리: { backgroundColor: '#B6DAFF', color: '#333' },
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

const Todo = ({ selectedDate, todosByDate, setTodosByDate }) => {
    const [serverCategories, setServerCategories] = useState([]);
    const dateKey = toDateKey(selectedDate);

    const todos = todosByDate[dateKey] ?? [];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
            const data = await get(config.CATEGORIES.GET);
            const list = data?.result ?? data ?? [];
            setServerCategories(Array.isArray(list) ? list : []);
            } catch (e) {
            console.error("카테고리 조회 실패:", e);
            }
        };
        fetchCategories();
    }, []);

    const categoriesForModal = useMemo(() => {
        // TodoModal이 Object.keys(categories) 쓰는 구조라서
        // { "공부": {...}, "운동": {...} } 형태를 유지해주되
        // 실제 서버 categoryName으로 key를 구성
        const colorPreset = [
            { backgroundColor: "#E5F8F1", color: "#333" },
            { backgroundColor: "#FFC8BE", color: "#333" },
            { backgroundColor: "#B6DAFF", color: "#333" },
            { backgroundColor: "#E9E7FF", color: "#333" },
            { backgroundColor: "#FFE7F1", color: "#333" },
        ];

        if (serverCategories.length === 0) {
            // 서버 못 불러오면 임시로 기존값
            return {
            공부: { backgroundColor: "#E5F8F1", color: "#333" },
            운동: { backgroundColor: "#FFC8BE", color: "#333" },
            동아리: { backgroundColor: "#B6DAFF", color: "#333" },
            };
        }

        const obj = {};
        serverCategories.forEach((c, idx) => {
            obj[c.categoryName] = colorPreset[idx % colorPreset.length];
        });
        return obj;
    }, [serverCategories]);

const IDX_TO_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const routineToPayload = (routine) => {
  if (!routine) {
    return {
      routineEnabled: false,
      startDate: null,
      endDate: null,
      week: [],
    };
  }

  const week =
    routine.repeatDays != null ? [IDX_TO_WEEK[routine.repeatDays]] : [];

  return {
    routineEnabled: true,
    startDate: routine.startDate || null,
    endDate: routine.endDate || null,
    week,
  };
};

    const toCategoryId = (categoryName) => {
        const found = serverCategories.find((c) => c.categoryName === categoryName);
        return found?.categoryId;
    };

    const setTodos = (updater) => {
        setTodosByDate((prev) => {
            const current = prev[dateKey] ?? [];
            const nextTodos = typeof updater === "function" ? updater(current) : updater;
            return { ...prev, [dateKey]: nextTodos };
        });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const openModal = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const refetch = async () => {
        const data = await get(config.TODOS.LIST, { date: dateKey });
        const list = data?.todos ?? data?.items ?? data?.list ?? data ?? [];
        const normalized = Array.isArray(list) ? list.map(normalizeTodo) : [];
        setTodos(normalized);
    };

    const toggleComplete = async (todo) => {
    // 1) UI optimistic
        setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
        );

        try {
        await put(config.TODOS.TOGGLE_COMPLETE(todo.id, dateKey));
        // 필요하면 refetch()
        } catch (e) {
        console.error("toggle fail:", e);
        // 실패하면 되돌리기
        setTodos((prev) =>
            prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
        );
        alert("완료 처리 실패! (API 메서드/권한 확인)");
        }
    };

    const handledSaveTodo = async ({ text, category, routine }) => {
        try {
            const routinePayload = routineToPayload(routine);
            const options = { params: { date: dateKey } };

        if (editingTodo) {
            await put(
                config.TODOS.PUT(editingTodo.id),
                {
                    categoryName: category,
                    description: text,
                    ...routinePayload,
                },
                options
            );

            // 수정 후 최신화
            await refetch();

        } else {
            const created = await post(
                config.TODOS.POST,
                {
                    categoryName: category,
                    description: text,
                    ...routinePayload,
                },
                options
            );

            const createdTodo = created?.result ?? created?.data ?? created;
            const newTodo = created ? normalizeTodo(created) : null;
            if (newTodo?.id) setTodos((prev) => [...prev, newTodo]);
            else await refetch();
        }

        setIsModalOpen(false);
        setEditingTodo(null);
        } catch (e) {
            console.error("save fail:", e);
            console.error("status:", e?.response?.status);
            console.error("data:", e?.response?.data);
            alert("저장 실패! (Payload/Query(date) 확인)");
        }
    };

    const handledDeleteTodo = async () => {
        if (!editingTodo) return;

        // UI optimistic
        setTodos((prev) => prev.filter((t) => t.id !== editingTodo.id));
        setIsModalOpen(false);

        try {
        // ✅ 너 config에 날짜 포함 delete가 있으니 그걸 사용
        await del(config.TODOS.DELETE_BY_DATE(editingTodo.id, dateKey));
        setEditingTodo(null);
        } catch (e) {
        console.error("delete fail:", e);
        alert("삭제 실패! (API/권한 확인) — 새로고침하면 복구될 수 있음");
        // 실패 시 서버 재동기화
        try { await refetch(); } catch {}
        }
    };

    const counts = useMemo(() => {
        const total = todos.length;
        const done = todos.filter((t) => t.completed).length;
        return { total, done };
    }, [todos]);

    console.log("serverCategories:", serverCategories.map(c => c.categoryName));

    return (
        <div className="todo-container">
            <div className="todo-header">
                <div className="todo-title">To do List</div>
                <button className="todo-add" onClick={openModal}>+</button>
            </div>
            <div className="todo-list">
                {todos.map((t) => (
                    <div 
                        key={t.id} 
                        className={`todo-item ${t.completed ? 'done' : ''}`}
                        onClick={() => openEditModal(t)}
                    >
                        <button 
                            className={`checkbox ${t.completed ? 'checked' : ''}`} 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleComplete(t);
                            }}
                        >
                        </button>
                        <div className="todo-text">{t.text}</div>
                        <div 
                            className="todo-category"
                            style={categoriesForModal[t.category]}
                        >
                            {t.category}
                        </div>
                    </div>
                ))}
            </div>
            <TodoModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handledSaveTodo}
                onDelete={handledDeleteTodo}
                initialTodo={editingTodo}
                categories={categoriesForModal}
                serverCategories={serverCategories} 
            />
        </div>
    );
};

export default Todo;