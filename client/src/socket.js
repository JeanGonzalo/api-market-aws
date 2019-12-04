// api/index.js
import openSocket from "socket.io-client";
import { BASE_URL } from "./urls";
//const BASE_URL =  "https://apimarket2023.herokuapp.com"
const socket = openSocket(BASE_URL);

function listen(cb1, cb2, cb3) {
  // listen for any messages coming through
  // of type 'chat' and then trigger the
  // callback function with said message

  socket.on("showMessage", message => {
    // console.log the message for posterity
    console.log(message);
    // trigger the callback passed in when
    // our App component calls connect
    cb1(message);
  });
  socket.on("user", user => {
    // console.log the user for posterity
    console.log(user);
    // trigger the callback passed in when
    // our App component calls connect
    cb2(user);
  });
  socket.on("userDisconnected", user => {
    // console.log the user for posterity
    console.log(user);
    // trigger the callback passed in when
    // our App component calls connect
    cb3(user);
  });
}

function disconnect() {
  socket.disconnect();
}

function connect(user) {
  socket.emit("userLogged", user);
  socket.connect();
}

function sendMessage(message) {
  socket.emit("newMessage", message);
}

export { listen, connect, sendMessage, disconnect };
