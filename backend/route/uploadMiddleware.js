const multer = require("multer");
// const path = require("path");

// const upload = multer({
//   dest: "uploads/",
//   limits: {
//     fileSize: 4 * 1024 * 1024,
//   },
// });

let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    console.log("====================================");
    console.log("ASDASDASDA");
    console.log("====================================");
    console.log(file);
    console.log(req);
    console.log(req.file);
    callback(null, "./../uploads");
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage }).single("profileImage");
module.exports = upload;
