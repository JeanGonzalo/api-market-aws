import React from 'react'
import { Link } from "react-router-dom";

const Nav = (props) => (
<nav style={{display:props.owner ? "" : "none"}}>
    <div className="nav-wrapper" >
      <span className="brand-logo">>Welcome, {props.owner}</span>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        <li><Link to="/productlist">Products</Link></li>
        <li><Link to="/addproduct">Add Product</Link></li>
        <li><Link to="/chat">Chat</Link></li>

        <li><Link onClick={props.handleLogout} to="/">Sign Out</Link></li>
      </ul>
    </div>
  </nav>
)

export default Nav;