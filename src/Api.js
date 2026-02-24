// src/api.js
import { Cookies } from "react-cookie";
import axios from "axios";
import config from "./Config";

console.log("[env] BASE_URL =", process.env.REACT_APP_API_BASE_URL);


// ===== 상수/쿠키 =====
const ACCESS_TOKEN_KEY = "accessToken";
const cookies = new Cookies();

// ===== axios 인스턴스 =====
const api = axios.create({
  baseURL: config.API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 쿠키 기반 인증이면 유지
});

// ===== 요청 인터셉터: 토큰 자동 첨부 =====
api.interceptors.request.use(
  (req) => {
    const rawToken =
      cookies.get("accessToken") ||
      localStorage.getItem("accessToken");

    console.log("[api] token =", rawToken);

    if (rawToken) {
      // 혹시 이미 Bearer가 붙어있으면 제거
      const token = rawToken.startsWith("Bearer ")
        ? rawToken.slice(7)
        : rawToken;

      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ===== 응답 인터셉터: 401 처리 =====
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("로그인 만료됨. 다시 로그인해주세요.");
      cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

// ===== 응답 타입 검사(완화 버전) =====
const validateContentType = (response) => {
  const contentType = response.headers?.["content-type"] || "";
  // JSON이 아닌 응답도 있을 수 있어서 에러로 죽이지 않고 경고만
  if (!contentType.includes("json")) {
    console.warn("JSON이 아닌 응답 Content-Type:", contentType);
  }
};

// ===== 공통 요청 함수들 =====

// GET
export const get = async (endpoint, params = {}, options = {}) => {
  const response = await api.get(endpoint, { params, ...options });
  validateContentType(response);
  return response.data;
};

// POST (JSON)
export const post = async (endpoint, data, options = {}) => {
  const response = await api.post(endpoint, data, options);
  validateContentType(response);
  return response.data;
};

// PUT (JSON)
export const put = async (endpoint, data = {}, options = {}) => {
  const response = await api.put(endpoint, data, options);
  validateContentType(response);
  return response.data;
};

// DELETE
export const del = async (endpoint, options = {}) => {
  const response = await api.delete(endpoint, options);
  validateContentType(response);
  return response.data;
};

// PATCH (일반 JSON PATCH)
export const patch = async (endpoint, data = {}, options = {}) => {
  const response = await api.patch(endpoint, data, options);
  validateContentType(response);
  return response.data;
};

// ===== multipart/form-data 유틸 =====

// 단일 이미지 업로드 (필드명 기본: file)
// 필요하면 fieldName 바꿔서 사용 가능
export const uploadImage = async (
  endpoint,
  imageFile,
  { fieldName = "file", method = "post", ...options } = {}
) => {
  const formData = new FormData();
  formData.append(fieldName, imageFile);

  const response = await api.request({
    url: endpoint,
    method, // "post" | "put" | "patch"
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    ...options,
  });

  validateContentType(response);
  return response.data;
};

// 이미지 + JSON 함께 업로드 (필드명 커스텀 가능)
export const uploadImageWithJson = async (
  endpoint,
  imageFile,
  jsonData,
  {
    imageField = "coverImage",
    jsonField = "readingLog",
    method = "post",
    ...options
  } = {}
) => {
  const formData = new FormData();
  if (imageFile) formData.append(imageField, imageFile);

  // 서버가 문자열 JSON 받는 방식일 때 (기존 너 코드 유지)
  formData.append(jsonField, JSON.stringify(jsonData));

  const response = await api.request({
    url: endpoint,
    method, // "post" | "put" | "patch"
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    ...options,
  });

  validateContentType(response);
  return response.data;
};

// 프로필 전용: intro/song/image 업로드 (PUT /api/profile 대응용)
export const uploadProfile = async (
  endpoint,
  { intro, song, imageFile },
  {
    introField = "intro",
    songField = "song",
    imageField = "image",
    method = "put",
    ...options
  } = {}
) => {
  const formData = new FormData();
  if (intro !== undefined) formData.append(introField, intro);
  if (song !== undefined) formData.append(songField, song);
  if (imageFile) formData.append(imageField, imageFile);

  const response = await api.request({
    url: endpoint,
    method, // 기본 put
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
    ...options,
  });

  validateContentType(response);
  return response.data;
};

export default api;
