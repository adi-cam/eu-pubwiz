import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  @service data;
  @controller application;

  queryParams = ['page'];

  @tracked page = 1;

  get filteredGroupedQuestions() {
    return Object.fromEntries(
      Object.entries(this.data.groupedQuestions).map((group) => {
        return [
          group[0],
          group[1].filter((question) => {
            for (const condition of question.condition) {
              const qid = /\d*/.exec(condition)[0];
              if (!(this.application.answers[condition] || this.application.answers[qid] === condition)) {
                return false;
              }
            }
            return true;
          }),
        ];
      })
    );
  }

  get title() {
    return this.application.title;
  }

  @action setTitle(e) {
    this.application.title = e.target.value;
  }

  get answers() {
    return this.application.answers;
  }

  @action setAnswer(qid, oid) {
    this.application.answers[qid] = oid;
    this.application.answers = this.application.answers; // eslint-disable-line
  }

  @action toggleAnswer(qid, oid, on) {
    this.application.answers[oid] = on;
    this.application.answers = this.application.answers; // eslint-disable-line
  }
}
