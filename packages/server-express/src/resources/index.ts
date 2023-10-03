import express from 'express';
import bodyParser from 'body-parser'
export const router = express.Router();
import getPythonServices from './getPythonServices.js';
import getJsServices from './getJsServices.js';
import checkResults from './checkResults.js';
import queryAggregationDB from './queryAggregationDB.js';

router.use(bodyParser.json())

router.post(
  '/detect', 
  checkResults, 
  getPythonServices, 
  getJsServices
);

router.get(
  '/aggregate', 
  queryAggregationDB
)
