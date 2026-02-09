import React, { useEffect, useMemo, useState } from "react";
import "../../styles/LoginPage.css";

import bg1 from "../../assets/image/login_bg1.jpg";
import bg2 from "../../assets/image/login_bg2.jpg";
import bg3 from "../../assets/image/login_bg3.jpg";

export default function LoginPage() {
  const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
  const [bg, setBg] = useState(bg1);

  // ✅ 새로고침/진입 시 랜덤 배경 1개 고정
  useEffect(() => {
    const idx = Math.floor(Math.random() * backgrounds.length);
    setBg(backgrounds[idx]);
  }, [backgrounds]);

  // ✅ UI만: 클릭해도 아무 동작 안 하게
  const handleClick = () => {};

  return (
    <div className="login-page">
      {/* Background */}
      <div className="login-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="login-bg-overlay" />

      {/* Card */}
      <main className="login-card-wrap">
        <section className="login-card">
          {/* Logo */}
          <div className="login-logo">
            <span className="logo-l">L</span>
            <span className="logo-t">T</span>
            <span className="logo-e">E</span>
          </div>

          {/* Subtitle */}
          <div className="login-subtitle">
            <span className="sub-l">L</span>
            <span className="sub-rest">ION </span>
            <span className="sub-t">T</span>
            <span className="sub-rest">O-DO </span>
            <span className="sub-e">E</span>
            <span className="sub-rest">VERYDAY</span>
          </div>

          {/* ✅ Kakao Login Button (Official Image) */}
          <button
            type="button"
            className="kakao-login-btn"
            onClick={handleClick}
          >
            <img
              src="/icon/kakao_login_large_wide.png"
              alt="카카오 로그인"
            />
          </button>

          {/* Footer */}
          <footer className="login-footer">
            <span className="copyright-icon">© LIKELION KAU.</span>
            <span>All Rights Reserved.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
