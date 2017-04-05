module.exports = function (text) {

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