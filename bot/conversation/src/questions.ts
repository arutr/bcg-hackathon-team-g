import { FormQuestion } from "./model/formQuestion";

export default class Questions {
  private _questions: FormQuestion[];

  get questions(): FormQuestion[] {
    return this._questions;
  }

  constructor() {
    this._questions = [
      {
        shortName: ":c",
        name: "cats",
        link: "https://media.giphy.com/media/Ov5NiLVXT8JEc/giphy.gif",
        num: 0,
      },
      {
        shortName: ":d",
        name: "dogs",
        link: "https://media.giphy.com/media/Pn1gZzAY38kbm/giphy.gif",
        num: 1,
      },
      {
        shortName: ":s",
        name: "sea",
        link: "https://media.giphy.com/media/XrDT8BuYB3I2s/giphy.gif",
        num: 2,
      },
      {
        shortName: ":m",
        name: "mountains",
        link: "https://media.giphy.com/media/3o84sypMl9QoaJIzdu/giphy.gif",
        num: 3,
      },
      {
        shortName: ":scr",
        name: "soccer",
        link: "https://media.giphy.com/media/pdAiipxDMCHni/giphy.gif",
        num: 4,
      },
      {
        shortName: ":b",
        name: "basketball",
        link: "https://media.giphy.com/media/l0OWiMGpoC6apZFXG/giphy.gif",
        num: 5,
      },
      {
        shortName: ":smr",
        name: "summer",
        link: "https://media.giphy.com/media/h4xnkRqS0lt6EhcFLA/giphy.gif",
        num: 6,
      },
      {
        shortName: ":w",
        name: "winter",
        link: "https://media.giphy.com/media/hbrCfxHxOhiZW/giphy.gif",
        num: 7,
      },
      {
        shortName: ":p",
        name: "pizza",
        link: "https://media.giphy.com/media/jn2iXu2HRpMuovBrrV/giphy.gif",
        num: 8,
      },
      {
        shortName: ":brgr",
        name: "burger",
        link: "https://media.giphy.com/media/xTiTnwj1LUAw0RAfiU/giphy.gif",
        num: 9,
      },
    ];
  }

  public getCurrentQuestion(curr: number): FormQuestion | undefined {
    let currFormQuestion: FormQuestion = {
      name: "example",
      link: "exampleLink",
      num: -1,
    };
    for (let i = 0; i < this._questions.length; i++) {
      if (this._questions[i].num === curr) {
        currFormQuestion = this._questions[i];
        break;
      }
    }
    return currFormQuestion ? currFormQuestion : undefined;
  }
}
