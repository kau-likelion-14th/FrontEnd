// C:\Users\kimye\OneDrive\바탕 화면\lte-frontend\src\pages\FriendPage\FriendUnfollowModal.js
import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

/**
 * FriendUnfollowModal
 * - 팔로우 목록에서 "삭제(언팔)" 확인 모달
 *
 * Props:
 * - isOpen: boolean (모달 열림 여부)
 * - friend: { id, name, tag } | null (삭제 대상)
 * - onConfirm: () => void (예 클릭 시)
 * - onClose: () => void (아니오/닫기)
 */
function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 모달 닫혔을 땐 렌더 안 함
  if (!isOpen) return null;

  const displayName = friend?.name ?? "";
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  const handleOverlayClick = (e) => {
    // 오버레이(배경) 클릭 시 닫기, 모달 박스 클릭은 무시
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}>
      <div className="friend-unfollow-modal__content" role="dialog" aria-modal="true">
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">
              {displayName}
          </span>{" "}
          <span className="friend-unfollow-modal__tag">
              {displayTag}
          </span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>


        <div className="friend-unfollow-modal__actions">
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm}
          >
            예
          </button>
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;
