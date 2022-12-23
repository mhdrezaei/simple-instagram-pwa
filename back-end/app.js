const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload")
const path = require("path")
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const cors = require("cors");
const databaseConnection = require("./config/databaseConnection");
const jobs = require("./routes/jobs");
const errorMiddleware = require("./middlewares/errors");
const { response } = require("express");

app.use(
  fileupload({
      createParentPath: true,
  }),
);

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT;

databaseConnection();
// add json body parser
app.use(express.json());

// all routes
app.use("/api/v1/", jobs);
app.use(express.static('uploads')); 
app.use('/uploads', express.static('uploads'));
 
app.use(errorMiddleware);



//upload img 
app.post("/upload-file", async (req, res) => {
  try {
      if (!req.files) {
          res.send({
              status: "failed",
              message: "No file uploaded",
          });
      } else {
          let file = req.files.file;

          console.log(req.files);

          file.mv("./uploads/" + file.name);

          res.send({
              status: "success",
              message: "File is uploaded",
              img : `http://localhost:5000/uploads/${file.name}`,
              data: {
                  name: file.name,
                  mimetype: file.mimetype,
                  size: file.size,
              },
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
});




const server = app.listen(PORT, () => {
  console.log("server is running");
});

// handeling unhandled promise rection

process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("shutting down the server due to handle promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
