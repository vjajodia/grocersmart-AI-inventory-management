import React, { Component } from "react";
import "../App.css";
const loginDetails = [
  {
    email: "admin@gmail.com",
    password: "admin",
  },
  {
    email: "vaibhav@gmail.com",
    password: "Vaibhav135",
  },
  {
    email: "kesiya@gmail.com",
    password: "kesiya",
  },
  {
    email: "sayali@gmail.com",
    password: "sayali",
  },
  {
    email: "lekha@gmail.com",
    password: "lekha",
  },
];
class Login extends Component {
  state = {
    email: "",
    password: "",
    showWarningBanner: false,
  };

  onSubmit = (e) => {
    e.preventDefault();
    const data = { ...this.state };

    const result = loginDetails.filter(
      (user) => user.email === data.email && user.password === data.password
    );
    if (result.length === 1) {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("email", this.state.email);
      window.location = "/";
    } else {
      this.setState({ showWarningBanner: true });
    }
  };

  handleChange = (e) => {
    if (e.currentTarget.name === "email") {
      this.setState({ email: e.currentTarget.value });
    } else {
      this.setState({ password: e.currentTarget.value });
    }
  };

  render() {
    return (
      <div>
        {this.state.showWarningBanner && (
          <div className="alert alert-warning alert-dismissible">
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              onClick={() => this.setState({ showWarningBanner: false })}
            >
              &times;
            </button>
            Account already exists with same email address or phone number.
          </div>
        )}
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-5 m-auto">
              <img src="/AppLogo.jpeg" alt="" width="400" height="400" />
            </div>
            <div className="col-md-5 m-auto">
              <p className="lead text-center">
                Sign in to your GrocerSmart account
              </p>
              <div className="col">
                <form onSubmit={this.onSubmit} className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    className="form-control form-element mt-2"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    className="form-control form-element mt-2"
                  />
                  <button type="submit" className="btn btn-info btn-block mt-4">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
