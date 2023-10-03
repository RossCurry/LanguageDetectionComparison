import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()

export default async function getPythonServices(req: Request, res: Response, next: NextFunction) {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  try {
    // const baseUrl = process.env.PYTHON_API;
    console.info('process.env.PYTHON_API', process.env.PYTHON_API)
    const baseUrl = "https://languagedetectionexpress.onrender.com"; // weird error hard coding
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
    req.body = asJson;
  } catch (error) {
    console.error(error);
    throw error;
  }
  next();
}
  