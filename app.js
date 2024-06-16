import express from "express";
const app = express();
const PORT = 5000;
import mongoose from "mongoose";
import { router } from "./routes/routes.js";
import { configureMiddleware } from "./middleware/configureMiddleware.js";
import formidable from "express-formidable";
// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:80"], // Whitelist the domains you want to allow
};

configureMiddleware(app);

//Starting server And Connecting to DB
mongoose
  .connect("mongodb+srv://shubham:xyzshubham@cluster0.5rx8bqa.mongodb.net/", {
    dbName: "landingpage2",
  })
  .then(
    app.listen(PORT, () => {
      console.log("Server Started AT PORT : " + PORT);
    })
  )
  .catch((err) => {
    console.log(err);
  });

//Router MiddleWare
app.use("/api", router);
