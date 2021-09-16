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

export default class extends Service {
  questions = [];
  recommendations = [];

  get questionTopics() {
    return this.questions.map((question) => question.topic).filter(onlyUnique);
  }

  get groupedQuestions() {
    return groupBy(this.questions, 'topic');
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
          condition: question['Condition'] ? question['Condition'].split(' && ') : [],
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
      resources[resource['Resource ID']] = {
        title: resource['Linkable text'],
        short: resource['Resource Short Description'],
        link: resource['Resource Location'],
      };
    }

    // prepare examples
    const examples = {};
    for (let example of rawExamples) {
      examples[example['Example ID']] = {
        title: example['Example 1 Title'],
        short: example['Example 1 Description'],
        link: example['Example 1 Link'],
      };
    }

    // reformat recommendations
    for (let recommendation of rawRecommendations) {
      // add recommendation
      this.recommendations.push({
        topic: recommendation['Topic'],
        title: recommendation['Suggestion / Recommendation'],
        basic: recommendation['Description'],
        advanced: recommendation['Advanced considerations'],
        resources: recommendation['Resource IDs']
          .split(',')
          .filter((id) => !!id)
          .map((id) => resources[id]),
        examples: recommendation['Example IDs']
          .split(',')
          .filter((id) => !!id)
          .map((id) => examples[id]),
      });
    }
  }
}
