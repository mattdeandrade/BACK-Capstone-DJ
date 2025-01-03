// Express
const express = require("express");
// For handling audio file uploads
// multer: Middleware for handling multipart/form-data, which is commonly used for file uploads.
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure `multer` for handling MP3 uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./mp3"; // Directory to store MP3 files
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, uploadDir); // Save files in the specified directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with the original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File upload function
const audiofileUpload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter: (req, file, cb) => {
    // Regular expression to validate MP3 files by MIME type
    const fileTypes = /audio\/mpeg/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const filetype = [".mp3", ".wav", ".mpeg", ".mp4", ".flac", ".wma", ".aac"];
    if (filetype) {
      return cb(null, true); // Accept the file if valid
    } else {
      cb(new Error("Only MP3 files are allowed!"));
    }
  },
});

module.exports = { audiofileUpload };
