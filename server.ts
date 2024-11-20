import express, { request, response } from "express";
import cors from "cors";
import dotEnv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./router/userRouter";
import eventRouter from "./router/eventRouter";

const app: express.Application = express();

// cors
app.use(cors());

// configure express to receive form data
app.use(express.json());

// configure dotEnv
dotEnv.config({ path: "./.env" });

const hostName: string | undefined = process.env.HOST_NAME;
const port: string | undefined = process.env.PORT;

// connect to mongoDB
let dbURL: string | undefined = process.env.MONGO_DB_LOCAL;
if (dbURL) {
  mongoose
    .connect(dbURL)
    .then((response) => {
      console.log("Connected to MongoDB Successfully....");
    })
    .catch((error) => {
      console.error(error);
      process.exit(1); // stops the mode js process.
    });
}

app.get("/", (request: express.Request, response: express.Response) => {
  response
    .status(200)
    .send(
      `<h3 style=font-family: Lato,sans-serif; color:black>Welcome to Events Now Booking Application Backend</h3>`
    );
});

// router configuration
app.use("/users", userRouter);
app.use("/events", eventRouter);

if (port && hostName) {
  app.listen(Number(port), hostName, () => {
    console.log(`express server is started at http://${hostName}:${port}`);
  });
}
