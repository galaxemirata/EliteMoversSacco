import React, { useState, useEffect, useRef } from "react";

const Comments = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const currentUser = storedUser?.email || "guest";
  const isAdmin = storedUser?.email === "collinsdmwas@gmail.com";

  const [name, setName] = useState(storedUser?.username || "");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifRef = useRef(null);

  // ================= LOAD COMMENTS =================
  const loadComments = () => {
    fetch("http://localhost:5000/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data || []))
      .catch(console.log);
  };

  useEffect(() => {
    loadComments();
  }, []);

  // ================= SUBMIT COMMENT =================
  const handleSubmit = () => {
    if (!name.trim() || !comment.trim()) return;

    fetch("http://localhost:5000/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: currentUser,
        comment,
        imageUrl: storedUser?.profilePic || ""
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setComment("");
        loadComments();
      })
      .catch(console.log);
  };

  // ================= LIKE =================
  const handleLike = (item) => {
    fetch("http://localhost:5000/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment_id: item.id,
        from_email: currentUser,
        to_email: item.email,
      }),
    })
      .then(() => loadComments())
      .catch(console.log);
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    if (!window.confirm("Delete this comment?")) return;

    fetch(`http://localhost:5000/api/comments/${id}`, {
      method: "DELETE",
    })
      .then(() => setComments((prev) => prev.filter((c) => c.id !== id)))
      .catch(console.log);
  };

  // ================= TIME =================
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="container mt-5">

      {/* FORM */}
      <div className="card p-3 mb-4">
        <input
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        <textarea
          className="form-control mb-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write comment..."
        />

        <button className="btn btn-primary" onClick={handleSubmit}>
          Post
        </button>
      </div>

      {/* COMMENTS */}
      {comments.map((item) => {
        const likes = Array.isArray(item.likes)
          ? item.likes
          : JSON.parse(item.likes || "[]");

        const isLiked = likes.includes(currentUser);

        return (
          <div key={item.id} className="card p-3 mb-3">

            <b>{item.name}</b>
            <p>{item.comment}</p>

            <button onClick={() => handleLike(item)}>
              <span style={{ color: isLiked ? "red" : "#999" }}>
                {isLiked ? "❤️" : "🤍"}
              </span>{" "}
              {likes.length}
            </button>

            <small>{timeAgo(item.createdAt)}</small>

            {isAdmin && (
              <button onClick={() => handleDelete(item.id)} style={{ color: "red" }}>
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