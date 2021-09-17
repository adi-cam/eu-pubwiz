import Helper from '@ember/component/helper';

export default class extends Helper {
  compute() {
    return () => {
      document.documentElement.scrollTo(0, 0);
    };
  }
}
