import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./db/connectToDB.js";
import { router } from "./router/routes.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
connectToDB()
    .then(() => {
    app.use("/api", router);
    app.get("/", (req, res) => {
        res.send({ status: "Successfully connected" });
    });
    app.listen(port, () => console.log(`The server is running on ${port} port`));
})
    .catch((error) => {
    console.log("MongoDB Error Found.", error.message);
});
