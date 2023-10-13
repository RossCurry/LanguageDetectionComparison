import { useState } from 'react';
import style from './SearchInput.module.css';
import { ApiDetectionResults } from '../../App';

type SearchInputProps = {
  setDetectionResults: React.Dispatch<React.SetStateAction<ApiDetectionResults | null>>;
  setShowAggregationTable: React.Dispatch<React.SetStateAction<boolean>>,
};
export default function SearchInput ({ setDetectionResults, setShowAggregationTable }: SearchInputProps) {
  const [input, setInput] = useState('');
  const [isPristine, setIsPristine] = useState(false);
  const [prevQuerySent, setPrevQuerySent] = useState<string | null>(null);
  const buttonAction = isPristine ? 'show table' : 'detect'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    if (buttonAction === "show table"){
      setShowAggregationTable(true)
      setInput('')
      setIsPristine(false)
      return;
    }
    setShowAggregationTable(false)
    const expressBaseurl = import.meta.env.VITE_API_EXPRESS;
    const url = new URL(expressBaseurl);
    url.pathname = 'detect';
    url.searchParams.set('text', input);
    setPrevQuerySent(input)
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
    setIsPristine(true)
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We handle the input being prestine here.
    const currentInput = e.target.value
    if (prevQuerySent === currentInput) {
      setIsPristine(true)
    } else {
      setIsPristine(false)
    }
    setInput(currentInput)
  }

  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className={style.searhInputContainer}
      >
        <input
          type="text"
          name="searchTerm"
          id="searchTerm"
          placeholder='Type word or phrase to detect'
          value={input}
          onChange={handleOnChange} />
        <button type="submit">{buttonAction}</button>
      </form>
    </>
  );
}
