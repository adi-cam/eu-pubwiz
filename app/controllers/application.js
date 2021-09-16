import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

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

  matchCondition(condition) {
    // match conditions by group (at least one full match)
    let matched = condition.length === 0;
    for (const group of condition) {
      let subMatched = false;
      for (const item of group) {
        const qid = /\d*/.exec(item)[0];
        if (this.answers[item] || this.answers[qid] === item) {
          subMatched = true;
        }
      }
      if (subMatched) {
        matched = true;
      }
    }

    return matched;
  }
}
