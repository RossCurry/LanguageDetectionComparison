import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
import { TranslationResult } from '../../utils/shared-types.js';
dotenv.config()

export default async function getPythonServices(req: Request, res: Response, next: NextFunction) {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  try {
    console.info('process.env.PYTHON_API', )
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
    const asJson = await pyhtonResults.json();
    console.log('asJson', JSON.parse(JSON.stringify(asJson)))
    req.body = asJson;
  } catch (error) {
    console.error(error);
    throw error;
  }
  next();
}
  