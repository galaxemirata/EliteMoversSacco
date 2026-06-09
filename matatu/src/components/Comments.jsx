import React, { useState, useEffect, useRef } from "react";

const Comments = () => {
  let storedUser = null;

  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    storedUser = null;
  }

  const currentUser = storedUser?.email || "guest";
  const isAdmin = storedUser?.email === "collinsdmwas@gmail.com";

  const [name, setName] = useState(storedUser?.username || "");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifRef = useRef(null);

  // ================= LOAD COMMENTS =================
  useEffect(() => {
    fetch("http://localhost:5000/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.log(err));
  }, []);

  // ================= LOAD NOTIFICATIONS =================
  useEffect(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5000/api/notifications/${currentUser}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.log(err));
  }, [currentUser]);

  // ================= CLOSE NOTIFICATIONS =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= TIME FORMAT =================
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // ================= CREATE COMMENT =================
  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email: currentUser,
        comment,
        imageUrl: storedUser?.profilePic || "",
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setComment("");
        return fetch("http://localhost:5000/api/comments");
      })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.log(err));
  };

  // ================= LIKE (BACKEND FIXED) =================
  const handleLike = (comment) => {
    fetch("http://localhost:5000/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment_id: comment.id,
        from_email: currentUser,
        to_email: comment.email,
      }),
    })
      .then(() => fetch("http://localhost:5000/api/comments"))
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.log(err));
  };

  // ================= DELETE COMMENT =================
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    fetch(`http://localhost:5000/api/comments/${id}`, {
      method: "DELETE",
    })
      .then(() =>
        setComments((prev) => prev.filter((item) => item.id !== id))
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-5">

      {/* NOTIFICATIONS ICON (simple UI) */}
      <div ref={notifRef} className="mb-3">
        <button
          className="btn btn-dark"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔 {notifications.length}
        </button>

        {showNotifications && (
          <div
            style={{
              position: "absolute",
              background: "#222",
              color: "white",
              padding: 10,
              marginTop: 10,
              borderRadius: 10,
              width: 250,
              zIndex: 999,
            }}
          >
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{ marginBottom: 8 }}>
                  {n.message}
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
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleSubmit}>
          Post
        </button>
      </div>

      {/* COMMENTS */}
      {comments.map((item) => {
        const isLiked = item.likes?.includes(currentUser);

        return (
          <div key={item.id} className="card p-3 mb-3" id="usercomments">
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

            <p className="mb-2">{item.comment}</p>

            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => handleLike(item)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                <span style={{ color: isLiked ? "red" : "#999" }}>
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
                onClick={() => handleDelete(item.id)}
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