/* eslint-disable */
export default async () => {
  const t = {};
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./shared/user/dto/create-user.dto.js'),
          {
            CreateUserDto: {
              email: { required: true, type: () => String, format: 'email' },
              password: { required: true, type: () => String, minLength: 8, pattern: '/^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$/' },
              studentId: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./auth/dto/login.dto.js'),
          { LoginDto: { login: { required: true, type: () => String }, password: { required: true, type: () => String } } },
        ],
        [
          import('./auth/dto/register.dto.js'),
          {
            RegisterDto: {
              studentCode: { required: true, type: () => String },
              studentName: { required: true, type: () => String },
              idCard: { required: true, type: () => String, pattern: '/^\\d{9,12}$/' },
              dob: { required: true, type: () => String },
              class: { required: false, type: () => String },
              hometown: { required: false, type: () => String },
              email: { required: true, type: () => String, format: 'email' },
              password: { required: true, type: () => String, minLength: 8 },
            },
          },
        ],
        [
          import('./core/service-catalog/dto/create-service-catalog.dto.js'),
          {
            CreateServiceCatalogDto: {
              serviceCode: { required: true, type: () => String },
              serviceName: { required: true, type: () => String },
              unitPrice: { required: true, type: () => Number, minimum: 0 },
              unit: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./core/service-catalog/dto/update-service-catalog.dto.js'),
          { UpdateServiceCatalogDto: { isAvailable: { required: false, type: () => Boolean } } },
        ],
        [
          import('./core/guest-visit/dto/create-guest-visit.dto.js'),
          {
            CreateGuestVisitDto: {
              guestIdCard: { required: true, type: () => String, pattern: '/^\\d{9,12}$/' },
              guestName: { required: true, type: () => String },
              guestDob: { required: false, type: () => String },
              studentId: { required: true, type: () => String },
              visitedAt: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./core/parking-daily-log/dto/create-parking-session.dto.js'),
          {
            CreateParkingSessionDto: {
              subscriptionId: { required: true, type: () => String },
              outTime: { required: true, type: () => String },
              inTime: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./core/parking-subscription/dto/create-parking-subscription.dto.js'),
          {
            CreateParkingSubscriptionDto: {
              studentId: { required: true, type: () => String },
              licensePlate: { required: true, type: () => String },
              vehicleType: { required: true, type: () => Object },
              startedAt: { required: false, type: () => String },
            },
          },
        ],
        [
          import('./core/parking-subscription/dto/update-parking-subscription.dto.js'),
          { UpdateParkingSubscriptionDto: { isActive: { required: false, type: () => Boolean } } },
        ],
        [
          import('./core/room/dto/create-room.dto.js'),
          {
            CreateRoomDto: {
              roomNo: { required: true, type: () => String },
              roomType: { required: true, type: () => Object },
              pricePerMonth: { required: true, type: () => Number, minimum: 0 },
              capacity: { required: true, type: () => Number, minimum: 1 },
            },
          },
        ],
        [import('./core/room/dto/update-room.dto.js'), { UpdateRoomDto: {} }],
        [
          import('./core/room-booking/dto/create-booking.dto.js'),
          {
            CreateBookingDto: {
              studentId: { required: true, type: () => String },
              roomId: { required: true, type: () => String },
              from: { required: true, type: () => String },
            },
          },
        ],
        [
          import('./core/service-usage/dto/create-service-usage.dto.js'),
          {
            CreateServiceUsageDto: {
              studentId: { required: true, type: () => String },
              serviceName: { required: true, type: () => String },
              unitPriceSnapshot: { required: true, type: () => Number, minimum: 0 },
              usedAt: { required: false, type: () => String },
              quantity: { required: false, type: () => Number, minimum: 1 },
            },
          },
        ],
      ],
      controllers: [
        [import('./auth/auth.controller.js'), { AuthController: { register: {}, login: { type: Object }, me: { type: Object } } }],
        [
          import('./shared/user/users.controller.js'),
          { UsersController: { create: { type: Object }, findAll: { type: [Object] }, findOne: { type: Object } } },
        ],
        [import('./health/health.controller.js'), { HealthController: { check: { type: Object } } }],
        [
          import('./core/service-catalog/service-catalog.controller.js'),
          {
            ServiceCatalogController: {
              create: { type: Object },
              findAll: { type: [Object] },
              findOne: { type: Object },
              update: { type: Object },
              disable: { type: Object },
              restore: { type: Object },
            },
          },
        ],
        [
          import('./core/guest-visit/guest-visit.controller.js'),
          { GuestVisitController: { create: { type: Object }, findAll: { type: [Object] } } },
        ],
        [
          import('./core/parking-daily-log/parking-daily-log.controller.js'),
          { ParkingDailyLogController: { logSession: { type: Object }, findDailyLogs: { type: [Object] }, findStudentSessions: {} } },
        ],
        [
          import('./core/parking-subscription/parking-subscription.controller.js'),
          {
            ParkingSubscriptionController: {
              create: { type: Object },
              findAll: { type: [Object] },
              findOne: { type: Object },
              update: { type: Object },
              deactivate: { type: Object },
              reactivate: { type: Object },
            },
          },
        ],
        [
          import('./core/room/room.controller.js'),
          {
            RoomController: {
              create: { type: Object },
              findAll: { type: [Object] },
              findOne: { type: Object },
              update: { type: Object },
              remove: {},
            },
          },
        ],
        [
          import('./core/service-usage/service-usage.controller.js'),
          { ServiceUsageController: { create: { type: Object }, findAll: { type: [Object] } } },
        ],
      ],
    },
  };
};
