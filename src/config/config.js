const env = process.env;

const prod = {
  boredAPI: 'http://www.boredapi.com/api/activity',
  db: {
    options: {
      auth: {
        password: env.DB_ROOT_PASS,
        user: env.DB_ROOT_USER,
      }
    },
    url: `mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
  },
  morgan: "combined",
  port: env.PORT || "8080",
  logs: {
    level: env.LOG_LEVEL || "info",
  },
};

const dev = {
  boredAPI: prod.boredAPI,
  db: {
    url: "mongodb://localhost:27017/dev",
  },
  morgan: "dev",
  port: 3000,
  logs: {
    level: "debug",
  },
};

const config = (env.NODE_ENV === "production" ? prod : dev);

module.exports = config;
