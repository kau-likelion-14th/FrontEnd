import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Header.css";

function Header() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // ✅ 로그인 유저 정보 불러오기
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.username || "");
    }
  }, []);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      if (accessToken) {
        await axios.post(
          "/api/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/icon/lte_logo.png" alt="LTE 로고" className="header-logo" />
        <span className="header-title">Lion To-do Everyday</span>
      </div>

      <nav className="header-nav">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          홈
        </NavLink>
        <NavLink to="/friends" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          친구
        </NavLink>
        <NavLink to="/mypage" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          마이페이지
        </NavLink>
      </nav>

      <div className="header-right">
        <span className="user-name">
          {userName ? `${userName}님` : ""}
        </span>

        <img
          src="/icon/logout.png"
          alt="로그아웃"
          className="logout-icon"
          onClick={handleLogout}
          role="button"
        />
      </div>
    </header>
  );
}

export default Header;