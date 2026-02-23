import React, { useEffect, useState } from "react";
import { get, post, del } from "../../api";
import config from "../../config";
import "../../styles/MyPage.css";
import profilemusic from "../../assets/image/search.png";

const YoutubeModal = ({ isOpen, onClose, onPick }) => {
  const [tab, setTab] = useState("search"); // "search" | "me"
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [mySongs, setMySongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTab("search");
    setKeyword("");
    setResults([]);
    fetchMySongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchMySongs = async () => {
    try {
      setLoading(true);
      const data = await get(config.YOUTUBE.ME);
      const list = data?.songs ?? data?.data ?? data ?? [];
      setMySongs(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("내 저장곡 조회 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    try {
      setLoading(true);

      // ✅ 스웨거에서 param 이름이 keyword면 { keyword: ... } 로 바꿔줘
      const data = await get(config.YOUTUBE.SEARCH, { query: keyword.trim() });

      const list = data?.items ?? data?.songs ?? data?.data ?? data ?? [];
      setResults(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("유튜브 검색 실패:", e);
      alert("검색 실패! (query/keyword 파라미터 확인 필요)");
    } finally {
      setLoading(false);
    }
  };

  const normalizeId = (song, fallback) =>
    song?.songId ?? song?.id ?? song?.videoId ?? fallback;

  const normalizeTitle = (song) => song?.title ?? song?.name ?? "제목없음";
  const normalizeArtist = (song) => song?.artist ?? song?.channelTitle ?? "";

  const handlePick = (song) => {
    const title = normalizeTitle(song);
    const artist = normalizeArtist(song);
    onPick?.({
      ...song,
      displayText: artist ? `${title} - ${artist}` : title,
    });
    onClose?.();
  };

  const handleSaveSong = async (song) => {
    try {
      setLoading(true);

      await post(config.YOUTUBE.SAVE, {
        songId: normalizeId(song),
        title: normalizeTitle(song),
        artist: normalizeArtist(song),
        thumbnailUrl: song?.thumbnailUrl ?? song?.thumbnail ?? "",
        raw: song,
      });

      await fetchMySongs();
      alert("저장 완료!");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("저장 실패! (요청 body 필드명 songId 확인 필요)");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSaved = async (songId) => {
    try {
      setLoading(true);
      await del(config.YOUTUBE.DELETE_SAVED(songId));
      await fetchMySongs();
    } catch (e) {
      console.error("삭제 실패:", e);
      alert("삭제 실패!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ytm-overlay" onClick={onClose}>
      <div className="ytm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ytm-header">
          <div className="ytm-title">노래 선택</div>
          <button className="ytm-close" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>

        <div className="ytm-tabs">
          <button
            className={`ytm-tab ${tab === "search" ? "active" : ""}`}
            onClick={() => setTab("search")}
          >
            검색
          </button>
          <button
            className={`ytm-tab ${tab === "me" ? "active" : ""}`}
            onClick={() => setTab("me")}
          >
            내 저장곡
          </button>
        </div>

        {tab === "search" && (
          <>
            <div className="ytm-searchRow">
              <input
                className="ytm-input"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어 입력"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="ytm-btn" onClick={handleSearch} disabled={loading}>
                <img
                    src={profilemusic}
                    alt="프로필 노래 수정 아이콘"
                    className="profile-search-icon"
                    style={{cursor: "pointer"}}
                  />
              </button>
            </div>

            <div className="ytm-list">
              {results.map((s, idx) => {
                const id = normalizeId(s, `r-${idx}`);
                const title = normalizeTitle(s);
                const artist = normalizeArtist(s);

                return (
                  <div className="ytm-item" key={id}>
                    <div className="ytm-itemText">
                      <div className="ytm-itemTitle">{title}</div>
                      {artist && <div className="ytm-itemSub">{artist}</div>}
                    </div>

                    <div className="ytm-actions">
                      <button className="ytm-btn" onClick={() => handlePick(s)}>
                        선택
                      </button>
                      <button
                        className="ytm-btn ytm-btn-secondary"
                        onClick={() => handleSaveSong(s)}
                        disabled={loading}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                );
              })}

              {!loading && results.length === 0 && (
                <div className="ytm-empty">검색 결과가 없어요.</div>
              )}
            </div>
          </>
        )}

        {tab === "me" && (
          <div className="ytm-list">
            {mySongs.map((s, idx) => {
              const id = normalizeId(s, `m-${idx}`);
              const title = normalizeTitle(s);
              const artist = normalizeArtist(s);

              return (
                <div className="ytm-item" key={id}>
                  <div className="ytm-itemText">
                    <div className="ytm-itemTitle">{title}</div>
                    {artist && <div className="ytm-itemSub">{artist}</div>}
                  </div>

                  <div className="ytm-actions">
                    <button className="ytm-btn" onClick={() => handlePick(s)}>
                      선택
                    </button>
                    <button
                      className="ytm-btn ytm-btn-danger"
                      onClick={() => handleDeleteSaved(id)}
                      disabled={loading}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}

            {!loading && mySongs.length === 0 && (
              <div className="ytm-empty">저장한 노래가 없어요.</div>
            )}
          </div>
        )}

        {loading && <div className="ytm-loading">불러오는 중...</div>}
      </div>
    </div>
  );
};

export default YoutubeModal;
