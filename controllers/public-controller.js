const multer = require("multer");
const fs = require("fs");
const path = require("path");

const BASE_PATH = "/uploads/";

class PublicController {
  // Save image with dynamic folder name
  async store(req, res) {
    try {
      const { foldername } = req.params;

      if (!foldername) {
        return res
          .status(400)
          .json({ message: "Folder name is required" });
      }

      let fileName = "";
      const uploadDirectory = path.join(process.cwd(), BASE_PATH, foldername);

      // Ensure the dynamic folder exists
      fs.mkdirSync(uploadDirectory, { recursive: true });

      const storage = multer.diskStorage({
        destination: function (_, __, callback) {
          callback(null, uploadDirectory);
        },
        filename: (_, file, callback) => {
          fileName = file.originalname;
          callback(null, fileName);
        },
      });
      const upload = multer({ storage }).single("file");

      upload(req, res, async (err) => {
        if (err) {
          return res.status(500).json({
            message: "Error saving photo",
            data: JSON.stringify(err),
          });
        }
        res
          .status(200)
          .json({ message: "Image saved successfully", data: fileName });
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error saving image", data: JSON.stringify(error) });
    }
  }

  // View image
  async viewImage(req, res) {
    const { foldername, id: fileName } = req.params;
    const filePath = path.join(process.cwd(), BASE_PATH, foldername, fileName);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  }

  // Delete image
  async deleteImage(req, res) {
    const { foldername, id: fileName } = req.params;
    // Check if foldername and fileName are valid
    if (!foldername || !fileName) {
      return res
        .status(400)
        .json({ message: "Invalid foldername or fileName" });
    }
    const filePath = path.join(process.cwd(), BASE_PATH, foldername, fileName);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json({ message: "Image deleted successfully" });
      } else {
        res.status(404).json({ message: filePath });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting image", data: JSON.stringify(error) });
    }
  }
}

module.exports = new PublicController();
