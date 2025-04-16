export const config = {
  mongo: {
    uri: process.env['MONGO_URI'] || 'mongodb://localhost:27017/nest-dev-db',
    retryAttempts: 1,
    retryDelay: 1000,
  },
  debug: true,
  jwtSecret: process.env['JWT_SECRET'],
  jwtRefreshSecret: process.env['JWT_REFRESH_SECRET'],
};
