import express from 'express';
export const router = express.Router();
import bodyParser from 'body-parser'
import queryAggregationDB from './mw/queryAggregationDB.js';
import logRequest from './mw/logRequest.js';
import checkResults from './mw/checkResults.js';
import getJsServices from './mw/getJsServices.js';
import getPythonServices from './mw/getPythonServices.js';

router.use(bodyParser.json())

router.post(
  '/detect',
  logRequest,
  checkResults,
  getPythonServices,
  getJsServices
);


router.get(
  '/aggregate',
  logRequest,
  queryAggregationDB
)

