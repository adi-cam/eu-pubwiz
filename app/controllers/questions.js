import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  @service data;
  @controller application;

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
    console.log('set', qid, oid, e.target.checked);
    this.application.answers[qid] = oid;
    this.application.answers = this.application.answers;
  }

  @action toggleAnswer(qid, oid, e) {
    console.log('toggle', qid, oid, e.target.checked);
    this.application.answers[oid] = e.target.checked;
    this.application.answers = this.application.answers;
  }
}
