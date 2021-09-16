import Service from '@ember/service';
import fetch from 'fetch';

function groupBy(list, key) {
  return list.reduce((item, x) => {
    (item[x[key]] = item[x[key]] || []).push(x);
    return item;
  }, {});
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export default class extends Service {
  questions = [];

  get questionTopics() {
    return this.questions.map((question) => question.topic).filter(onlyUnique);
  }

  get groupedQuestions() {
    return groupBy(this.questions, 'topic');
  }

  async load() {
    // load questions
    const res = await fetch('/eu-pubwiz/questions.json');
    const rawQuestions = await res.json();

    // reformat questions
    let questions = [];
    for (let question of rawQuestions) {
      if (question['QN']) {
        // add question
        questions.push({
          id: `${question['QN']}`,
          number: question['QN'],
          topic: question['Topic'],
          title: question['Questions'],
          desc: question['Description'] || null,
          condition: question['Condition'] ? question['Condition'].split(' && ') : [],
          format: question['Format'],
          options: [],
        });
      }

      // add option
      if (question['OL']) {
        const last = questions.slice(-1)[0];
        last.options.push({
          id: `${last.number}${question['OL']}`,
          letter: question['OL'],
          title: question['Options'],
        });
      }
    }

    // set questions
    this.questions = questions;
  }
}
