const express = require('express')
const PublicController =  require("./controllers/public-controller");
const cors = require("cors");  // Import the cors middleware

const app = express();
const PORT = 3000;
// Enable CORS for requests from http://localhost:3001
app.use(cors({ origin: "http://localhost:3001" }));
// Routes with dynamic folder name
app.post("/upload/:foldername", PublicController.store);
app.get("/view/:foldername/:id", PublicController.viewImage);
app.get("/delete-image/:foldername/:id", PublicController.deleteImage);
app.get("/", (req,res) => {
    res.send('hello')
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
