const Plugin = require('broccoli-plugin');
const { WatchedDir } = require('broccoli-source');

const csvParse = require('csv-parse/lib/sync');

class FeedBuilder extends Plugin {
  build() {
    // read questions
    const rawQuestions = this.input.readFileSync('./questions.csv');

    // parse questions
    const questions = csvParse(rawQuestions, {
      columns: true,
    });

    // write file
    this.output.writeFileSync(`questions.json`, JSON.stringify(questions));
  }
}

module.exports = function () {
  return new FeedBuilder([new WatchedDir('')]);
};
