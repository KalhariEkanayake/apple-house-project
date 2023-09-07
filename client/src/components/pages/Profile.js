import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";

const Profile = () => {
  // const [mypics,setPics] = useState([])
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const { state, dispatch } = useContext(UserContext);
  console.log(state);

  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.mypost);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);

        setComment("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
          />
        </div>
        <div>
          <h4 style={{ color: "#1a237e" }}>{state ? state.name : "loading"}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          ></div>
        </div>
      </div>

      <div className="profile">
        {data.map((item) => {
          return (
            <div className="card home-card" key={item._id}>
              <h5>
                <span style={{ marginLeft: 5, color: "#4e342e" }}>
                  {/* {item.postedBy.name} */}
                </span>
                {item.postedBy._id == state._id && (
                  <i
                    className="material-icons"
                    style={{
                      float: "right",
                      color: "#c2185b",
                      marginRight: 8,
                      marginBottom: 8,
                      cursor: "pointer",
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete
                  </i>
                )}{" "}
              </h5>

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
                {item.likes.includes(state._id) ? (
                  <i
                    className="material-icons"
                    style={{
                      color: "#0288d1",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      unlikePost(item._id);
                    }}
                  >
                    thumb_down
                  </i>
                ) : (
                  <i
                    className="material-icons"
                    style={{
                      marginRight: 5,
                      color: "#90a4ae",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      likePost(item._id);
                    }}
                  >
                    thumb_up
                  </i>
                )}
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
                {item.comments.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500", color: "#4527a0" }}>
                        {record.postedBy.name}{" "}
                      </span>{" "}
                      <span style={{ fontSize: 16 }}> {record.text} </span>{" "}
                    </h6>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (comment.trim() !== "") {
                      makeComment(e.target[0].value, item._id);
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
