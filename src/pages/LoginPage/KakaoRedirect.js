import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KakaoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // ✅ 배포(https)에서도 Mixed Content 안 나게:
        //    절대 http 백엔드로 직접 치지 말고, 항상 same-origin 상대경로로 호출
        //    (배포에서는 Netlify _redirects가 /api/* 를 백엔드 http로 프록시해줘야 함)
        const res = await axios.post(
          "/api/auth/kakao",
          { 
            "code":code,
            "isDevelop": process.env.NODE_ENV === "production"
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const accessToken = res.data?.result?.accessToken;
        if (!accessToken) throw new Error("No accessToken");

        // ✅ 토큰 저장
        localStorage.setItem("accessToken", accessToken);

        // (선택) 유저 정보
        localStorage.setItem("userId", String(res.data?.result?.id ?? ""));
        localStorage.setItem("username", res.data?.result?.username ?? "");

        navigate("/", { replace: true });
      } catch (e) {
        console.error(e);
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [navigate]);

  return <div style={{ padding: 24 }}>카카오 로그인 처리중...</div>;
}