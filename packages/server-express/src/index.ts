import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import  http from "http"
import { router } from './resources/index.js';
import fetch from 'node-fetch';

// Configure env variables
import dotenv from 'dotenv'
import { PythonServiceResults } from './utils/shared-types.js';
import { callJavascriptServices } from './resources/mw/getJsServices.js';
import { insertOneQueryResult } from './db/addResult.js';
import { testData } from './data-model/testData.js';
import { findOneQueryResult } from './db/findQuery.js';
import { positveComments } from './data-model/positiveComments.js';
import { negativeComments } from './data-model/negativeComments.js';
dotenv.config()

const corsOptions =  {
  origin: process.env.PROD === "true" ? process.env.CLIENT_URL : "*",
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



