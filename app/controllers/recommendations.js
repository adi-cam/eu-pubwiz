import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  @service data;
  @controller application;

  @tracked state = {};
}
