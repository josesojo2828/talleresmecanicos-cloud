// Finance

// Regions
import CityModel from "src/modules/regions/domain/models/city.model";
import CountryModel from "src/modules/regions/domain/models/country.model";

// Subscription
import DeviceModel from "src/modules/user/domain/models/device.model";
import NotificationModel from "src/modules/user/domain/models/notification.model";
import ProfileModel from "src/modules/user/domain/models/profile.model";
import SessionModel from "src/modules/user/domain/models/session.model";
import UserModel from "src/modules/user/domain/models/user.model";

export default class SecurityModel {

    private CityModel: CityModel;
    private CountryModel: CountryModel;

    // USEr
    private DeviceModel: DeviceModel;
    private ProfileModel: ProfileModel;
    private SessionModel: SessionModel;
    private UserModel: UserModel;
    private NotificationModel: NotificationModel;

    // Application
    constructor() {
        this.CityModel = new CityModel();
        this.CountryModel = new CountryModel();

        // USER
        this.DeviceModel = new DeviceModel();
        this.ProfileModel = new ProfileModel();
        this.SessionModel = new SessionModel();
        this.UserModel = new UserModel();
        this.NotificationModel = new NotificationModel();

    }

    public user() {
        return {
            name: "user",
            permits: [
                // REGIONS
                this.CityModel.permits.read,
                this.CountryModel.permits.read,

                // SUBSCRIPTION PLAN

                // SUBSCRIPTION

                // USERS
                this.DeviceModel.permits.create,
                this.DeviceModel.permits.read,
                this.DeviceModel.permits.update,
                this.ProfileModel.permits.create,
                this.ProfileModel.permits.read,
                this.ProfileModel.permits.update,
                this.SessionModel.permits.create,
                this.SessionModel.permits.read,
                this.UserModel.permits.read,
                this.NotificationModel.permits.create,
                this.NotificationModel.permits.delete,
                this.NotificationModel.permits.read,
                this.NotificationModel.permits.update,

                // PAGES VIEWS
                this.NotificationModel.permits.list,

            ]
        }
    }

    public admin() {
        return {
            name: "admin",
            permits: [
                this.CityModel.permits.create,
                this.CityModel.permits.delete,
                this.CityModel.permits.read,
                this.CityModel.permits.update,
                this.CountryModel.permits.create,
                this.CountryModel.permits.delete,
                this.CountryModel.permits.read,
                this.CountryModel.permits.update,

                // USERS
                this.SessionModel.permits.create,
                this.SessionModel.permits.delete,
                this.SessionModel.permits.read,
                this.SessionModel.permits.update,
                this.UserModel.permits.create,
                this.UserModel.permits.delete,
                this.UserModel.permits.read,
                this.UserModel.permits.update,
                this.NotificationModel.permits.create,
                this.NotificationModel.permits.delete,
                this.NotificationModel.permits.read,
                this.NotificationModel.permits.update,

                // LIST
                this.CityModel.permits.list,
                this.CountryModel.permits.list,
                this.SessionModel.permits.list,
                this.UserModel.permits.list,
                this.NotificationModel.permits.list,

            ]
        }
    }

    public superAdmin() {
        return {
            name: "superadmin",
            permits: [
                this.CityModel.permits.create,
                this.CityModel.permits.delete,
                this.CityModel.permits.read,
                this.CityModel.permits.update,
                this.CountryModel.permits.create,
                this.CountryModel.permits.delete,
                this.CountryModel.permits.read,
                this.CountryModel.permits.update,

                // USERS
                this.DeviceModel.permits.create,
                this.DeviceModel.permits.delete,
                this.DeviceModel.permits.read,
                this.DeviceModel.permits.update,
                this.ProfileModel.permits.create,
                this.ProfileModel.permits.delete,
                this.ProfileModel.permits.read,
                this.ProfileModel.permits.update,
                this.SessionModel.permits.create,
                this.SessionModel.permits.delete,
                this.SessionModel.permits.read,
                this.SessionModel.permits.update,
                this.UserModel.permits.create,
                this.UserModel.permits.delete,
                this.UserModel.permits.read,
                this.UserModel.permits.update,
                this.NotificationModel.permits.create,
                this.NotificationModel.permits.delete,
                this.NotificationModel.permits.read,
                this.NotificationModel.permits.update,

                // LISTS
                this.CityModel.permits.list,
                this.CountryModel.permits.list,
                this.DeviceModel.permits.list,
                this.ProfileModel.permits.list,
                this.SessionModel.permits.list,
                this.UserModel.permits.list,
                this.NotificationModel.permits.list,

            ]
        }
    }

    public auditor() {
        return {
            name: "auditor",
            permits: [
                this.CityModel.permits.read,
                this.CountryModel.permits.read,
                this.DeviceModel.permits.read,
                this.ProfileModel.permits.read,
                this.SessionModel.permits.read,
                this.UserModel.permits.read,
                this.NotificationModel.permits.read,

                // LISTS
                this.CityModel.permits.list,
                this.CountryModel.permits.list,
                this.DeviceModel.permits.list,
                this.ProfileModel.permits.list,
                this.SessionModel.permits.list,
                this.UserModel.permits.list,
                this.NotificationModel.permits.list,

            ]
        }
    }
}
