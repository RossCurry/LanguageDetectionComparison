import { Request, Response, NextFunction } from "express";
import { AggregateQuery } from "../../utils/shared-types.js";
import getAggregationResultsFromDB from "../../db/getAggregation.js";

export default async function queryAggregationDB(req: Request, res: Response<AggregateQuery | undefined>, _next: NextFunction){
  let { collection } = req.query
  collection = collection && typeof collection === 'string' ? collection : undefined; 
  try {
    const aggregationResults = await getAggregationResultsFromDB(collection)
    res.status(200)
    res.send(aggregationResults)
  } catch (error) {
    res.status(500)
    console.warn('Something went wrong during the aggregation request.')
    throw error
  }
}