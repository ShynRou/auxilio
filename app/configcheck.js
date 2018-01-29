
const time2ms = require('./helpers/time2ms');
const Joi = require('joi');

const schema = Joi.object({
  server: Joi.object({
    host: Joi.string(),
    port: Joi.number(),
    routes: Joi.object({
      cors: Joi.object({
        origin: Joi.array().items(Joi.string()).default(["*"]),
        additionalHeaders: Joi.array().items(Joi.string()),
        credentials: Joi.boolean().default(true)
      }).default(),
    }).default(),
  }).default(),
  auth: Joi.object({
    cookie: Joi.object({
      secret: Joi.string().min(8).default('>kshdl:_As,d_:?=§$.,uadI((/§ujSda>dja#sl",das34ohsjd,mN;S:;DAp=)"3434>'),
      name: Joi.string().default('R1NKU'),
      ttl: Joi.number().min(0).default(time2ms('1month')),
      domain: Joi.string().default(undefined),
      isSecure: Joi.boolean().default(false),
      isHttpOnly: Joi.boolean().default(false),
      clearInvalid: Joi.boolean().default(false),
      strictHeader: Joi.boolean().default(true),
      path: Joi.string().default('/'),
    }).default(),
    rules: Joi.object({
      userId: Joi.object({
        minLength: Joi.number().default(1),
        maxLength: Joi.number().default(32),
        pattern: Joi.string().optional(),
      }).default(),
      password: Joi.object({
        minLength: Joi.number().default(8),
        maxLength: Joi.number().default(128),
        pattern: Joi.string().email().optional(),
      }).default(),
    }).default(),
    salt: Joi.number().min(1).default(9),
  }).default(),
  modules: Joi.object({
    dir: Joi.string().optional(),
  }).default()
});


module.exports = function (config) {
  const result = schema.validate(config);

  if(result.error){
    throw result.error;
  }

  return result.value;
};