import Service from '@ember/service';
import fetch from 'fetch';

async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

function groupBy(list, key) {
  return list.reduce((item, x) => {
    (item[x[key]] = item[x[key]] || []).push(x);
    return item;
  }, {});
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function parseCondition(str) {
  return str ? str.split(',') : [];
}

export default class extends Service {
  questions = [];
  recommendations = [];

  get questionTopics() {
    return this.questions.map((question) => question.topic).filter(onlyUnique);
  }

  get groupedQuestions() {
    return groupBy(this.questions, 'topic');
  }

  get recommendationTopics() {
    return this.recommendations.map((recommendation) => recommendation.topic).filter(onlyUnique);
  }

  get groupedRecommendations() {
    return groupBy(this.recommendations, 'topic');
  }

  async load() {
    // load data
    const [rawQuestions, rawRecommendations, rawResources, rawExamples] = await Promise.all([
      loadJSON('/eu-pubwiz/questions.json'),
      loadJSON('/eu-pubwiz/recommendations.json'),
      loadJSON('/eu-pubwiz/resources.json'),
      loadJSON('/eu-pubwiz/examples.json'),
    ]);

    // reset state
    this.questions = [];
    this.recommendations = [];

    // reformat questions
    for (let question of rawQuestions) {
      if (question['QN']) {
        // add question
        this.questions.push({
          id: `${question['QN']}`,
          number: question['QN'],
          topic: question['Topic'],
          title: question['Questions'],
          desc: question['Description'] || null,
          condition: parseCondition(question['Condition']),
          format: question['Format'],
          options: [],
        });
      }

      // add option
      if (question['OL']) {
        const last = this.questions.slice(-1)[0];
        last.options.push({
          id: `${last.number}${question['OL']}`,
          letter: question['OL'],
          title: question['Options'],
        });
      }
    }

    // prepare resources
    const resources = {};
    for (let resource of rawResources) {
      resources[resource['id']] = {
        title: resource['title'],
        short: resource['description'],
        link: resource['link'],
      };
    }

    // prepare examples
    const examples = {};
    for (let example of rawExamples) {
      examples[example['id']] = {
        title: example['title'],
        short: example['description'],
        link: example['link'],
      };
    }

    // reformat recommendations
    let id = 1;
    for (let recommendation of rawRecommendations) {
      // add recommendation
      this.recommendations.push({
        id: id++,
        topic: recommendation['topic'],
        title: recommendation['title'],
        basic: recommendation['basic'],
        advanced: recommendation['advanced'],
        condition: parseCondition(recommendation['condition']),
        resources: recommendation['resources']
          .split(',')
          .filter((id) => !!id)
          .map((id) => resources[id]),
        contacts: recommendation['contacts']
          .split(',')
          .filter((id) => !!id)
          .map((id) => resources[id]),
        examples: recommendation['examples']
          .split(',')
          .filter((id) => !!id)
          .map((id) => examples[id]),
      });
    }
  }
}
