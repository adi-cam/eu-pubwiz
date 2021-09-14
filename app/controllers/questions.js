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

  get title() {
    return this.application.title;
  }

  @action setTitle(e) {
    this.application.title = e.target.value;
  }

  get answers() {
    return this.application.answers;
  }

  @action setAnswer(qid, oid, e) {
    this.application.answers[qid] = oid;
    this.application.answers = this.application.answers;
  }

  @action toggleAnswer(qid, oid, on) {
    this.application.answers[oid] = on;
    this.application.answers = this.application.answers;
  }
}
