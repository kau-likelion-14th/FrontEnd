const BASE_URL ="http://lte-dev-env.eba-xaqgpxhu.ap-northeast-2.elasticbeanstalk.com";

const config = {
    API_URL: BASE_URL,

    TODOS: {
        DELETE_BY_DATE: (todoId, date) => `${BASE_URL}/api/todos/${todoId}/dates/${date}`, // DELETE: 투두 삭제
        DETAIL: (todoId) => `${BASE_URL}/api/todos/${todoId}`, // GET: 투두 상세 조회
        LIST: `${BASE_URL}/api/todos`, // GET: 투두 리스트 조회
        TOGGLE_COMPLETE: (todoId, date) => `${BASE_URL}/api/todos/${todoId}/dates/${date}/complete`, // PATCH: 완료 토글
        POST: `${BASE_URL}/api/todos`, // POST: 투두 추가
        PUT: (todoId) => `${BASE_URL}/api/todos/${todoId}` // PUT: 투두 상세 수정
    },

    STATISTICS: {
        GET: `${BASE_URL}/api/statistics`
    },

    HEALTH: {
        GET: `${BASE_URL}/health`
    },

    FOLLOW: {
        DELETE: `${BASE_URL}/api/follow`,
        LIST: `${BASE_URL}/api/follow`,  // GET
        SEARCH: `${BASE_URL}/api/follow/search`, // GET
        FOLLOWINGS: `${BASE_URL}/api/follow/followings`, // GET
        FOLLOWERS: `${BASE_URL}/api/follow/followers`, // GET
        POST: `${BASE_URL}/api/follow`
    },

    PROFILE: {
        DELETE: `${BASE_URL}/api/profile`,
        PUT: `${BASE_URL}/api/profile`
    },

    CALENDAR: {
        GET: `${BASE_URL}/api/todos/calendar` // GET 월별 캘린더 조회
    },

    CATEGORIES: {
        GET: `${BASE_URL}/api/categories`
    },

    YOUTUBE: {
        DELETE_SAVED: (songId) => `${BASE_URL}/api/youtube/save/${songId}`, // DELETE
        SEARCH: `${BASE_URL}/api/youtube/search`, // GET
        ME: `${BASE_URL}/api/youtube/me`, // GET
        SAVE: `${BASE_URL}/api/youtube/save` // POST
    },

    AUTH: {
        WITHDRAW: `${BASE_URL}/api/auth/withdraw`, // DELETE
        REISSUE: `${BASE_URL}/api/auth/reissue`, // POST
        LOGIN: `${BASE_URL}/api/auth/login`, // POST
        KAKAO: `${BASE_URL}/api/auth/kakao`, // POST
    }
};

export default config;