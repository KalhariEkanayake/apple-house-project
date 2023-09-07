import React, { useState, useEffect } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

const Modal = ({ item, handleFeedbackUpdate, handleRejectPost }) => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const options = {
      onOpenStart: () => {
        console.log("Open Start");
      },
      onOpenEnd: () => {
        console.log("Open End");
      },
      onCloseStart: () => {
        console.log("Close Start");
      },
      onCloseEnd: () => {
        console.log("Close End");
      },
      inDuration: 250,
      outDuration: 250,
      opacity: 0.5,
      dismissible: false,
      startingTop: "4%",
      endingTop: "10%",
    };
    M.Modal.init(document.querySelector(".modal"), options);
  }, []);

  const handleReject = () => {
    if (!feedback) {
      // Check if feedback is empty and handle accordingly
      M.toast({
        html: "Please provide feedback before Rejecting",
        classes: "#c62828 red darken-3",
      });
      // alert("Please provide feedback before rejecting.");
      return;
    }

    // Send the rejection feedback to the server using item._id and feedback
    fetch("/rejectpost", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: item._id,
        text: feedback,
        userId: item.postedBy._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // Handle the server response if needed
        console.log("Post rejected with feedback:", result);
        // You can update the UI or perform any necessary actions here

        // Call the handleFeedbackUpdate function to update the UI
        handleFeedbackUpdate(item._id, feedback);

        // Call the handleRejectPost function to remove the post
        handleRejectPost(item._id);
        M.toast({
          html: "Post rejected Successfully!",
          classes: "#43a047 green darken-1",
        });
      })
      .catch((err) => {
        console.error("Error rejecting post:", err);
        // Handle errors as needed
      });
  };

  return (
    <div>
      <button
        className="waves-effect waves-light btn modal-trigger #d32f2f red darken-3"
        data-target="modal1"
        style={{ marginLeft: 416, marginTop: -70 }}
      >
        Reject
      </button>

      <div id="modal1" className="modal">
        <div className="modal-content">
          <form>
            <h4>Feedback</h4>
            <input
              // id="feedback-input" // Add an ID to the input
              type="text"
              placeholder="Write a feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </form>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-light btn #d32f2f red darken-3"
            style={{ marginRight: 10 }}
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="modal-close waves-effect waves-light btn"
            style={{ marginRight: 15 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
