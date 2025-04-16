export const config = {
  env: 'production',
  mongo: {
    uri: process.env.MONGO_URI,
    retryAttempts: 1,
    retryDelay: 1000,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};
