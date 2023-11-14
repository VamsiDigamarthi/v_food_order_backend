import express from "express";
// import path from 'path';
import { config } from "dotenv";

import { createServer } from "http";
import { Server } from "socket.io";
import { socketOrderDelivery } from "./Sockets/SocketOrderDelivery.js";

import routeAuth from "./Router/Auth.router.js";
import routerUser from "./Router/User.routes.js";
import routerProduct from "./Router/Product.routes.js";
import routerCategory from "./Router/Category.routes.js";
import routerOrder from "./Router/Order.routes.js";

config();

const app = express();

// CONFIG SOCKET
const httpServer = createServer(app);
const io = new Server(httpServer);
socketOrderDelivery(io);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routeAuth);
app.use("/api", routerUser);
app.use("/api", routerProduct);
app.use("/api", routerCategory);
app.use("/api", routerOrder);

// app.use( express.static( path.join( __dirname, 'Uploads/Profile' )));
// app.use( express.static( path.join( __dirname, 'Uploads/Products' )));

httpServer.listen(process.env.APP_PORT, () =>
  console.log("Server listen on  " + process.env.APP_PORT)
);
