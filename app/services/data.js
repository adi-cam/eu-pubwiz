import Service from '@ember/service';
import fetch from 'fetch';

export default class extends Service {
  questions = [];

  async load() {
    // load questions
    const res = await fetch('/eu-pubwiz/questions.json');
    const rawQuestions = await res.json();

    // remove title question
    // rawQuestions.shift();

    // reformat questions
    let questions = [];
    for (let question of rawQuestions) {
      if (question['QN']) {
        // add question
        questions.push({
          num: question['QN'],
          topic: question['Topic'],
          title: question['Questions'],
          desc: question['Description'] || null,
          condition: question['Condition'] || null,
          options: [
            {
              letter: question['OL'],
              title: question['Options'],
            },
          ],
        });
      } else {
        // add option
        questions.slice(-1)[0].options.push({
          letter: question['OL'],
          title: question['Options'],
        });
      }
    }

    // set questions
    this.questions = questions;
  }
}
