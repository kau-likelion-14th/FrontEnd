import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";

import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import MyPage from "./pages/MyPage/MyPage";
import FriendPage from "./pages/FriendPage/FriendPage";
import FriendDetailPage from "./pages/FriendPage/FriendDetailPage";

import ProtectedRoute from "./routes/ProtectedRoute"; // ✅ 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 (헤더/푸터 없음) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/oauth2/code/kakao" element={<LoginPage />} />

        {/* ✅ 로그인 필요 구역 */}
        <Route element={<ProtectedRoute />}>
          {/* 헤더 + 푸터가 있는 레이아웃 */}
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route path="/friends/detail" element={<FriendDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;