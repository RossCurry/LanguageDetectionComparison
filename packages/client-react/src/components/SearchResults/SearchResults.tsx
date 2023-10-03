import ServiceResultCard from '../ServiceResultCard/ServiceResultCard';
import { ApiDetectionResults } from '../../App';

type SearchResultsProps = {
  detectionResults: ApiDetectionResults | null;
};
export function SearchResults({ detectionResults }: SearchResultsProps) {

  const deeplResults = detectionResults?.servicesSorted.filter(([serviceName]) => serviceName === "deepl");
  const otherResults = detectionResults?.servicesSorted.filter(([serviceName]) => serviceName !== "deepl");

  return (
    <>
      {/* Deelp Should always be on top */}
      {deeplResults
        ? deeplResults.map(([serviceName, serviceResults], i) => {
          return (
            <ServiceResultCard
              key={serviceName + i}
              serviceResult={serviceResults}
              serviceName={serviceName}
              matchesDeepl={true} />
          );
        })
        : null}
      {otherResults ? otherResults.map(([serviceName, serviceResults], i) => {
        const matchesDeepl = deeplResults?.length ? deeplResults[0][1].detectedLang === serviceResults.detectedLang : false;
        return (
          <ServiceResultCard
            key={serviceName + i}
            serviceResult={serviceResults}
            serviceName={serviceName}
            // matchesDeepl={!detectionResults?.failedServices.includes(serviceName)} // not correct
            matchesDeepl={matchesDeepl} />
        );
      }) : null }
    </>
  );
}
