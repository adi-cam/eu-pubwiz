import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  @service data;
  @controller application;

  @tracked state = {};

  @action open(rid, open) {
    this.state[rid] = open;
    this.state = this.state; // eslint-disable-line
  }

  @action openAll(recommendations) {
    for (const recommendation of recommendations) {
      this.state[recommendation.id] = true;
      this.state = this.state; // eslint-disable-line
    }
  }
}
