/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [], "controllers": [[import("./auth/auth.controller.js"), { "AuthController": { "login": {}, "check": { type: Object } } }], [import("./health/health.controller.js"), { "HealthController": { "check": { type: Object } } }]] } };
};