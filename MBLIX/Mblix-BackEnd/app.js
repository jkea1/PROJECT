import express from "express";
import cors from "cors";
import path from "path";
const __dirname = path.resolve();

import movieRouter from "./routes/movie.js";
import authRouter from "./routes/auth.js"

const app = express();

const corsOptions = {
  // https://github.com/expressjs/cors#configuration-options
  // "origin": "http://localhost:3000", // for development
  "origin": "http://gof.mblix.site",
  "methods": "GET, POST, OPTIONS",
  "optionSuccessStatus": 200,
  "preflightContinue": false,
};

app.get("*", cors(corsOptions));
app.post("*", cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.static(__dirname + '/public')); // absolute path
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get("/", function(req, res, next) {
  res.send("This is Mblix-Backend API, not supporting /");
});
app.use("/movie", movieRouter);
app.use("/auth", authRouter);

app.listen(8081, function() {
  console.log(`Mblix-Backend(express) server is running on 8081`);
});

export default app;