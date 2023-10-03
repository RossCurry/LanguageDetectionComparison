import { Request, Response, NextFunction } from "express";
import getAggregationResultsFromDB from "../db/getAggregation.js";
import { AggregateResult, AggregateQuery } from "../utils/shared-types.js";

export default async function queryAggregationDB(_req: Request, res: Response<AggregateQuery | undefined>, _next: NextFunction){
  try {
    const aggregationResults = await getAggregationResultsFromDB()
    res.status(200)
    res.send(aggregationResults)
  } catch (error) {
    res.status(500)
    console.warn('Something went wrong during the aggregation request.')
    throw error
  }
}