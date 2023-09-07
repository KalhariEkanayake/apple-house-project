import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const renderList = () => {
    if (state) {
      const isAdmin = state.role === "admin";

      if (isAdmin) {
        return (
          <>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/createpost">Create Post</Link>
            </li>
            <li>
              <Link to="/checkpost">Check Post</Link>
            </li>
            <li>
              <Link to="/search">
                <i className="material-icons">search</i>
              </Link>
            </li>

            <li>
              <button
                className="btn waves-effect waves-light #d32f2f red darken-3"
                style={{ marginRight: 10 }}
                onClick={() => {
                  localStorage.clear();
                  dispatch({ type: "CLEAR" });
                  navigate("/login");
                }}
              >
                LOGOUT
              </button>
            </li>
          </>
        );
      } else {
        return (
          <>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/createpost">Create Post</Link>
            </li>
            <li>
              <Link to="/rejectpost">Rejected Post</Link>
            </li>
            <li>
              <Link to="/search">
                <i className="material-icons">search</i>
              </Link>
            </li>

            <li>
              <button
                className="btn waves-effect waves-light #d32f2f red darken-3"
                style={{ marginRight: 10 }}
                onClick={() => {
                  localStorage.clear();
                  dispatch({ type: "CLEAR" });
                  navigate("/login");
                }}
              >
                LOGOUT
              </button>
            </li>
          </>
        );
      }
    } else {
      return (
        <>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </>
      );
    }
  };

  return (
    <nav>
      <div className="nav-wrapper #006064 cyan darken-4">
        <img className="logo-image" src="\logo.jpg" alt="Logo" />
        <Link to={state ? "/home" : "login"} className="brand-logo left">
          Apple House
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
