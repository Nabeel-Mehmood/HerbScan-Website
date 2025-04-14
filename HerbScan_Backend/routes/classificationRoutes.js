// routes/classificationRoutes.js
const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');
const fs = require('fs');