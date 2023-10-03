import { connectDb, dbDetectionServices, client, resultsCollection } from './connect.js';
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
];
export default async function getAggregationResultsFromDB() {
    try {
        await connectDb();
        const resultsCol = await client.db(dbDetectionServices).collection(resultsCollection);
        console.info(`Connect to 'results' collection in '${dbDetectionServices}'`);
        const totalDocuments = await resultsCol.countDocuments();
        const aggregateResults = await resultsCol.aggregate(aggregateQuery).toArray();
        if (!aggregateResults)
            return;
        console.info(`Success. AggregateResults length: ${JSON.stringify(aggregateResults.length)}'`);
        const withAvgMatchesDeepL = aggregateResults.map(res => {
            res.avgMatchesDeepL = (res.trueCount / totalDocuments) * 100;
            return res;
        });
        return { aggregateResults: withAvgMatchesDeepL, totalDocuments };
    }
    catch (error) {
        console.error('Error gettin AggregateResults from DB', error);
    }
    finally {
        await client.close();
        console.info(`Closing connection db 🛬: ${dbDetectionServices}`);
    }
}
