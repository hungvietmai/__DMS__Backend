export const config = {
  mongo: {
    uri: process.env['MONGO_URI'],
    retryAttempts: 5,
    retryDelay: 5000,
  },
  debug: false,
  jwtSecret: process.env['JWT_SECRET'],
  jwtRefreshSecret: process.env['JWT_REFRESH_SECRET'],
};
