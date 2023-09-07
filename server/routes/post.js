const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find({ approved: true })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic, createdTime } = req.body;
  console.log(title, body, pic, createdTime);
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  // console.log(req.user)
  // res.send("OK")
  req.user.password = undefined;

  if (req.user.role === "admin") {
    // Admin-specific logic
    const post = new Post({
      title,
      body,
      photo: pic,
      createdTime,
      approved: true, // Admin posts are automatically approved
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        res.json({ post: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    // Regular user-specific logic
    const post = new Post({
      title,
      body,
      photo: pic,
      approved: false, // Regular user posts need approval
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        res.json({ post: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id, approved: true })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/userposts", requireLogin, (req, res) => {
  Post.find({ approved: false })
    .populate("postedBy", "_id name")
    .then((regularUserPosts) => {
      res.json({ regularUserPosts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")

    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(422).json({ error: "Post not found" });
      }

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        Post.deleteOne({ _id: req.params.postId })
          .then(() => {
            res.json({ message: "Successfully Deleted" });
            // res.json(post)
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ error: "An error occurred while deleting the post" });
          });
      }
    });
});

router.put("/approvepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(422).json({ error: "Post not found" });
      }

      // Set the post's approved flag to true.
      post.approved = true;
      post
        .save()
        .then((approvedPost) => {
          res.json({ message: "Post approved successfully", approvedPost });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .json({ error: "An error occurred while approving the post" });
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "An error occurred while finding the post" });
    });
});

router.put("/rejectpost", requireLogin, (req, res) => {
  const { text, postId } = req.body;
  const rejectpost = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { feedbacks: rejectpost },
      rejected: true, // Set the post as rejected
    },
    { new: true }
  )
    .populate("feedbacks.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.get("/rejectedposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id, rejected: true }) // Only fetch rejected posts for the specified user
    .populate("postedBy", "_id name")
    .then((rejectedPosts) => {
      res.json({ rejectedPosts });
    })
    .catch((err) => {
      console.log(err);
    });
});


// Modify your backend route to handle post search for both user roles
router.post("/search-posts", requireLogin, (req, res) => {
  const { searchText, filterByUser, filterByCreatedTime } = req.body;
  console.log(searchText, filterByUser, filterByCreatedTime);

  // Create an empty query object to build the search query dynamically
  const query = {};

  // If searchText is provided, search for posts containing the text
  if (searchText) {
    query.$or = [
      { title: { $regex: searchText, $options: "i" } }, // Case-insensitive title search
      { body: { $regex: searchText, $options: "i" } }, // Case-insensitive body search
    ];
  }

  // Regular user-specific criteria
  if (req.user.role === "user") {
    console.log("filterByUser:", filterByUser);
    query.approved = true; // Only show approved posts to regular users

    // Regular users can filter by user name
    if (filterByUser) {
      // Assuming filterByUser is the user's name
      const user = User.findOne({ name: filterByUser }).select("_id");
      console.log("User found:", user);
      if (user) {
        // query['postedBy'] = user._id; // Filter by user ObjectId
        query["postedBy.name"] = { $regex: new RegExp(filterByUser, "i") };
        // query['postedBy.name'] = { $regex: new RegExp(`^${trimmedFilterByUser}$`, 'i') };
      }
    }
    console.log("Final Query:", query);
  }

  // Admin-specific criteria
  if (req.user.role === "admin") {
    if (filterByUser) {
      // Assuming filterByUser is the user's name
      const user = User.findOne({ name: filterByUser }).select("_id");
      if (user) {
        // query['postedBy'] = user._id; // Filter by user ObjectId
        query["postedBy.name"] = { $regex: new RegExp(filterByUser, "i") };
      }
    }

    if (filterByCreatedTime) {
      query.createdTime = { $gte: new Date(filterByCreatedTime) }; // Filter by created time if provided
    }
  }

  // Use the constructed query to find matching posts
  Post.find(query)
    // .select('postedBy', '_id name createdTime')
    .populate("postedBy", "_id name createdTime")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "An error occurred while searching for posts" });
    });

  // try {
  //     // Use the constructed query to find matching posts
  //     const posts = Post.find(query)
  //         .populate('postedBy', '_id name createdTime');

  //     res.json({ posts });
  // } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ error: 'An error occurred while searching for posts' });
  // }
});

module.exports = router;
