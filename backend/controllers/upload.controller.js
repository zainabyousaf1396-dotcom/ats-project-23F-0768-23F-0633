// Resume upload controller
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // upload buffer to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "uploads" },
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json({ url: result.secure_url });
      }
    );

    // send buffer
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};