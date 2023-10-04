import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
import { PythonServiceResults } from '../../utils/shared-types.js';
dotenv.config()

export default async function getPythonServices(req: Request, res: Response, next: NextFunction) {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  try {
    console.info('process.env.PYTHON_API', process.env.PYTHON_API)
    const baseUrl = process.env.PYTHON_API;
    if (!baseUrl) throw new Error('No PYTHON_API url found. Check ENV variables')
    const url = new URL(baseUrl);
    url.pathname = 'detect';
    url.searchParams.set('text', text);
    const pyhtonResults = await fetch(url.toString(), {
      headers: {
        'Content-type': 'application/json'
      }
    });
    const fromJson = await pyhtonResults.json();
    const parsedJSON = JSON.parse(JSON.stringify(fromJson))
    console.log('parsedJSON', parsedJSON)
    req.body.pyhtonResults = parsedJSON as PythonServiceResults;
  } catch (error) {
    console.error('Error setting python results in req.body', error);
    throw error;
  }
  console.log('req.body', req.body)
  next();
}
  