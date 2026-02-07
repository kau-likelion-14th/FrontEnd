import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";

import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import FriendPage from "./pages/FriendPage";
import MyPage from "./pages/MyPage/MyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 (헤더/푸터 없음) */}
        <Route path="/login" element={<LoginPage />} />

        {/* 헤더 + 푸터가 있는 레이아웃 */}
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/friends" element={<FriendPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;