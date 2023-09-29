import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import  http from "http"
import { router } from './resources/index.js';

// Configure env variables
import dotenv from 'dotenv'
dotenv.config()

const corsOptions =  {
  // TODO use correct prod URL
  origin: process.env.PROD === "true" ? 'https://sh-webhook-tester.netlify.app' : "*",
  methods: ["GET", "POST"]
}

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(router);

const PORT = process.env.PORT || 3000; 

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});