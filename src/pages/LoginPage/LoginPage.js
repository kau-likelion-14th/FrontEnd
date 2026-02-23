import React, { useEffect, useMemo, useState } from "react";
import "../../styles/LoginPage.css";

import bg1 from "../../assets/image/login_bg1.jpg";
import bg2 from "../../assets/image/login_bg2.jpg";
import bg3 from "../../assets/image/login_bg3.jpg";

export default function LoginPage() {
  const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
  const [bg, setBg] = useState(bg1);

  useEffect(() => {
    const idx = Math.floor(Math.random() * backgrounds.length);
    setBg(backgrounds[idx]);
  }, [backgrounds]);

  // ✅ 카카오 로그인 이동
  const handleClick = () => {
    const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID;

    // ✅ 환경에 따라 자동으로 origin이 바뀜 (로컬/배포)
    const redirectUri = `${window.location.origin}/login/oauth2/code/kakao`;

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="login-page">
      <div className="login-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="login-bg-overlay" />

      <main className="login-card-wrap">
        <section className="login-card">
          <div className="login-logo">
            <span className="logo-l">L</span>
            <span className="logo-t">T</span>
            <span className="logo-e">E</span>
          </div>

          <div className="login-subtitle">
            <span className="sub-l">L</span>
            <span className="sub-rest">ION </span>
            <span className="sub-t">T</span>
            <span className="sub-rest">O-DO </span>
            <span className="sub-e">E</span>
            <span className="sub-rest">VERYDAY</span>
          </div>

          <button type="button" className="kakao-login-btn" onClick={handleClick}>
            <img src="/icon/kakao_login_large_wide.png" alt="카카오 로그인" />
          </button>

          <footer className="login-footer">
            <span className="copyright-icon">© LIKELION KAU.</span>
            <span>All Rights Reserved.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}