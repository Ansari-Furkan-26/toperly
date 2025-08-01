import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { urlRouter } from "./routes/url.routes.js";
import { connectDB } from "./db/db.js";
import { globalErrorHandler } from "./utils/globalErrorhandler.js";
import authRoutes from './routes/authRoutes.js';
import instructorRoutes from './routes/instructorRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import enrollRoutes from './routes/enrollRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import quizAttemptRoutes from './routes/quizAttemptRoutes.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadBufferToIPFS } from "./utils/uploadToIPFS.js";

// Load environment variables
dotenv.config({ path: "./.env" });

// Validate critical environment variables
const requiredEnvVars = ["MONGO_URI", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/temp', express.static(path.join(__dirname, 'public/temp')));
const allowedOrigins = [
  'http://localhost:8080',
  'https://toperly-unsquare-dashboard.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "20mb" }));
app.use(urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Middleware to validate AccessKey
const validateAccessKey = (req, res, next) => {
  const accessKey = req.headers['accesskey'];
  if (accessKey !== '249dd0e1-444c-432f-91e55d5ef213-b7bd-49e3') {
    return res.status(401).json({ error: 'Invalid AccessKey' });
  }
  next();
};

// Function to fetch live data from Bunny Storage API
const fetchBunnyStorageData = () => {
  return new Promise((resolve, reject) => {
    const storageZoneName = 'unsquare-toperly'; // Replace with your storage zone name
    const accessKey = '249dd0e1-444c-432f-91e55d5ef213-b7bd-49e3'; // Match with validateAccessKey
    const path = 'images'; // Folder path
    const url = `https://storage.bunnycdn.com/${storageZoneName}/${path}/`;

    https.get(url, {
      headers: {
        AccessKey: accessKey,
        accept: 'application/json'
      }
    }, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(new Error(`Parsing error: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Request error: ${error.message}`));
    });
  });
};

// GET endpoint
app.get('/unsquare-toperly/images', validateAccessKey, async (req, res) => {
  try {
    const imagesData = await fetchBunnyStorageData();
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Images retrieved successfully', data: imagesData });
  } catch (error) {
    console.error('Bunny Storage fetch error:', error.message); // Log error for debugging
    res.status(500).json({ error: 'Failed to fetch data from Bunny Storage' });
  }
});

// Routes
app.use("/api/url", urlRouter);
app.use("/api/auth", authRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/enroll', enrollRoutes); 
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/quiz-attempts', quizAttemptRoutes);

// Error Handler
app.use(globalErrorHandler);

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();