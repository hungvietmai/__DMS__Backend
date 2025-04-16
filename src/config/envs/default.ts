export const config = {
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nest-default-db',
    retryAttempts: 3,
    retryDelay: 3000,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
