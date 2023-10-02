import style from './ServiceResults.module.css';
import { TranslationResult } from '../../App';

const logos = {
  'deepl': 'https://cdn.worldvectorlogo.com/logos/deepl-1.svg',
  'python': 'https://cdn.worldvectorlogo.com/logos/python-5.svg',
  'javascript': 'https://cdn.worldvectorlogo.com/logos/logo-javascript.svg',
  'typescript': 'https://cdn.worldvectorlogo.com/logos/typescript.svg',
};
// type DetectionServices = 'langid' |
//   'langdetect' |
//   'chardet' |
//   'franc' |
//   'fasttext' |
//   'deepl';
type ServiceResultCardProps = {
  serviceResult: TranslationResult;
  serviceName: string;
  matchesDeepl?: boolean;
};
export default function ServiceResultCard({ serviceResult, serviceName, matchesDeepl }: ServiceResultCardProps) {
  const isDeepl = serviceName === 'deepl';
  const { confidence, detectedLang, language: programmingLang, processingTimeMs } = serviceResult;
  const detectionClasses = matchesDeepl
    ? style.successDetectionCard
    : style.failedDetectionCard;
  return (
    <div className={isDeepl ? style.serviceResultsCard : `${style.serviceResultsCard} ${detectionClasses}`}>
      <img src={logos[serviceName as keyof typeof logos] || logos[programmingLang]} alt="Service or Programming language name" className={style.logo} />
      <span>{serviceName}</span>
      <span>{detectedLang}</span>
      <span>{confidence?.toFixed(4) || 'not available'}</span>
      <span>{processingTimeMs.toFixed(4)}</span>
      <span>{programmingLang}</span>
      {!isDeepl && <span>{matchesDeepl ? '✅ Matches' : '❌ incorrect'}</span>}
    </div>
  );
}
