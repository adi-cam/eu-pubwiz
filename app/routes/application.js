import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service data;

  queryParams = {
    title: {
      replace: true,
    },
    answers: {
      replace: true,
    },
  };

  async model() {
    return this.data.load();
  }

  serializeQueryParam(value, key) {
    if (key === 'answers') {
      return Object.entries(value || {})
        .filter((item) => item[1])
        .map((item) => {
          return item[1] === true ? item[0] : `${item[0]}-${item[1]}`;
        })
        .join('.');
    }
    return value;
  }

  deserializeQueryParam(value, key) {
    if (key === 'answers') {
      return Object.fromEntries(
        (value || '').split('.').map((str) => {
          const seg = str.split('-');
          return seg.length > 1 ? seg : [seg[0], true];
        })
      );
    }
    return value;
  }
}
