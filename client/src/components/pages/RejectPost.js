import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";

const RejectPost = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    // Fetch the rejected posts for the currently logged-in user (state._id)
    fetch("/rejectedposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        // Update the state with the fetched rejected posts
        setData(result.rejectedPosts);
      })
      .catch((err) => {
        console.error("Error fetching rejected posts:", err);
      });
  }, []);

  const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        M.toast({
          html: "Post deleted Successfully!",
          classes: "#c62828 red darken-3",
        });
        const newData = data.filter((item) => {
          return item._id !== postId;
        });
        setData(newData);
      });
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <h4 style={{ color: "#1a237e" }}>Rejected Posts</h4>
        </div>
      </div>

      <div className="rejectposts">
        {data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <h5>
                {item.postedBy._id == state._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                      cursor: "pointer",
                      color: "#c2185b",
                      marginRight: 5,
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}{" "}
              </h5>

              <p
                style={{
                  color: "red",
                  fontSize: "22px",
                  marginTop: -7,
                  textAlign: "center",
                }}
              >
                This post has been rejected
              </p>
              <h6
                style={{
                  marginLeft: 10,
                  fontWeight: "600",
                  marginBottom: 18,
                  color: "#4e342e",
                }}
              >
                Admin Feedback :
                {item.feedbacks.map((feedbackItem) => (
                  <span
                    style={{
                      fontWeight: "normal",
                      marginLeft: 10,
                      color: "black",
                    }}
                    key={feedbackItem._id}
                  >
                    {feedbackItem.text}{" "}
                  </span>
                ))}
              </h6>

              <div className="card-image">
                <img className="item" src={item.photo} alt={item.title} />
              </div>

              <div className="card-content">
                <i
                  className="material-icons"
                  style={{ color: "red", marginRight: 5 }}
                >
                  favorite
                </i>
                <i
                  className="material-icons"
                  style={{ marginRight: 5, color: "#90a4ae" }}
                >
                  thumb_up
                </i>
                <h6
                  style={{
                    color: "#4caf50",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginTop: -29,
                    marginLeft: 400,
                  }}
                >
                  {item.likes.length} Likes
                </h6>
                <p style={{ color: "#e040fb" }}>
                  {new Date(item.createdTime).toLocaleString()}
                </p>{" "}
                {/* Display createdTime */}
                <h6 style={{ fontWeight: "600", color: "#3e2723" }}>
                  {item.title}
                </h6>
                <p>{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RejectPost;
