const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("node-tesseract-ocr");
const config = {
  lang: "ara",
  oem: 3,
  psm: 12,
};
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + "_" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Create Express Application
const app = express();
// Configration...
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  let context = {
    result: "",
  };

  res.render(path.join(__dirname, "views", "Home.ejs"), context);
});

app.post("/extractText", async (req, res, next) => {
  if (!req.file) {
    return res.redirect("/");
  }
  let imgPath = req.file.path;
  tesseract
    .recognize(imgPath, config)
    .then((text) => {
      let context = {
        result: text,
      };
      res.render(path.join(__dirname, "views", "Home.ejs"), context);
    })
    .catch((error) => {
      console.log("Error :", error.message);
      let context = {
        result: "Unexpected Error :(",
      };
      res.render(path.join(__dirname, "views", "Home.ejs"), context);
    });
});

app.listen(2030, () => {
  console.log("Server started on port 3000");
});
