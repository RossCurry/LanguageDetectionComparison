import LID from 'fasttext-lid';
import { parseHrTime } from './deepl.js';
import { TranslationResult } from '../utils/shared-types.js';
import path from 'node:path';
import fetch from 'node-fetch';
import url from 'url';
import fsSync from 'node:fs'
import fs from 'node:fs/promises'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
let modelHasDownloaded = false
console.log('__dirname', __dirname)
const modelDir = path.resolve(__dirname, 'data-model')
const modelPath = path.resolve(modelDir, 'fasttext-model.bin')

async function writeModelToDisk() {
  await fs.mkdir(modelDir, { recursive: true })
  console.log('path exists', fsSync.existsSync(modelDir))
  const modelUrl = 'https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.bin'
  const res = await fetch(modelUrl);
  await new Promise((resolve, reject) => {
    if (!res.body) throw new Error(`No response from fetch call to fasttext model. Url: ${modelUrl}`);
    const fileStream = fsSync.createWriteStream(modelPath);
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
    modelHasDownloaded = true
  });
  checkFileExists(modelPath)
}
writeModelToDisk()

export default async function detectFasttext(text:string): Promise<TranslationResult> {
  console.log('modelHasDownloaded', modelHasDownloaded)
  if (!modelHasDownloaded) throw  new Error('Model has not yet been written to disk')
  let result;
  let timeDiff;
  try {
    const lid = new LID({ model: modelPath });
    const startTime = process.hrtime()
    result = await lid.predict(text);
    timeDiff = process.hrtime(startTime)
  } catch (error) {
    console.error('Error detecting fasttext', error);
    throw error;
  }
  if (!result || !Array.isArray(result) || !result.length) throw new Error('Fasttext service returned no resuls')
  const [detectedResult] = result
  return {
    confidence: detectedResult.prob,
    detectedLang: detectedResult.lang,
    originalText: text,
    processingTimeMs: parseHrTime(timeDiff),
    language: 'javascript'
  }
}

async function checkFileExists(filePath: string) {
  try {
    await fs.access(filePath);
    console.log('File exists.');
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      console.log('File does not exist.');
    } else {
      console.error('Error occurred while checking file existence:', error);
    }
  }
}
