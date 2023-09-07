import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import PostCard from "../PostCard"; // Import the PostCard component

const Search = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [createdTime, setCreatedTime] = useState("");
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        setData(result.posts);
      });
  }, []);

  const trimmedName = name.trim();

  const fetchPosts = () => {
    fetch("/search-posts", {
      method: "post", // Specify the method as POST
      headers: {
        "Content-Type": "application/json", // Specify content type
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        searchText: search,
        filterByUser: trimmedName,
        filterByCreatedTime: createdTime,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results.posts);
        setData(results.posts);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  };

  return (
    <div>
      <h4 style={{ color: "#1a237e", textAlign: "center" }}>Search</h4>

      <div className="search">
        <input
          type="text"
          placeholder="Search by mactching text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filter by user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {state && state.role === "admin" && (
          <>
            <input
              type="text"
              placeholder="Filter by created time (YYYY-MM-DD)"
              value={createdTime}
              onChange={(e) => setCreatedTime(e.target.value)}
            />
          </>
        )}
        <button
          className="btn #66bb6a green lighten-1"
          onClick={() => {
            fetchPosts();
          }}
        >
          Search
        </button>
        <ul className="collection">
          {data && data.length > 0 ? (
            data.map((post) => (
              <li className="collection-item" key={post._id}>
                {/* Render PostCard for each search result */}
                <PostCard post={post} />
              </li>
            ))
          ) : (
            <p style={{ marginLeft: 10 }}>No search results found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Search;
