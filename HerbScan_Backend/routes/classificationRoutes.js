// routes/classificationRoutes.js
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads/classification directory exists
const classificationDir = path.join(__dirname, '../uploads/classification');
if (!fs.existsSync(classificationDir)) {
  fs.mkdirSync(classificationDir, { recursive: true });
}

// Configure multer storage for classification uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, classificationDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/classify', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const pythonScript = path.join(__dirname, '../classification/classify.py');
  const filePath = req.file.path;

  // Spawn the python process running the classifier
  const pythonProcess = spawn('python', [pythonScript, filePath]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    // Delete the uploaded file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // Extract valid JSON using regex – match from first { to the last }
    const jsonMatch = output.match(/{[\s\S]*}/);
    if (jsonMatch) {
      output = jsonMatch[0];
    } else {
      output = "";
    }
    
    try {
      const result = JSON.parse(output);
      if (result.error) {
        return res.status(500).json({ error: result.error });
      }
      return res.json(result);
    } catch (error) {
      console.error("Error parsing Python output:", error);
      return res.status(500).json({ error: "Error during classification" });
    }
  });
});

module.exports = router;
