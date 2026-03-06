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

  // ✅ 로그인 후 돌아갈 경로
  const from = location.state?.from;

  // ✅ 새로고침/진입 시 랜덤 배경 1개 고정
  useEffect(() => {
    const idx = Math.floor(Math.random() * backgrounds.length);
    setBg(backgrounds[idx]);
  }, [backgrounds]);

  // ✅ 이미 로그인된 상태로 /login 접근하면 홈으로 이동
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // ✅ 1) 콜백(code) 처리
  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (!code) return;

    if (onceRef.current) return;
    onceRef.current = true;

    const isDevelop = window.location.hostname !== "localhost";

    axios
      .post("/api/auth/kakao", { code, isDevelop })
      .then((res) => {
        const result = res?.data?.result;
        if (!result?.accessToken) throw new Error("No accessToken");

        // ✅ 토큰 저장
        localStorage.setItem("accessToken", result.accessToken);

        // ✅ 유저 정보도 같이 저장
        localStorage.setItem("user", JSON.stringify(result));

        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      })
      .catch((err) => {
        console.error("Kakao login failed:", err);
        navigate("/login", { replace: true });
      });
  }, [location.search, navigate, location.state]);

  // ✅ 2) 로그인 버튼 클릭
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

          {/* ✅ 보호된 페이지 접근 시 안내 문구 */}
          {from && (
            <div className="login-required-message">
              로그인 후 이용 가능합니다.
            </div>
          )}

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

          <footer className="login-footer">
            <span className="copyright-icon">© LIKELION KAU.</span>
            <span>All Rights Reserved.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}