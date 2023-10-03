import { useState } from 'react';
import style from './SearchInput.module.css';
import { ApiDetectionResults } from '../../App';

type SearchInputProps = {
  setDetectionResults: React.Dispatch<React.SetStateAction<ApiDetectionResults | null>>;
  setShowAggregation: React.Dispatch<React.SetStateAction<boolean>>,
  buttonText: 'detect'|'show table'
};
export default function SearchInput ({ setDetectionResults, setShowAggregation, buttonText }: SearchInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAggregation(false)
    const expressBaseurl = 'http://localhost:3000';
    const url = new URL(expressBaseurl);
    url.pathname = 'detect';
    url.searchParams.set('text', input);
    let result;
    try {
      result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        }
      });
    } catch (error) {
      console.error(error);
    }
    const asJson: ApiDetectionResults = await result?.json();
    setDetectionResults(asJson);
    console.log(asJson);
    asJson.servicesSorted.forEach(([serviceName, serviceResult]) => {
      console.log(serviceName);
      console.table(serviceResult);
    });
  };

  return (
    <>
      <form onSubmit={buttonText === "detect" ? handleSubmit : () => setShowAggregation(true)} className={style.searhInputContainer}>
        <input
          type="text"
          name="searchTerm"
          id="searchTerm"
          placeholder='Type word or phrase to detect'
          value={input}
          onChange={(e) => setInput(e.target.value)} />
        <button type="submit">{buttonText}</button>
      </form>
    </>
  );
}
