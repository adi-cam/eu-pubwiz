import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import evaluate from 'simple-evaluate';

export default class extends Controller {
  queryParams = ['title', 'answers'];

  @tracked title = '';
  @tracked answers = {};

  @action print() {
    window.print();
  }

  @action share() {
    window.location = `mailto:xyz@abc.com?subject=EU%20Publication%20Wizard&body=Visit%20here:%20${window.location}`;
  }

  get answerData() {
    return Object.fromEntries(
      Object.keys(this.answers).map((key) => {
        if (typeof this.answers[key] === 'string') {
          return ['_' + this.answers[key], true];
        } else {
          return ['_' + key, true];
        }
      })
    );
  }

  matchCondition(condition) {
    // match condition by expression
    let matched = condition.length === 0;
    for (let expression of condition) {
      if (evaluate(this.answerData, expression.replaceAll(/\d+/g, '_$&'))) {
        matched = true;
      }
    }

    return matched;
  }
}
