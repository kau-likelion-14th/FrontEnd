import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/LoginPage.css";

import bg1 from "../../assets/image/login_bg1.jpg";
import bg2 from "../../assets/image/login_bg2.jpg";
import bg3 from "../../assets/image/login_bg3.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const onceRef = useRef(false);

  const backgrounds = useMemo(() => [bg1, bg2, bg3], []);
  const [bg, setBg] = useState(bg1);

  // ✅ 새로고침/진입 시 랜덤 배경 1개 고정
  useEffect(() => {
    const idx = Math.floor(Math.random() * backgrounds.length);
    setBg(backgrounds[idx]);
  }, [backgrounds]);

  // ✅ 1) 콜백(code) 처리: 같은 LoginPage에서 처리
  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (!code) return; // code 없으면 일반 로그인 화면

    if (onceRef.current) return; // ✅ 중복 호출 방지
    onceRef.current = true;

    // ✅ 너가 최종으로 말한 규칙: 배포=true, 로컬=false
    const isDevelop = window.location.hostname !== "localhost";

    axios
      .post("/api/auth/kakao", { code, isDevelop })
      .then((res) => {
        const accessToken = res?.data?.result?.accessToken;
        if (!accessToken) throw new Error("No accessToken");

        localStorage.setItem("accessToken", accessToken);

        // (선택) 유저 정보 저장
        // localStorage.setItem("user", JSON.stringify(res.data.result));

        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("Kakao login failed:", err);
        // 실패하면 다시 로그인 화면으로(쿼리 제거)
        navigate("/login", { replace: true });
      });
  }, [location.search, navigate]);

  // ✅ 2) 로그인 버튼 클릭: 현재 origin 기준 redirect_uri로 카카오 인가 페이지 이동
  const handleClick = () => {
    const REST_KEY = process.env.REACT_APP_KAKAO_REST_KEY;
    const redirectUri = `${window.location.origin}/login/oauth2/code/kakao`;

    const authUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${encodeURIComponent(REST_KEY)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code`;

    window.location.href = authUrl;
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