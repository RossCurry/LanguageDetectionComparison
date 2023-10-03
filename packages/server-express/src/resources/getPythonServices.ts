import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

export default async (req: Request, res: Response, next: NextFunction) => {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  try {
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
    req.body = asJson;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    next();
  }
}
  