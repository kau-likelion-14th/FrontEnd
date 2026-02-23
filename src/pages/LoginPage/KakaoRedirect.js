import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KakaoRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/auth/kakao`,
          { code },
          { headers: { "Content-Type": "application/json" } }
        );

        const accessToken = res.data?.result?.accessToken;
        if (!accessToken) throw new Error("No accessToken");

        // ✅ 토큰 저장
        localStorage.setItem("accessToken", accessToken);

        // (선택) 유저 정보
        localStorage.setItem("userId", String(res.data?.result?.id ?? ""));
        localStorage.setItem("username", res.data?.result?.username ?? "");

        navigate("/"); // 로그인 성공 후 이동할 페이지
      } catch (e) {
        console.error(e);
        navigate("/login");
      }
    };

    run();
  }, [navigate]);

  return <div style={{ padding: 24 }}>카카오 로그인 처리중...</div>;
}