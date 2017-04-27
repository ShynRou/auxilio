const commander = {};
commander.plugins = {};

const WORD_TYPE = {
  optional: 0,
  addition: 1,
  required: 2,
};


commander.register = function (plugin) {
  console.log(`${plugin.id} [${plugin.aliases}]`);
  commander.plugins[plugin.id] = plugin;

  plugin.commands = plugin.commands.reduce((obj, entry) => {
    console.log(` |.${entry.id}`);
    entry.commands = commander.convertToCommandTemplates(entry.commands);
    obj[entry.id] = entry;
    return obj;
  }, {});
};


commander.convertToCommandTemplates = function (commands) {
  return commands.map(
    cmd => {
      return cmd.split(/\s+/).map(
        (word, index) => {
          let match = word.match(/^([\!\+])?([\'\w\-\|\,]+)$/);
          if (match && match[2]) {
            return {
              type: {
                undefined: WORD_TYPE.optional,
                '+': WORD_TYPE.addition,
                '!': WORD_TYPE.required
              }[match[1]],
              words: match[2].split(/\||\,/),
              pos: index
            }
          }
        }).filter(x => !!x);
    });
};

commander.rateCommandTemplate = function (cmdTemplate, fractureSentence) {
  if (cmdTemplate && fractureSentence) {
    let wordRatings = [];

    for (let wordTemplate of cmdTemplate) {
      let index;
      for (let word of wordTemplate.words) {
        let c = 0;
        fractureSentence.forEach((sub) => {
          let i = sub.indexOf(word);
          if (i >= 0) {
            index = i + c;
          }
          c += sub.length;
        });
      }

      wordRatings.push({
        type: wordTemplate.type,
        found: index >= 0,
        posDiff: index - wordTemplate.pos
      });
    }

    // TODO: analyse positional data (sentence structure if possible)
    let result = {required: 0, addition: 0, optional: 0};
    let count = {required: 0, addition: 0, optional: 0};

    for (let rating of wordRatings) {
      if (rating.type == WORD_TYPE.required) {
        result.required += rating.found ? 1 : 0;
        count.required++;
      }
      else if (rating.type == WORD_TYPE.addition) {
        result.addition += rating.found ? 1 : 0;
        count.addition++;
      }
      else if (rating.type == WORD_TYPE.optional) {
        result.optional += rating.found ? 1 : 0;
        count.optional++;
      }
    }

    result = {
      required: count.required ? result.required / count.required : 0,
      addition: count.addition ? result.addition / count.addition : 0,
      optional: count.optional ? result.optional / count.optional : 0
    };

    result.score = (result.required * 10000 + result.addition * 100 + result.optional);

    return result;
  }
};

commander.findBest = function (raw, parsed) {
  if (!raw || !parsed) {
    return null;
  }

  // CHECK RAW FOR COMMAND
  let cmdMatch = raw.match(/^[\/@>!]([\w\d\-_]+)\.([\w\d\-_]+).*$/);

  if (cmdMatch && commander.plugins[cmdMatch[1]]) {
    let cmd = commander.plugins[cmdMatch[1]][cmdMatch[2]];
    if (cmd) {
      return [{cmd, rating: {required: 1, addition: 0, scoreOptional: 0}}];
    }
  }

  // FIND BEST FUZZY MATCH
  // TODO: handle all sentences
  let firstSentence = parsed[0];
  let matches = [];

  for (let pluginId in commander.plugins) {
    for (let cmdId in commander.plugins[pluginId].commands) {
      let cmd = commander.plugins[pluginId].commands[cmdId];
      for (let cmdTemplate of cmd.commands) {
        matches.push({cmd, rating: commander.rateCommandTemplate(cmdTemplate, firstSentence)});
      }
    }
  }

  matches.sort((a, b) => {
    return (b.rating ? b.rating.score : 0) - (a.rating ? a.rating.score : 0);
  });

  return matches;
};

commander.parse = function (request, raw, parsed) {
  if (!raw || !parsed) {
    return "Sorry, did you say something?";
  }

  let cmds = commander.findBest(raw, parsed);

  if (cmds && cmds.length > 0 && cmds[0].rating.required == 1) {
    return cmds[0].cmd.handlers.entry(request, raw, parsed);
  }
};

// REGISTER PLUGIN =====================================================

var plugin = {
  register: function (server, options, next) {
    for (let key in commander) {
      server.expose(key, commander[key]);
    }
    next();
  }
};

plugin.register.attributes = {
  name: 'commander',
  version: '1.0.0'
};

module.exports = plugin;