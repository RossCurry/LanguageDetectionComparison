import express from 'express';
export const router = express.Router();
import bodyParser from 'body-parser'
import queryAggregationDB from './mw/queryAggregationDB.js';
import logRequest from './mw/logRequest.js';
import checkDbForQuery from './mw/checkDbForQuery.js';
import getJsServices from './mw/getJsServices.js';
import getPythonServices from './mw/getPythonServices.js';
import updateDbNewService from './mw/updateDbNewService.js';
import compareData from './mw/compareData.js';

router.use(bodyParser.json())

router.post(
  '/detect',
  logRequest,
  checkDbForQuery,
  getPythonServices,
  getJsServices
);

router.post(
  '/just-js-services',
  logRequest,
  getJsServices
);

// needs to be modified to cater for new services by name
router.post('/updateDB',
  logRequest,
  updateDbNewService
)

router.post('/compare',
  logRequest,
  compareData
)

router.get(
  '/aggregate',
  logRequest,
  queryAggregationDB
)

