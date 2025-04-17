/* eslint-disable */
export default async () => {
    const t = {
        ["./shared/user/schemas/user.schema.js"]: await import("./shared/user/schemas/user.schema.js")
    };
    return { "@nestjs/swagger": { "models": [], "controllers": [[import("./shared/user/users.controller.js"), { "UsersController": { "create": { type: t["./shared/user/schemas/user.schema.js"].User }, "findAll": { type: [t["./shared/user/schemas/user.schema.js"].User] }, "findOne": { type: Object } } }], [import("./auth/auth.controller.js"), { "AuthController": { "login": {}, "check": { type: Object } } }], [import("./health/health.controller.js"), { "HealthController": { "check": { type: Object } } }]] } };
};