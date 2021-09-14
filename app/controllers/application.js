import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  queryParams = ['title', 'answers'];

  @tracked title = '';
  @tracked answers = {};
}
