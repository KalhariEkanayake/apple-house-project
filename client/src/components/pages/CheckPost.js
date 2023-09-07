import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import M from "materialize-css";
import Modal from "../Modal";

const CheckPost = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/userposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.regularUserPosts);
      });
  }, []);

  const approvePost = (postId) => {
    fetch(`/approvepost/${postId}`, {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        M.toast({
          html: "Approved post Successfully!",
          classes: "#43a047 green darken-1",
        });

        // Remove the approved post from the data array
        const updatedData = data.filter((item) => item._id !== postId);
        setData(updatedData);
      })
      .catch((err) => {
        console.error("Error approving post:", err);
        // Handle errors as needed
      });
  };

  const handleFeedbackUpdate = (postId, feedbackText) => {
    // Create a copy of the data and find the post by postId
    const updatedData = [...data];
    const postToUpdate = updatedData.find((item) => item._id === postId);

    if (postToUpdate) {
      // Add the feedback to the post's feedbacks array
      postToUpdate.feedbacks.push({
        text: feedbackText,
        // You may want to include other properties like postedBy here
      });

      // Update the state with the new data
      setData(updatedData);
    }
  };

  // Function to remove the rejected post from data state
  const handleRejectPost = (postId) => {
    // Filter out the rejected post
    const updatedData = data.filter((item) => item._id !== postId);
    setData(updatedData);
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
          <h4 style={{ color: "#1a237e" }}>Check Posts</h4>
        </div>
      </div>

      <div className="checkpost">
        {data.map((item) => {
          // Filter out rejected posts from rendering
          if (item.rejected) {
            return null;
          }
          return (
            <div className="card checkpost-card" key={item._id}>
              <h5>
                <span style={{ marginLeft: 5, color: "#4e342e" }}>
                  {item.postedBy.name}
                </span>
                {item.rejected ? (
                  <div key={item._id}>
                    <p>This post has been rejected</p>
                    <h6>Admin Feedback:</h6>
                    {/* {console.log(item.feedbacks)} */}
                    {item.feedbacks.map((feedbackItem) => (
                      <p key={feedbackItem._id}>{feedbackItem.text} </p>
                    ))}
                  </div>
                ) : (
                  !item.approved &&
                  !item.feedbacks.length && ( // Check if there are no feedbacks
                    <button
                      className="btn waves-effect waves-light"
                      style={{ marginLeft: 107 }}
                      onClick={() => approvePost(item._id)}
                    >
                      Approve
                    </button>
                  )
                )}

                {!item.rejected &&
                  !item.feedbacks.length && ( // Check if there are no feedbacks
                    <Modal
                      item={item}
                      handleFeedbackUpdate={handleFeedbackUpdate}
                      handleRejectPost={handleRejectPost}
                    />
                  )}
              </h5>

              <div className="card-image">
                <img src={item.photo} alt={item.title} />
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

export default CheckPost;
