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
    const uploadDir = "../mp3/uploads"; // Directory to store MP3 files
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

const audiofileUpload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /mp3|mpeg/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (extname && mimeType) {
      return cb(null, true); // Accept the file if valid
    } else {
      cb(new Error("Only MP3 files are allowed!"));
    }
  },
});

module.exports = audiofileUpload;
