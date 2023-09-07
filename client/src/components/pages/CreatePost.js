import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
          createdTime: new Date(),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            // Check the user role to determine whether it's an admin or regular user
            const isAdmin = localStorage.getItem("state.role") === "admin";
            if (isAdmin) {
              // Admin post is automatically approved
              M.toast({
                html: "Post created Successfully!",
                classes: "#43a047 green darken-1",
              });
              navigate("/home"); // Navigate to the home page for admin
            } else {
              // Regular user post needs approval
              M.toast({
                html: "Post created Successfully!",
                classes: "#43a047 green darken-1",
              });
              M.toast({
                html: "Sent to Admin for Approval!",
                classes: "#ad1457 pink darken-1",
              });
              navigate("/checkpost"); // Navigate to the "check post" page for regular users
              navigate("/profile"); // Then, navigate to the user's profile page
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "AppleHouse");
    data.append("cloud_name", "dccpghkck");
    fetch("https://api.cloudinary.com/v1_1/dccpghkck/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "50px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="file-field input-field">
        <div className="btn #455a64 blue-grey darken-2">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light"
        onClick={() => postDetails()}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
