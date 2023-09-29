declare module 'fasttext-lid' {
  export default class LID {
    constructor(option?: { model: string })
    predict: (text: string ,k?: number) => Promise<[{ lang: string, prob: number}]>
  }
}

