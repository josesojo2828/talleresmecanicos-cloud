import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import CityModel from "src/modules/regions/domain/models/city.model";
import CountryModel from "src/modules/regions/domain/models/country.model";
import { ObjectPage, ObjectSidebar, TableColumn } from "src/types/user/dashboard";
import ProfileModel from "../../domain/models/profile.model";
import SessionModel from "../../domain/models/session.model";
import UserModel from "../../domain/models/user.model";
import NotificationModel from "../../domain/models/notification.model";
import { IUser } from "src/types/user/user";

// Models - Workshops & Forum
import WorkshopModel from "src/modules/workshop/domain/models/workshop.model";
import WorkshopCategoryModel from "src/modules/workshop/domain/models/workshop-category.model";
import PublicationModel from "src/modules/workshop/domain/models/publication.model";
import ForumPostModel from "src/modules/forum/domain/models/forum-post.model";

// Models - Support
import SupportAssignmentModel from "src/modules/support/domain/models/support-assignment.model";
import AppointmentModel from "src/modules/appointment/domain/models/appointment.model";
import WorkModel from "src/modules/work/domain/models/work.model";

// Forms
import * as AppForms from "src/types/form/app.form";
import * as RegionForms from "src/types/form/regions.form";
import * as UserForms from "src/types/form/user.form";

@Injectable()
export default class DashboardService {

    private CityModel: CityModel;
    private CountryModel: CountryModel;

    // USER
    private ProfileModel: ProfileModel;
    private SessionModel: SessionModel;
    private UserModel: UserModel;
    private NotificationModel: NotificationModel;

    // NEW MODULES
    private WorkshopModel: WorkshopModel;
    private WorkshopCategoryModel: WorkshopCategoryModel;
    private PublicationModel: PublicationModel;
    private ForumPostModel: ForumPostModel;
    private SupportAssignmentModel: SupportAssignmentModel;
    private AppointmentModel: AppointmentModel;
    private WorkModel: WorkModel;

    constructor(
        private readonly prisma: PrismaService
    ) {
        this.CityModel = new CityModel();
        this.CountryModel = new CountryModel();

        // USER
        this.ProfileModel = new ProfileModel();
        this.SessionModel = new SessionModel();
        this.UserModel = new UserModel();
        this.NotificationModel = new NotificationModel();

        // NEW
        this.WorkshopModel = new WorkshopModel();
        this.WorkshopCategoryModel = new WorkshopCategoryModel();
        this.PublicationModel = new PublicationModel();
        this.ForumPostModel = new ForumPostModel();
        this.SupportAssignmentModel = new SupportAssignmentModel();
        this.AppointmentModel = new AppointmentModel();
        this.WorkModel = new WorkModel();
    }

    public async getPages(user: IUser) {
        if (!user.role) return;

        const role = user.role;
        const pages: ObjectPage[] = [];
        const sidebar: ObjectSidebar[] = [
            { icon: 'grid', label: 'nav.home', path: '/dashboard', slug: 'home' }
        ];

        // ADMIN ACCESS ALL
        const isAdmin = role === 'ADMIN';
        const isSupport = role === 'SUPPORT';
        const isTaller = role === 'TALLER';
        const isClient = role === 'CLIENT';

        // PERFIL (TODOS)
        sidebar.push({
            icon: 'user',
            label: 'nav.profile',
            path: '/dashboard/profile',
            slug: 'profile'
        });

        pages.push({
            slug: 'profile',
            title: 'Mi Perfil',
            subtitle: 'Actualiza tus datos de acceso',
            actions: [],
            actionsRows: [],
            columns: [],
            form: UserForms.ProfileForm
        });

        sidebar.push({
            icon: 'home',
            label: 'nav.exit',
            path: '/',
            slug: 'exit'
        });

        // 1 & 2. ADMINISTRACIÓN (ADMIN & SUPPORT)
        if (isAdmin || isSupport) {
            const adminSidebar: ObjectSidebar = {
                icon: 'settings',
                label: 'nav.administration',
                path: '/dashboard/admin',
                slug: 'administration',
                childs: []
            };

            if (isAdmin) {
                adminSidebar.childs?.push({ icon: 'user', label: 'user.management', path: '/dashboard/user', slug: 'user' });
            }
            
            adminSidebar.childs?.push({ icon: 'flag', label: 'nav.countries', path: '/dashboard/country', slug: 'country' });
            adminSidebar.childs?.push({ icon: 'map', label: 'nav.cities', path: '/dashboard/city', slug: 'city' });

            sidebar.push(adminSidebar);

            if (isAdmin) {
                pages.push({
                    slug: 'user',
                    title: 'user.management',
                    subtitle: 'user.subtitle.default',
                    actions: [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }],
                    actionsRows: [
                        { icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' },
                        { icon: 'delete', label: 'action.delete', action: 'delete', type: 'modal' }
                    ],
                    columns: [
                        { key: 'firstName', label: 'headers.firstName', type: 'text' },
                        { key: 'lastName', label: 'headers.lastName', type: 'text' },
                        { key: 'email', label: 'headers.email', type: 'text' },
                        { key: 'role', label: 'headers.role', type: 'badge' },
                        { key: 'enabled', label: 'headers.status', type: 'boolean' }
                    ],
                    form: UserForms.UserCreateForm
                });
            }

            pages.push({
                slug: 'country',
                title: 'nav.countries',
                subtitle: 'regions.country.subtitle',
                actions: [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }],
                actionsRows: [{ icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' }],
                columns: [
                    { key: 'name', label: 'headers.name', type: 'text' },
                    { key: 'enabled', label: 'headers.status', type: 'boolean' }
                ],
                form: RegionForms.CountryForm
            });

            const countries = await this.prisma.country.findMany({ where: { enabled: true } });

            pages.push({
                slug: 'city',
                title: 'nav.cities',
                subtitle: 'regions.city.subtitle',
                actions: [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }],
                actionsRows: [{ icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' }],
                columns: [
                    { key: 'name', label: 'headers.name', type: 'text' },
                    { key: 'country.name', label: 'headers.country', type: 'text' },
                    { key: 'enabled', label: 'headers.status', type: 'boolean' }
                ],
                form: RegionForms.CityForm,
                filters: [
                    { key: 'countryId', label: 'regions.filter_country', type: 'select', options: countries.map(c => ({ label: c.name, value: c.id })) }
                ]
            });
        }

        // 3. TALLERES
        const workshopSidebar: ObjectSidebar = {
            icon: 'tool',
            label: 'nav.workshops',
            path: '/dashboard/workshop',
            slug: 'workshop-management',
            childs: []
        };

        if (isAdmin || isSupport) {
            workshopSidebar.childs.push({ icon: 'list', label: 'nav.workshop_list', path: '/dashboard/workshop', slug: 'workshop' });
            workshopSidebar.childs.push({ icon: 'category', label: 'nav.categories', path: '/dashboard/category', slug: 'workshop-category' });

            if (isAdmin) {
                workshopSidebar.childs.push({ icon: 'tool', label: 'nav.all_works', path: '/dashboard/work', slug: 'work' });
                workshopSidebar.childs.push({ icon: 'archive', label: 'nav.all_parts', path: '/dashboard/part', slug: 'part' });
            }
        }

        if (isTaller || isAdmin) {
            workshopSidebar.childs.push({ icon: 'chart', label: 'nav.finance', path: '/dashboard/finance', slug: 'finance' });
        }

        if (isTaller) {
            workshopSidebar.childs.push({ icon: 'info', label: 'nav.my_workshop', path: '/dashboard/my-workshop', slug: 'my-workshop' });
            workshopSidebar.childs.push({ icon: 'calendar', label: 'appointment.title', path: '/dashboard/appointment', slug: 'appointment' });
            workshopSidebar.childs.push({ icon: 'tool', label: 'work.title', path: '/dashboard/work', slug: 'work' });
            workshopSidebar.childs.push({ icon: 'archive', label: 'nav.inventory', path: '/dashboard/part', slug: 'part' });
            workshopSidebar.childs.push({ icon: 'post', label: 'nav.my_publications', path: '/dashboard/publication', slug: 'publication' });
        }

        sidebar.push(workshopSidebar);

        pages.push({
            slug: 'finance',
            title: 'Finanzas y Rendimiento',
            subtitle: 'Análisis de ingresos, inventario y balance operativo',
            actions: [],
            actionsRows: [],
            columns: [],
            form: null as any
        });

        pages.push({
            slug: 'workshop',
            title: isAdmin ? 'workshop.management' : 'nav.workshops',
            subtitle: 'workshop.subtitle',
            actions: (isAdmin || isSupport) ? [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }] : [],
            actionsRows: [{ icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' }],
            columns: [
                { key: 'name', label: 'headers.name', type: 'text' },
                { key: 'city.name', label: 'headers.city', type: 'text' },
                { key: 'enabled', label: 'headers.status', type: 'boolean' }
            ],
            form: AppForms.WorkshopForm
        });

        if (isTaller) {
            pages.push({
                slug: 'my-workshop',
                title: 'nav.my_workshop',
                subtitle: 'workshop.subtitle',
                actions: [], // No adding more workshops
                actionsRows: [{ icon: 'edit', label: 'action.edit_info', action: 'edit', type: 'modal' }],
                columns: [
                    { key: 'name', label: 'headers.name', type: 'text' },
                    { key: 'city.name', label: 'headers.city', type: 'text' },
                    { key: 'enabled', label: 'headers.status', type: 'boolean' }
                ],
                form: AppForms.WorkshopForm
            });
        }

        if (isAdmin || isSupport) {
            pages.push({
                slug: 'workshop-category',
                title: 'nav.categories',
                subtitle: 'workshop.categories.subtitle',
                actions: [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }],
                actionsRows: [{ icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' }],
                columns: [
                    { key: 'name', label: 'headers.name', type: 'text' },
                    { key: 'enabled', label: 'headers.status', type: 'boolean' }
                ],
                form: AppForms.WorkshopCategoryForm
            });
        }

        pages.push({
            slug: 'publication',
            title: 'nav.my_publications',
            subtitle: 'publication.subtitle',
            actions: [{ icon: 'add', label: 'action.advertise', action: 'add', type: 'page' }],
            actionsRows: [
                { icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' },
                { icon: 'delete', label: 'action.delete', action: 'delete', type: 'modal' }
            ],
            columns: [
                { key: 'title', label: 'headers.title', type: 'text' },
                { key: 'enabled', label: 'headers.visible', type: 'boolean' },
                { key: 'createdAt', label: 'headers.date', type: 'date' }
            ],
            form: AppForms.PublicationForm
        });

        // 3.1 CITAS (APPOINTMENTS)
        pages.push({
            slug: 'appointment',
            title: 'appointment.title',
            subtitle: 'appointment.subtitle',
            actions: (isTaller || isAdmin) ? [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }] : [],
            actionsRows: [
                { icon: 'edit', label: 'action.manage', action: 'edit', type: 'modal' },
                (isTaller || isAdmin) ? { icon: 'delete', label: 'action.cancel', action: 'delete', type: 'modal' } : null
            ].filter(Boolean) as any,
            columns: [
                { key: 'dateTime', label: 'headers.date', type: 'date' },
                { key: 'clientName', label: 'headers.client', type: 'text' },
                { key: 'status', label: 'headers.status', type: 'badge' }
            ],
            form: AppForms.AppointmentForm
        });

        // 3.2 TRABAJOS (WORKS)
        pages.push({
            slug: 'work',
            title: 'work.title',
            subtitle: 'work.description',
            actions: isTaller ? [{ icon: 'add', label: 'Registrar Trabajo', action: 'add', type: 'page' }] : [],
            actionsRows: [
                { icon: 'view', label: 'action.view', action: 'edit', type: 'modal' },
                isTaller ? { icon: 'delete', label: 'action.delete', action: 'delete', type: 'modal' } : null
            ].filter(Boolean) as any,
            columns: [
                { key: 'title', label: 'headers.title', type: 'text' },
                { key: 'publicId', label: 'work.publicId', type: 'text' },
                { key: 'clientName', label: 'headers.name', type: 'text' },
                { key: 'status', label: 'work.status', type: 'badge' },
                { key: 'createdAt', label: 'headers.date', type: 'date' }
            ],
            form: AppForms.WorkForm
        });

        // 3.3 INVENTARIO (PARTS)
        pages.push({
            slug: 'part',
            title: 'nav.inventory',
            subtitle: 'inventory.description',
            actions: isTaller ? [{ icon: 'add', label: 'inventory.add_part', action: 'add', type: 'page' }] : [],
            actionsRows: [
                { icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' },
                { icon: 'delete', label: 'action.delete', action: 'delete', type: 'modal' }
            ],
            columns: [
                { key: 'name', label: 'headers.name', type: 'text' },
                { key: 'sku', label: 'headers.sku', type: 'text' },
                { key: 'quantity', label: 'headers.quantity', type: 'text' },
                { key: 'price', label: 'headers.price', type: 'text' },
                { key: 'category.name', label: 'headers.category', type: 'text' }
            ],
            form: AppForms.PartForm
        });

        pages.push({
            slug: 'part-category',
            title: 'inventory.category.title',
            subtitle: 'inventory.category.subtitle',
            actions: isTaller ? [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }] : [],
            actionsRows: [
                { icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' },
                { icon: 'delete', label: 'action.delete', action: 'delete', type: 'modal' }
            ],
            columns: [
                { key: 'name', label: 'headers.name', type: 'text' }
            ],
            form: AppForms.PartCategoryForm
        });

        // 4. FORO (TODOS MENOS TALLER QUE YA TIENE SUS PUBLICACIONES)
        if (!isTaller) {
            const forumSidebar: ObjectSidebar = {
                icon: 'message',
                label: 'nav.public_forum',
                path: '/dashboard/forum',
                slug: 'forum',
                childs: [
                    { icon: 'post', label: 'forum.post.title', path: '/dashboard/forum-post', slug: 'forum-post' }
                ]
            };
            sidebar.push(forumSidebar);
        }

        pages.push({
            slug: 'forum-post',
            title: 'forum.post.title',
            subtitle: 'forum.post.subtitle',
            actions: [{ icon: 'add', label: 'action.add', action: 'add', type: 'page' }],
            actionsRows: [
                { icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' },
                isAdmin ? { icon: 'delete', label: 'action.delete', action: 'delete', type: 'modal' } : null
            ].filter(Boolean) as any,
            columns: [
                { key: 'title', label: 'headers.title', type: 'text' },
                { key: 'user.firstName', label: 'headers.author', type: 'text' },
                { key: 'enabled', label: 'headers.moderated', type: 'boolean' }
            ],
            form: AppForms.ForumPostForm
        });

        // 5. CLIENTE (MIS VEHÍCULOS Y SOLICITUDES)
        if (isClient) {
            const clientSidebar: ObjectSidebar = {
                icon: 'activity',
                label: 'nav.garage',
                path: '/dashboard/garage',
                slug: 'garage',
                childs: [
                    { icon: 'user', label: 'nav.my_vehicles', path: '/dashboard/vehicle', slug: 'vehicle' },

                    { icon: 'tool', label: 'work.title', path: '/dashboard/work', slug: 'work' },
                    { icon: 'message', label: 'nav.my_requests', path: '/dashboard/service-request', slug: 'service-request' }
                ]
            };
            sidebar.push(clientSidebar);

            pages.push({
                slug: 'vehicle',
                title: 'nav.garage',
                subtitle: 'vehicle.subtitle',
                actions: [{ icon: 'add', label: 'action.register_vehicle', action: 'add', type: 'page' }],
                actionsRows: [
                    { icon: 'edit', label: 'action.edit', action: 'edit', type: 'modal' },
                    { icon: 'delete', label: 'action.delete', action: 'delete', type: 'modal' }
                ],
                columns: [
                    { key: 'brand', label: 'headers.brand', type: 'text' },
                    { key: 'model', label: 'headers.model', type: 'text' },
                    { key: 'licensePlate', label: 'headers.licensePlate', type: 'text' },
                    { key: 'year', label: 'headers.year', type: 'text' }
                ],
                form: AppForms.VehicleForm
            });

            pages.push({
                slug: 'service-request',
                title: 'nav.my_requests',
                subtitle: 'service_request.subtitle',
                actions: [{ icon: 'add', label: 'action.new_request', action: 'add', type: 'page' }],
                actionsRows: [
                    { icon: 'view', label: 'action.view_details', action: 'edit', type: 'modal' },
                    { icon: 'delete', label: 'action.cancel', action: 'delete', type: 'modal' }
                ],
                columns: [
                    { key: 'title', label: 'headers.title', type: 'text' },
                    { key: 'status', label: 'headers.status', type: 'badge' },
                    { key: 'isSOS', label: 'headers.sos', type: 'boolean' },
                    { key: 'createdAt', label: 'headers.date', type: 'date' }
                ],
                form: AppForms.ServiceRequestForm
            });

        }

        return {
            sidebar,
            pages
        }
    }
}
