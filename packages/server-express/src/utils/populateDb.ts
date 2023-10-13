import { negativeComments } from "../data-model/negativeComments.js"
import { positveComments } from "../data-model/positiveComments.js"
import { insertOneQueryResult } from "../db/addResult.js"
import { findOneQueryResult } from "../db/findQuery.js"
import { callJavascriptServices } from "../resources/mw/getJsServices.js"
import { PythonServiceResults } from "./shared-types.js"

// const populateDbMany = async () => {
//   // small talk
//   // const data = testData.map(d => {
//   //   return d.phrases
//   // })
//   // const flattenedData = data.flat(1)
//   // for (const phrase of flattenedData){
//   //   const possibleResults = await findOneQueryResult(phrase)
//   //   if (possibleResults) continue
//   //   await populateDbOne(phrase)
//   // }
//   // positive comments
//   const positive = positveComments.flat(1)
//   const negative = negativeComments.flat(1)
//   for (const phrase of positive){
//     const possibleResults = await findOneQueryResult(phrase)
//     if (possibleResults) continue
//     await populateDbOne(phrase)
//   }
//   for (const phrase of negative){
//     const possibleResults = await findOneQueryResult(phrase)
//     if (possibleResults) continue
//     await populateDbOne(phrase)
//   }
// }
// const populateDbOne = async (text: string) => {
//   const pythonServices: PythonServiceResults = await callPython(text)
//   const jsServices = await callJS(text)
//   const allServices = { ...pythonServices, ...jsServices };
//   // addMatches deepL for DB & FE
//   const deeplDetectedLang = allServices["deepl"]?.detectedLang;
//   for (const [name, result] of Object.entries(allServices)) {
//     const matchesDeepL = result?.detectedLang === deeplDetectedLang;
//     if (result) result.matchesDeepL = matchesDeepL;
//   }
//   // Send results to a DB
//   await insertOneQueryResult(text, allServices);
// }

// async function callJS(text:string) {
//   if (!text || typeof text !== "string") throw new Error('Missing text query from params');
//   // TODO missing assertion on body
//   const jsServices = await callJavascriptServices(text);
//   // const noNullValues = Object.values(jsServices).every(result => result !== null);
//   return jsServices
// }

// async function callPython(text:string) {
//   if (!text || typeof text !== "string") throw new Error('Missing text query from params');
//   try {
//     console.info('process.env.PYTHON_API', process.env.PYTHON_API)
//     const baseUrl = process.env.PYTHON_API;
//     if (!baseUrl) throw new Error('No PYTHON_API url found. Check ENV variables')
//     const url = new URL(baseUrl);
//     url.pathname = 'detect';
//     url.searchParams.set('text', text);
//     const pyhtonResults = await fetch(url.toString(), {
//       headers: {
//         'Content-type': 'application/json'
//       }
//     });
//     const fromJson = await pyhtonResults.json();
//     const parsedJSON = JSON.parse(JSON.stringify(fromJson))
//     console.log('parsedJSON', parsedJSON)
//     return parsedJSON as PythonServiceResults;
//   } catch (error) {
//     console.error('Error setting python results in req.body', error);
//     throw error;
//   }
// }

// populateDbMany()