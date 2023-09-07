import React from "react";

const PostCard = ({ post }) => {
  return (
    <div className="card home-card" key={post._id}>
      <h5>
        <span style={{ marginLeft: 5, color: "#4e342e" }}>
          {post.postedBy.name}
        </span>
      </h5>

      <div className="card-image">
        <img src={post.photo} alt={post.title} />
      </div>

      <div className="card-content">
        {/* Render other post details here */}
        <h6 style={{ fontWeight: "600", color: "#3e2723" }}>{post.title}</h6>

        <p>{post.body}</p>

        {post.comments.map((post) => {
          return (
            <h6 key={post._id}>
              <span style={{ fontWeight: "500", color: "#4527a0" }}>
                {post.postedBy.name}{" "}
              </span>{" "}
              <span style={{ fontSize: 16 }}> {post.text} </span>{" "}
            </h6>
          );
        })}

        <p style={{ color: "#e040fb", textAlign: "right" }}>
          {new Date(post.createdTime).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
