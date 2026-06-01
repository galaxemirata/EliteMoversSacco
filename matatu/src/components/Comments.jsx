import React, { useState, useEffect, useRef } from "react";

const Comments = () => {
  let storedUser = null;

  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    storedUser = null;
  }

  const currentUser = storedUser?.email || "guest";
  const isAdmin =
    storedUser?.email === "collinsdmwas@gmail.com";

  const [name, setName] = useState(
    storedUser?.username || ""
  );
  const [comment, setComment] = useState("");

  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem("comments");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [showNotifications, setShowNotifications] =
    useState(false);

  const notifRef = useRef(null);

  // SAVE COMMENTS
  useEffect(() => {
    localStorage.setItem(
      "comments",
      JSON.stringify(comments)
    );
  }, [comments]);

  // SAVE NOTIFICATIONS
  useEffect(() => {
    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // CLOSE NOTIFICATIONS ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ✅ FIXED: profile picture sync (ONLY ONCE, CLEAN)
  useEffect(() => {
    if (!storedUser?.email || !storedUser?.profilePic)
      return;

    setComments((prev) =>
      prev.map((item) =>
        item.owner === storedUser.email
          ? {
              ...item,
              imageUrl: storedUser.profilePic,
            }
          : item
      )
    );
  }, [
    storedUser?.email,
    storedUser?.profilePic,
  ]);

  // TIME FORMAT
  const timeAgo = (timestamp) => {
    const seconds = Math.floor(
      (Date.now() - timestamp) / 1000
    );
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600)
      return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400)
      return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // CREATE COMMENT
  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) {
      alert("Please fill all fields");
      return;
    }

    const newComment = {
      id: Date.now(),
      name,
      comment,
      createdAt: Date.now(),
      likes: [],
      owner: currentUser,
      imageUrl: storedUser?.profilePic || "",
    };

    setComments((prev) => [newComment, ...prev]);
    setComment("");
  };

  // LIKE + NOTIFICATION
  const handleLike = (id) => {
    let notification = null;

    setComments((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (item.likes?.includes(currentUser))
          return item;

        const updatedLikes = [
          ...(item.likes || []),
          currentUser,
        ];

        if (item.owner !== currentUser) {
          notification = {
            id: `${Date.now()}-${id}`,
            to: item.owner,
            from: currentUser,
            fromName:
              storedUser?.username || "Someone",
            fromProfilePic:
              storedUser?.profilePic || "",
            message: `${
              storedUser?.username || "Someone"
            } liked your comment`,
            createdAt: Date.now(),
            read: false,
          };
        }

        return {
          ...item,
          likes: updatedLikes,
        };
      })
    );

    if (notification) {
      setNotifications((prev) => {
        const exists = prev.some(
          (n) =>
            n.to === notification.to &&
            n.from === notification.from &&
            n.message === notification.message
        );

        if (exists) return prev;

        return [notification, ...prev];
      });
    }
  };

  // DELETE
  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete?"
    );
    if (confirmed) {
      setComments((prev) =>
        prev.filter((item) => item.id !== id)
      );
    }
  };

  // FILTER NOTIFICATIONS (WORKING VERSION)
  const userNotifications = notifications.filter(
    (n) => n.to === currentUser
  );

  const unreadCount = userNotifications.filter(
    (n) => !n.read
  ).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    setNotifications((prev) =>
      prev.map((n) =>
        n.to === currentUser
          ? { ...n, read: true }
          : n
      )
    );
  };

  return (
    <div className="container mt-5">

      {/* NOTIFICATIONS */}
      <div
        ref={notifRef}
        style={{
          position: "relative",
          marginBottom: 20,
        }}
      >
        <button
          onClick={toggleNotifications}
          className="btn btn-dark"
        >
          🔔 {unreadCount > 0 ? unreadCount : ""}
        </button>

        {showNotifications && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 40,
              background: "black",
              color: "white",
              padding: 10,
              borderRadius: 10,
              width: 260,
              zIndex: 9999,
            }}
          >
            {userNotifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              userNotifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                    fontSize: 12,
                  }}
                >
                  {n.fromProfilePic ? (
                    <img
                      src={n.fromProfilePic}
                      alt="user"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#555",
                      }}
                    />
                  )}

                  <span>{n.message}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* FORM */}
      <div className="card p-3 mb-4" id="commentcard">
        <input
          className="form-control mb-2"
          value={name}
          readOnly={!!storedUser?.username}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          rows="3"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
        />

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>

      {/* COMMENTS */}
      {comments.map((item) => {
        const isLiked = item.likes?.includes(
          currentUser
        );

        return (
          <div
            key={item.id}
            className="card p-3 mb-3"
            id="usercomments"
          >
            <div className="d-flex align-items-center mb-2 text-info">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  width={40}
                  height={40}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#ccc",
                    marginRight: 10,
                  }}
                />
              )}

              <b>{item.name}</b>
            </div>

            <p className="mb-2">
              {item.comment}
            </p>

            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() =>
                  handleLike(item.id)
                }
                disabled={item.likes?.includes(
                  currentUser
                )}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: isLiked
                      ? "red"
                      : "#999",
                  }}
                >
                  {isLiked ? "❤️" : "🤍"}
                </span>{" "}
                {item.likes?.length || 0}
              </button>

              <small className="text-secondary">
                {timeAgo(item.createdAt)}
              </small>
            </div>

            {isAdmin && (
              <button
                onClick={() =>
                  handleDelete(item.id)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  color: "red",
                  fontSize: 14,
                  marginTop: 5,
                }}
              >
                Delete
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;