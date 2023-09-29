import express from 'express';
import bodyParser from 'body-parser';
export const router = express.Router();
import getPythonServices from './getPythonServices.js';
import getJsServices from './getJsServices.js';
router.use(bodyParser.json());
router.post('/detect', getPythonServices, getJsServices);
