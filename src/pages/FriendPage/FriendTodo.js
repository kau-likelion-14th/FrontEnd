// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendTodo.js
import React, { useMemo } from "react";

import "../../styles/Todo.css";       // ✅ 팀원 Todo.css 그대로 사용(똑같이 보이게)
import "../../styles/FriendTodo.css"; // ✅ 친구 전용으로 필요한 부분만 살짝 조정

const FriendTodo = ({ title = "To do List", todos = [], categories = {} }) => {
  const counts = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    return { total, done };
  }, [todos]);

  return (
    <div className="friend-todo">
      <div className="todo-container">
        <div className="todo-header">
          <div className="todo-title">{title}</div>
          {/* ✅ 친구 화면: 추가 버튼 없음 */}
        </div>

        {/* 필요하면 진행률 텍스트 같은 거 추가 가능 (UI 유지하려면 생략 추천)
            <div className="todo-subtitle">{counts.done}/{counts.total}</div>
        */}

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="friend-todo__empty">등록된 투두가 없습니다.</div>
          ) : (
            todos.map((t) => (
              <div key={t.id} className={`todo-item ${t.completed ? "done" : ""}`}>
                {/* ✅ 체크박스: 보이기만(클릭 X) */}
                <div className={`checkbox ${t.completed ? "checked" : ""}`} aria-hidden="true" />
                <div className="todo-text">{t.text}</div>
                <div className="todo-category" style={categories[t.category] ?? undefined}>
                  {t.category}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendTodo;