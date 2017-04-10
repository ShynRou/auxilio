
const dictionary = require('./dictonary');

const structure = {};

structure.init = (dictFilePath) => {
  dictionary.loadFile(dictFilePath).then((resolve) => {
    structure.dict = resolve;
    console.log('structure.initialized');
  });
};

structure.fracture = (text) => {

  let result = text.split(/\s*([.;!?])\s*/).map(
    (s) => {
      return s.length == 1 ? s : s.split(/\s*([,"])\s*/).map(
        (ss) => {
          return ss.length == 1 ? ss : ss.split(/['\s]/);
        }
      );
    }
  );

      console.log(result);
  return result;
};

structure.categorizeFracture = (fracture) => {

};


structure.categorizeWord = (word) => {
  if(!word)
    return word;

  word = word.toLowerCase();

  if(structure.dict && structure.dict[word]) {
    return `${word}:${structure.dict[word]}`;
  }
};


module.exports = structure;