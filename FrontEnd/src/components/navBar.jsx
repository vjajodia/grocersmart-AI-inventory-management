import React from "react";
import { Link } from "react-router-dom";

const emailAndNames = [
  {
    name: "Vaibhav",
    email: "vaibhav@gmail.com",
  },
  {
    name: "Kesiya",
    email: "kesiya@gmail.com",
  },
  {
    name: "Lekha",
    email: "lekha@gmail.com",
  },
  {
    name: "Sayali",
    email: "sayali@gmail.com",
  },
  {
    name: "Administrator",
    email: "admin@gmail.com",
  },
];

export const NavBar = (props) => {
  const { isLoggedIn, email } = props;

  const logout = (e) => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("name");
    window.location = "/login";
  };

  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <a class="navbar-brand" href="#">
          GrocerSmart
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          {isLoggedIn && (
            <ul class="navbar-nav">
              <li class="nav-item active">
                <div className="nav-link" href="">
                  <Link to="/">Home</Link>
                </div>
              </li>
              <li class="nav-item">
                <div className="nav-link" href="">
                  <Link to="/predict">Predict</Link>
                </div>
              </li>
            </ul>
          )}
          <ul class="nav navbar-nav navbar-right ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="#">
                {isLoggedIn
                  ? emailAndNames.filter((item) => item.email === email)[0].name
                  : ""}
              </a>
            </li>
            <li class="nav-item">
              <a class="navbar-brand" href="#">
                {isLoggedIn ? (
                  <img src="/download.png" alt="" width="30" height="24" />
                ) : (
                  ""
                )}
              </a>
            </li>
            <li class="nav-item">
              <a class="navbar-brand" onClick={logout}>
                {isLoggedIn ? "Logout" : ""}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
