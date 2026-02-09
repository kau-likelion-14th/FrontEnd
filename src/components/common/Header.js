import { NavLink } from "react-router-dom";
import "../../styles/Header.css";

function Header() {
  return (
    <header className="header">
      {/* 좌측 로고 */}
      <div className="header-left">
        <img src="/icon/lte_logo.png" alt="LTE 로고" className="header-logo" />
        <span className="header-title">Lion To-do Everyday</span>
      </div>

      {/* 중앙 네비게이션 (무조건 화면 중앙) */}
      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          홈
        </NavLink>
        <NavLink
          to="/friends"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          친구
        </NavLink>
        <NavLink
          to="/mypage"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          마이페이지
        </NavLink>
      </nav>

      {/* 우측 유저 영역 */}
      <div className="header-right">
        <span className="user-name">김예나님</span>
        <img src="/icon/logout.png" alt="로그아웃" className="logout-icon" />
      </div>
    </header>
  );
}

export default Header;
