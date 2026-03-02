import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  // ✅ 로그인 기준: accessToken 존재 여부 (너희 현재 구조 그대로)
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // ✅ 로그인 후 원래 가려던 곳으로 돌아오게 하려면 state로 저장
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}