import React from "react";
import { Link } from "react-router-dom";

const Login = props => (
  <div className="page-container">
    <form className="content" onSubmit={props.handleLogin}>
      <input
        type="text"
        placeholder="Username"
        name="username"
        onChange={props.handleChange}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        onChange={props.handleChange}
      />
      <button className="btn-large waves-effect waves-light app-btn">
        Login
      </button>
    </form>
    <Link to="/register">Register</Link>
  </div>
);

export default Login;
