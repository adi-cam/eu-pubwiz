import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Base extends Route {
  @service fastboot;

  activate() {
    super.activate(...arguments);

    // scroll to top in browser
    if (!this.fastboot.isFastBoot) {
      window.scrollTo(0, 0);
    }
  }

  afterModel() {
    super.activate(...arguments);

    // scroll to top in browser
    if (!this.fastboot.isFastBoot) {
      window.scrollTo(0, 0);
    }
  }
}
