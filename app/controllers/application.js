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
}
