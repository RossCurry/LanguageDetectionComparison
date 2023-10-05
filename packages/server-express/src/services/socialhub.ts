import chardet from 'chardet';
import { Buffer } from 'node:buffer';
import { parseHrTime } from './deepl.js';
import { TranslationResult } from '../utils/shared-types.js';
import fetch from 'node-fetch'

type SocialHubResponse = {
  language: string
}
export default async function detectSocialHub(text:string): Promise<TranslationResult> {
  const socialHubUrl = process.env.SOCIALHUB_URL
  const socialHubAuth = process.env.SOCIALHUB_AUTH
  if (!socialHubUrl || !socialHubAuth) throw new Error('Missing socialHubUrl or socialHubAuth environment variables')
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': socialHubAuth,
  }
  let result;
  let timeDiff;
  try {
    console.log('socialHubAuth', socialHubAuth)
    console.log('socialHubUrl', socialHubUrl)
    const startTime = process.hrtime()
    result = await fetch(
      socialHubUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ input_string: text })
      }
    )
    timeDiff = process.hrtime(startTime)
    result = await result.json() as SocialHubResponse
  } catch (error) {
    console.error(`Error fetch from social hub. url: ${socialHubUrl}`)
  }
  console.log('result', result)
  if (!result || !('language' in result) || typeof result.language !== 'string') throw new Error('SocialHub service returned no results')
  if (!timeDiff) throw new Error('timeDiff is undefined. Something went wrong calculating the timeDiff for socialhub service')
  return {
    confidence: null,
    detectedLang: result.language,
    originalText: text,
    processingTimeMs: parseHrTime(timeDiff),
    language: 'typescript'
  }
}