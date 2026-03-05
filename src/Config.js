// Config.js

const BASE_URL = 
  process.env.NODE_ENV === "production"
    ? ""
    : "";

const config = {
  API_URL: BASE_URL,

  TODOS: {
    DELETE_BY_DATE: (todoId, date) => `${BASE_URL}/api/todos/${todoId}/dates/${date}`,
    DETAIL: (todoId) => `${BASE_URL}/api/todos/${todoId}`,
    LIST: `${BASE_URL}/api/todos`,
    TOGGLE_COMPLETE: (todoId, date) => `${BASE_URL}/api/todos/${todoId}/dates/${date}/complete`,
    POST: `${BASE_URL}/api/todos`,
    PUT: (todoId) => `${BASE_URL}/api/todos/${todoId}`,
  },

  STATISTICS: {
    GET: `${BASE_URL}/api/statistic`,
  },

  HEALTH: {
    GET: `${BASE_URL}/health`,
  },

  FOLLOW: {
    DELETE: `${BASE_URL}/api/follow`,
    LIST: `${BASE_URL}/api/follow`,
    SEARCH: `${BASE_URL}/api/follow/search`,
    FOLLOWINGS: `${BASE_URL}/api/follow/followings`,
    FOLLOWERS: `${BASE_URL}/api/follow/followers`,
    POST: `${BASE_URL}/api/follow`,
  },

  PROFILE: {
    DELETE: `${BASE_URL}/api/profile`,
    PUT: `${BASE_URL}/api/profile`,
  },

  CALENDAR: {
    GET: `${BASE_URL}/api/todos/calendar`,
  },

  CATEGORIES: {
    GET: `${BASE_URL}/api/categories`,
  },

  YOUTUBE: {
    DELETE_SAVED: (songId) => `${BASE_URL}/api/youtube/save/${songId}`,
    SEARCH: `${BASE_URL}/api/youtube/search`,
    ME: `${BASE_URL}/api/youtube/me`,
    SAVE: `${BASE_URL}/api/youtube/save`,
  },

  AUTH: {
    WITHDRAW: `${BASE_URL}/api/auth/withdraw`,
    REISSUE: `${BASE_URL}/api/auth/reissue`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    KAKAO: `${BASE_URL}/api/auth/kakao`,
  },
  
  FRIEND: {
    PROFILE: (friendId) => `${BASE_URL}/api/users/${friendId}`, // 또는 /api/friends/{id}
    TODOS: {
      LIST: (friendId) => `${BASE_URL}/api/users/${friendId}/todos`, // date=YYYY-MM-DD
    },
    CALENDAR: {
      GET: (friendId) => `${BASE_URL}/api/users/${friendId}/todos/calendar`, // year, month
    },
  },
};

export default config;