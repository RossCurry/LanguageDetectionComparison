import getAggregationResultsFromDB from "../db/getAggregation.js";
export default async function queryAggregationDB(_req, res, _next) {
    try {
        const aggregationResults = await getAggregationResultsFromDB();
        res.status(200);
        res.send(aggregationResults);
    }
    catch (error) {
        res.status(500);
        console.warn('Something went wrong during the aggregation request.');
        throw error;
    }
}
