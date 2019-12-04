import React from "react";
import "./App.css";
import { Switch, Route, withRouter } from "react-router-dom";
import { Redirect } from "react-router";

import Login from "./components/login";
import Nav from "./components/nav";
import Register from "./components/register";
import ProductList from "./components/product-list";
import AddProduct from "./components/add-product";
import Update from "./components/update";
import Chat from "./components/chat";
import { BASE_URL } from "./urls";

//const BASE_URL =  "https://apimarket2023.herokuapp.com"
//const BASE_URL = process.env.BASEURL || "http://localhost:4000"

//``
/*
const arrayBufferToBase64 = buffer => {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
};*/

const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);
  const products = await response.json();
  return products;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.exampleRef = React.createRef();

    this.state = {
      owner: "",
      username: "",
      password: "",
      products: [],
      productName: "",
      productId: "",
      productPrice: "",
      prediction: [],
      fileImage: null,
      fileVideo: null,
      image:"",
      video:""
    };
  }

  async componentDidMount() {
    const products = await getProducts();
    console.log("chapando products");
    console.log(products);
    this.setState({ products: products });
  }

  handleChange = event => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };

  handleDelete = async event => {
    const res = await fetch(
      `${BASE_URL}/products/${event.target.value}/${this.state.owner}`,
      { method: "DELETE" }
    );
    const json = await res.json();
    alert(json.message);
    const products = await getProducts();
    this.setState({ products: products });
  };

  handleSubmit = async event => {
    event.preventDefault();

    //Validaciones
    if (!this.state.productName || !this.state.productPrice) {
      alert("Insert all fields");
      return;
    }
    if (
      !this.state.prediction ||
      !this.state.fileImage ||
      !this.state.fileVideo
    ) {
      alert("Insert an image");
      return;
    }

    //.filter(p => p.confidence > 0.3 )
    console.log(this.state.prediction);

    const productNames = this.state.productName.split(" ");
    console.log(productNames);
    const predictions = this.state.prediction.map(p => p.label);

    const matches = predictions.filter(p => {
      for (var i = 0; i < productNames.length; i++) {
        if (productNames[i] === "") return false;
        if (p.includes(productNames[i].toLowerCase())) return true;
      }
    });

    console.log(matches.length);

    if (!matches.length) {
      alert("Insert an image that matches your product");
      return;
    }

    //Post request
    const formData = new FormData();

    formData.set("enctype", "multipart/form-data");
    formData.append("image", this.state.fileImage);
    formData.append("video", this.state.fileVideo);
    formData.append("name", this.state.productName);
    formData.append("price", this.state.productPrice);
    formData.append("owner", this.state.owner);

    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      body: formData
    });
    const json = await res.json();
    console.log(json);

    const products = await getProducts();

    this.setState({ products: products });
    this.setState({ productName: "" });
    this.setState({ productPrice: "" });
    this.setState({ fileImage: null});
    this.setState({ fileVideo: null });

    alert(json.message);
    this.props.history.push("/productlist");
  };

  handleUpdateRedirect = event => {
    this.setState({ productId: event.target.dataset.id });
    this.setState({ productName: event.target.dataset.name });
    this.setState({ productPrice: event.target.dataset.price });
    this.setState({ image: event.target.dataset.image });
    this.setState({ video: event.target.dataset.video });
    this.props.history.push("/update");
  };

  handleUpdate = async event => {
    event.preventDefault();

    if (!this.state.productName || !this.state.productPrice) {
      alert("Insert all fields");
      return;
    } 
    if (!this.state.prediction) {
      alert("Error with prediction");
      return;
    }
    
      const productNames = this.state.productName.split(" ");
      console.log(productNames);
      const predictions = this.state.prediction.map(p => p.label);

      const matches = predictions.filter(p => {
        for (var i = 0; i < productNames.length; i++) {
          if (productNames[i] === "") return false;
          if (p.includes(productNames[i].toLowerCase())) return true;
        }
      });

      console.log(matches.length);

      if (!matches.length) {
        alert("Insert an image that matches your product");
        return;
      }
    

    const formData = new FormData();

    formData.set("enctype", "multipart/form-data");
    formData.append("image", this.state.fileImage);
    formData.append("video", this.state.fileVideo);
    formData.append("name", this.state.productName);
    formData.append("price", this.state.productPrice);
    formData.append("owner", this.state.owner);
    formData.append("id", this.state.productId);

    const res = await fetch(`${BASE_URL}/products`, {
      method: "PUT",
      body: formData
    });
    const json = await res.json();
    alert(json.message);
    const products = await getProducts();
    this.setState({ products: products });
    this.setState({ productName: "" });
    this.setState({ productPrice: "" });
    this.setState({ productId: "" });
    this.setState({ image: null });
    this.setState({ video: null });
    this.props.history.push("/productlist");
  };

  handleLogin = async event => {
    event.preventDefault();

    console.log("logeando");
    const res = await fetch(`${BASE_URL}/users/signin`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    });
    const json = await res.json();
    //this.setState({ username: "" });
    //this.setState({ password: "" });
    if (json.user) {
      this.setState({ owner: json.user });
      this.props.history.push("/productlist");
    } else if (json.message) {
      alert(json.message);
    }
  };

  handleRegister = async event => {
    event.preventDefault();
    console.log("registrando");

    if (!this.state.username || !this.state.password) {
      alert("Insert all fields");
      return;
    }

    const res = await fetch(`${BASE_URL}/users/signup`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    });
    const json = await res.json();
    console.log(json);
    alert(json.message);
    this.props.history.push("/");
  };

  handleLogout = () => {
    this.setState({ owner: "" });
  };

  handleFiles = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <>
        <Nav handleLogout={this.handleLogout} owner={this.state.owner} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Login
                handleChange={this.handleChange}
                handleLogin={this.handleLogin}
              />
            )}
          />
          <Route
            exact
            path="/register"
            render={() => (
              <Register
                handleChange={this.handleChange}
                handleRegister={this.handleRegister}
              />
            )}
          />
          {this.state.owner ? (
            <>
              <Route
                exact
                path="/productlist"
                render={() => (
                  <ProductList
                    owner={this.state.owner}
                    products={this.state.products}
                    handleDelete={this.handleDelete}
                    handleUpdate={this.handleUpdate}
                    handleUpdateRedirect={this.handleUpdateRedirect}
                  />
                )}
              />
              <Route
                exact
                path="/addproduct"
                render={() => (
                  <AddProduct
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    handleFiles={this.handleFiles}
                    handleResults={this.handleResults}
                  />
                )}
              />
              <Route
                exact
                path="/update"
                render={() => (
                  <Update
                    handleUpdate={this.handleUpdate}
                    handleChange={this.handleChange}
                    productName={this.state.productName}
                    productPrice={this.state.productPrice}
                    handleFiles={this.handleFiles}
                    image={this.state.image}
                    video={this.state.video}
                  />
                )}
              />
              <Route
                exact
                path="/chat"
                render={() => <Chat owner={this.state.owner} />}
              />
            </>
          ) : (
            <Redirect to="/" />
          )}
        </Switch>
      </>
    );
  }
}

export default withRouter(App);
