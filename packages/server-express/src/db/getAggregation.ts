import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js'
import { AggregateQuery, AggregateResult } from '../utils/shared-types.js'

/**
 * Gets sum of deepl matches
 * Gets avg of processing time
 */
const aggregateQuery = [
  // maps object to array
  {
    $project: {
      serviceKeys: {
        $map: {
          input: {
            $objectToArray: "$serviceResults",
          },
          as: "item",
          in: "$$item",
        },
      },
    },
  },
  // unwinds each array item
  {
    $unwind: "$serviceKeys",
  },
  // groups by service name, 
  // then sums matchesDeepL true/false, 
  // as well as finds avg for processing time
  {
    $group: {
      _id: "$serviceKeys.k",
      trueCount: {
        $sum: {
          $cond: { if: { $eq: ["$serviceKeys.v.matchesDeepL", true] }, then: 1, else: 0 }
        }
      },
      falseCount: {
        $sum: {
          $cond: { if: { $eq: ["$serviceKeys.v.matchesDeepL", false] }, then: 1, else: 0 }
        }
      },
      avgProcessingTimeMs: {
        $avg: "$serviceKeys.v.processingTimeMs",
      },
    },
  },
]

export default async function getAggregationResultsFromDB(): Promise<AggregateQuery | undefined> {
  try {
    await connectDb()
    const resultsCol = await client.db(dbDetectionServices).collection(resultsCollection)
    console.info(`Connect to 'results' collection in '${dbDetectionServices}'`)
    const totalDocuments = await resultsCol.countDocuments();
    const aggregateResults = await resultsCol.aggregate<AggregateResult>(aggregateQuery).toArray()
    if (!aggregateResults) return
    console.info(`Success. AggregateResults length: ${JSON.stringify(aggregateResults.length)}'`)
    const withAvgMatchesDeepL = aggregateResults.map(res => {
      res.avgMatchesDeepL = (res.trueCount / totalDocuments) * 100
      return res
    })
    const [deepL] = withAvgMatchesDeepL.filter( res => res._id === "deepl")
    const theRest = withAvgMatchesDeepL.filter( res => res._id !== "deepl").sort((a,b) => a._id.charCodeAt(0) - b._id.charCodeAt(0))
    return { aggregateResults: [ deepL, ...theRest ], totalDocuments }
  } catch (error) {
    console.error('Error getting AggregateResults from DB', error)
  } finally {
    await client.close()
    console.info(`Closing connection db 🛬: ${dbDetectionServices}`)
  }
}