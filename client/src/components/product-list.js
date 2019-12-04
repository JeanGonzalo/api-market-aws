import React, { useState } from "react";
import { BASE_URL } from "../urls";

//const BASE_URL = "https://apimarket2023.herokuapp.com";


const ProductList = props => {
  const [paginationStart, setPaginationStart] = useState(0);
  const [paginationEnd, setPaginationEnd] = useState(10);

  return (
    <div style={{ padding: "50px" }}>
      {console.log(props.products)}
      <table style={{fontSize:"30px"}}>
        <tbody>
          <tr style={{ textAlign: "center" }}>
            <th width="25%">Picture</th>
            <th width="15%">Name</th>
            <th width="15%">Price</th>
            <th width="15%">Owner</th>
            <th>Video</th>
            <th>Action</th>
          </tr>
          {props.products
            .filter((p, i) => paginationStart <= i && i <= paginationEnd)
            .map(prod => (
              <tr key={prod._id}>
                <td>
                  <img
                    src={prod.image.data}
                    style={{ maxHeight: "300px", maxWidth: "300px" }}
                  />
                </td>
                <td>{prod.name}</td>
                <td>{`S/.${prod.price}`}</td>
                <td>{prod.owner}</td>
                <td>
                  <video
                    src={prod.video.data}
                    style={{ maxHeight: "300px", maxWidth: "300px" }}
                    controls
                  >
                    <source type="video/mp4"></source>
                  </video>
                </td>
                <td>
                  <button
                    onClick={props.handleDelete}
                    value={prod._id}
                    className="btn-floating btn-large waves-effect waves-light red"
                  >
                    X
                  </button>
                  <div
                    onClick={props.handleUpdateRedirect}
                    data-id={prod._id}
                    data-name={prod.name}
                    data-price={prod.price}
                    data-image={prod.image.data}
                    data-video={prod.video.data}
                    className="btn-floating btn-large waves-effect waves-light yellow"
                    style={{ fontSize: "30px", fontWeight: "bold",marginLeft:"15px" }}
                  >
                    &#8594;
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ul className="pagination">
        <li className="disabled">
          <a href="#!">
            <i className="material-icons">chevron_left</i>
          </a>
        </li>
        {props.products.map((p, i) =>
          i % 10 === 0 ? (
            <li className="waves-effect" key={p._id}>
              <a
                href="#!"
                onClick={() => {
                  setPaginationStart(i);
                  setPaginationEnd(i + 10);
                }}
                style={{ cursor: "pointer", fontSize: "20px" }}
              >
                {i / 10 + 1}
              </a>
            </li>
          ) : null
        )}
        <li className="waves-effect">
          <a href="#!">
            <i className="material-icons">chevron_right</i>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ProductList;
