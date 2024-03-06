const winston = require("winston");
const config = require("../config/config");

const transports = [];

transports.push(new winston.transports.Console());

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  level: config.logs.level,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.cli(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} - ${level}:${message}`
    )
  ),
  transports,
});

logger.error = (() => {
  const originalFunc = logger.error;
  return (err) => {
    originalFunc.call(logger, err);
    if (err instanceof Error) {
      console.log(err); // to print the stack trace nicely
    }
  };
})();

module.exports = logger;
