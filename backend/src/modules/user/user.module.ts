import { Module } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

// User
import { UserCrudController } from "./infrastructure/controllers/user.crud";
import CreateUserUCase from "./application/use-cases/user/create.ucase";
import UpdateUserUCase from "./application/use-cases/user/update.ucase";
import DeleteUserUCase from "./application/use-cases/user/delete.ucase";
import QueryUserUCase from "./application/use-cases/user/query.ucase";
import CreateUserPersistence from "./infrastructure/persistence/user/create.persistence";
import UpdateUserPersistence from "./infrastructure/persistence/user/update.persistence";
import DeleteUserPersistence from "./infrastructure/persistence/user/delete.persistence";
import FindUserPersistence from "./infrastructure/persistence/user/find.persistence";

// Profile
import { ProfileCrudController } from "./infrastructure/controllers/profile.crud";
import CreateProfileUCase from "./application/use-cases/profile/create.ucase";
import UpdateProfileUCase from "./application/use-cases/profile/update.ucase";
import DeleteProfileUCase from "./application/use-cases/profile/delete.ucase";
import QueryProfileUCase from "./application/use-cases/profile/query.ucase";
import { CreateProfilePersistence, UpdateProfilePersistence, DeleteProfilePersistence, FindProfilePersistence } from "./infrastructure/persistence/profile/profile.persistence";

// Session
import { SessionCrudController } from "./infrastructure/controllers/session.crud";
import CreateSessionUCase from "./application/use-cases/session/create.ucase";
import UpdateSessionUCase from "./application/use-cases/session/update.ucase";
import DeleteSessionUCase from "./application/use-cases/session/delete.ucase";
import QuerySessionUCase from "./application/use-cases/session/query.ucase";
import { CreateSessionPersistence, UpdateSessionPersistence, DeleteSessionPersistence, FindSessionPersistence } from "./infrastructure/persistence/session/session.persistence";

// Device
import { DeviceCrudController } from "./infrastructure/controllers/device.crud";
import CreateDeviceUCase from "./application/use-cases/device/create.ucase";
import UpdateDeviceUCase from "./application/use-cases/device/update.ucase";
import DeleteDeviceUCase from "./application/use-cases/device/delete.ucase";
import QueryDeviceUCase from "./application/use-cases/device/query.ucase";
import { CreateDevicePersistence, UpdateDevicePersistence, DeleteDevicePersistence, FindDevicePersistence } from "./infrastructure/persistence/device/device.persistence";

// Notification
import { NotificationCrudController } from "./infrastructure/controllers/notification.crud";
import CreateNotificationUCase from "./application/use-cases/notification/create.ucase";
import UpdateNotificationUCase from "./application/use-cases/notification/update.ucase";
import DeleteNotificationUCase from "./application/use-cases/notification/delete.ucase";
import QueryNotificationUCase from "./application/use-cases/notification/query.ucase";
import { CreateNotificationPersistence, UpdateNotificationPersistence, DeleteNotificationPersistence, FindNotificationPersistence } from "./infrastructure/persistence/notification/notification.persistence";
import DashboardService from "./application/service/dashboard.service";
import SecurityModule from "../security/security.module";

@Module({
    imports: [
        SecurityModule
    ],
    controllers: [
        UserCrudController,
        ProfileCrudController,
        SessionCrudController,
        DeviceCrudController,
        NotificationCrudController
    ],
    providers: [
        PrismaService,
        DashboardService,

        // User
        CreateUserUCase, UpdateUserUCase, DeleteUserUCase, QueryUserUCase,
        CreateUserPersistence, UpdateUserPersistence, DeleteUserPersistence, FindUserPersistence,

        // Profile
        CreateProfileUCase, UpdateProfileUCase, DeleteProfileUCase, QueryProfileUCase,
        CreateProfilePersistence, UpdateProfilePersistence, DeleteProfilePersistence, FindProfilePersistence,

        // Session
        CreateSessionUCase, UpdateSessionUCase, DeleteSessionUCase, QuerySessionUCase,
        CreateSessionPersistence, UpdateSessionPersistence, DeleteSessionPersistence, FindSessionPersistence,

        // Device
        CreateDeviceUCase, UpdateDeviceUCase, DeleteDeviceUCase, QueryDeviceUCase,
        CreateDevicePersistence, UpdateDevicePersistence, DeleteDevicePersistence, FindDevicePersistence,

        // Notification
        CreateNotificationUCase, UpdateNotificationUCase, DeleteNotificationUCase, QueryNotificationUCase,
        CreateNotificationPersistence, UpdateNotificationPersistence, DeleteNotificationPersistence, FindNotificationPersistence
    ],
    exports: [
        FindUserPersistence,
        FindProfilePersistence,
        FindSessionPersistence,
        FindDevicePersistence,
        FindNotificationPersistence,
        DashboardService,
    ]
})
export class UserModule { }
