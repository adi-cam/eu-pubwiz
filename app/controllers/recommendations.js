import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class extends Controller {
  @service data;
  @controller application;

  @tracked state = {};

  get filteredGroupedRecommendations() {
    return Object.fromEntries(
      Object.entries(this.data.groupedRecommendations).map((group) => {
        return [
          group[0],
          group[1].filter((recommendation) => {
            return this.application.matchCondition(recommendation.condition);
          }),
        ];
      })
    );
  }

  @action openAll(recommendations) {
    for (const recommendation of recommendations) {
      this.state[recommendation.title] = true;
      this.state = this.state; // eslint-disable-line
    }
  }
}
