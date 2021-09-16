import Helper from '@ember/component/helper';

export default class extends Helper {
  compute([str]) {
    return str
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
}
