export const config = {
  env: 'development',
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nest-dev-db',
    retryAttempts: 1,
    retryDelay: 1000,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
