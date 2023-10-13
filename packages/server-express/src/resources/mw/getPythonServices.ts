import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
import { PythonServiceResults } from '../../utils/shared-types.js';
dotenv.config()

export default async function getPythonServices(req: Request, res: Response, next: NextFunction) {
  const text = req.query.text;
  if (!text || typeof text !== "string") throw new Error('Missing text query from params');
  try {
    const pyhtonResults = await callPythonServices(text)
    req.body.pyhtonResults = pyhtonResults;
  } catch (error) {
    console.error('Error setting python results in req.body', error);
    throw error;
  }
  next();
}

export async function callPythonServices(text: string, sourceLang: string = ''): Promise<PythonServiceResults> {
  const baseUrl = process.env.PYTHON_API;
  if (!baseUrl) throw new Error('No PYTHON_API url found. Check ENV variables')
  const url = new URL(baseUrl);
  url.pathname = 'detect';
  url.searchParams.set('text', text);
  url.searchParams.set('sourceLang', sourceLang);
  console.info('GET ====> to python server', url.toString())
  const pyhtonResults = await fetch(url.toString(), {
    headers: {
      'Content-type': 'application/json'
    }
  });
  if (!pyhtonResults.ok) throw new Error(`Error fetching python services: ${JSON.stringify(pyhtonResults)}`)
  console.info('Python headers:', pyhtonResults.headers)
  let parsedJSON: PythonServiceResults | null = null;
  try {
    const fromJson = await pyhtonResults.json();
    parsedJSON = JSON.parse(JSON.stringify(fromJson))
  } catch (error) {
    console.error('Error parsing python json from response', error);
  }
  if (!parsedJSON) throw new Error('No response from \'callPythonServices\'')
  assertIsPythonResults(parsedJSON)
  return parsedJSON
}

function assertIsPythonResults(parsedJSON: unknown): asserts parsedJSON is PythonServiceResults {
  if (!(parsedJSON && typeof parsedJSON === 'object' && 'langid' in parsedJSON && 'langdetect' in parsedJSON))
    throw new Error('Assertion error: \'assertIsPythonResults\'');
}
