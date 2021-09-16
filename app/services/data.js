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
  recommendations = [];
  examples = [];
  resources = [];

  get questionTopics() {
    return this.questions.map((question) => question.topic).filter(onlyUnique);
  }

  get groupedQuestions() {
    return groupBy(this.questions, 'topic');
  }

  async load() {
    await Promise.all([this.loadQuestions(), this.loadRecommendations(), this.loadExamples(), this.loadResources()]);
  }

  async loadQuestions() {
    // load data
    const res = await fetch('/eu-pubwiz/questions.json');
    const data = await res.json();

    // reformat questions
    let questions = [];
    for (let question of data) {
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

  async loadRecommendations() {
    // load data
    const res = await fetch('/eu-pubwiz/recommendations.json');
    const data = await res.json();

    // set recommendations
    this.recommendations = data;
  }

  async loadExamples() {
    // load data
    const res = await fetch('/eu-pubwiz/examples.json');
    const data = await res.json();

    // set examples
    this.examples = data;
  }

  async loadResources() {
    // load data
    const res = await fetch('/eu-pubwiz/resources.json');
    const data = await res.json();

    // set resources
    this.resources = data;
  }
}
