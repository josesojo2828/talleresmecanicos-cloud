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

        // 1. GESTIÓN DE USUARIOS (ADMIN & SUPPORT)
        if (isAdmin) {
            const userSidebar: ObjectSidebar = {
                icon: 'user',
                label: 'nav.user_management',
                path: '/user',
                slug: 'user',
                childs: [
                    { icon: 'user', label: 'user.title', path: '/user/user', slug: 'user' }
                ]
            };
            sidebar.push(userSidebar);

            pages.push({
                slug: 'user',
                title: 'Usuarios',
                subtitle: 'Administración de usuarios y roles',
                actions: [{ icon: 'add', label: 'Agregar', action: 'add', type: 'page' }],
                actionsRows: [
                    { icon: 'edit', label: 'Editar', action: 'edit', type: 'modal' },
                    { icon: 'delete', label: 'Eliminar', action: 'delete', type: 'modal' }
                ],
                columns: [
                    { key: 'firstName', label: 'Nombre', type: 'text' },
                    { key: 'lastName', label: 'Apellido', type: 'text' },
                    { key: 'email', label: 'Email', type: 'text' },
                    { key: 'role', label: 'Rol', type: 'badge' },
                    { key: 'enabled', label: 'Estado', type: 'boolean' }
                ],
                form: UserForms.UserCreateForm
            });
        }

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

        // 2. REGIONES (ADMIN & SUPPORT)
        if (isAdmin || isSupport) {
            const regionSidebar: ObjectSidebar = {
                icon: 'globe',
                label: 'nav.regions',
                path: '/region',
                slug: 'region',
                childs: [
                    { icon: 'flag', label: 'nav.countries', path: '/region/country', slug: 'country' },
                    { icon: 'map', label: 'nav.cities', path: '/region/city', slug: 'city' }
                ]
            };
            sidebar.push(regionSidebar);

            pages.push({
                slug: 'country',
                title: 'Países',
                subtitle: 'Países habilitados',
                actions: [{ icon: 'add', label: 'Agregar', action: 'add', type: 'page' }],
                actionsRows: [{ icon: 'edit', label: 'Editar', action: 'edit', type: 'modal' }],
                columns: [
                    { key: 'name', label: 'Nombre', type: 'text' },
                    { key: 'enabled', label: 'Habilitado', type: 'boolean' }
                ],
                form: RegionForms.CountryForm
            });

            const countries = await this.prisma.country.findMany({ where: { enabled: true } });

            pages.push({
                slug: 'city',
                title: 'Ciudades',
                subtitle: 'Ciudades por país',
                actions: [{ icon: 'add', label: 'Agregar', action: 'add', type: 'page' }],
                actionsRows: [{ icon: 'edit', label: 'Editar', action: 'edit', type: 'modal' }],
                columns: [
                    { key: 'name', label: 'Nombre', type: 'text' },
                    { key: 'country.name', label: 'País', type: 'text' },
                    { key: 'enabled', label: 'Habilitado', type: 'boolean' }
                ],
                form: RegionForms.CityForm,
                filters: [
                    { key: 'countryId', label: 'Filtrar por País', type: 'select', options: countries.map(c => ({ label: c.name, value: c.id })) }
                ]
            });
        }

        // 3. TALLERES
        const workshopSidebar: ObjectSidebar = {
            icon: 'tool',
            label: 'nav.workshops',
            path: '/workshop',
            slug: 'workshop-management',
            childs: []
        };

        if (isAdmin || isSupport) {
            workshopSidebar.childs.push({ icon: 'list', label: 'nav.workshop_list', path: '/workshop/workshop', slug: 'workshop' });
            workshopSidebar.childs.push({ icon: 'category', label: 'nav.categories', path: '/workshop/category', slug: 'workshop-category' });
        }

        if (isTaller) {
            workshopSidebar.childs.push({ icon: 'info', label: 'nav.my_workshop', path: '/dashboard/my-workshop', slug: 'my-workshop' });
            workshopSidebar.childs.push({ icon: 'post', label: 'nav.my_publications', path: '/dashboard/publication', slug: 'publication' });
        }

        sidebar.push(workshopSidebar);

        pages.push({
            slug: 'workshop',
            title: isAdmin ? 'Gestión de Talleres' : 'Talleres',
            subtitle: 'Administración de talleres mecánicos',
            actions: (isAdmin || isSupport) ? [{ icon: 'add', label: 'Agregar', action: 'add', type: 'page' }] : [],
            actionsRows: [{ icon: 'edit', label: 'Editar', action: 'edit', type: 'modal' }],
            columns: [
                { key: 'name', label: 'Nombre', type: 'text' },
                { key: 'city.name', label: 'Ciudad', type: 'text' },
                { key: 'enabled', label: 'Habilitado', type: 'boolean' }
            ],
            form: AppForms.WorkshopForm
        });

        if (isTaller) {
            pages.push({
                slug: 'my-workshop',
                title: 'Mi Taller',
                subtitle: 'Información de tu taller mecánico',
                actions: [], // No adding more workshops
                actionsRows: [{ icon: 'edit', label: 'Editar Informacion', action: 'edit', type: 'modal' }],
                columns: [
                    { key: 'name', label: 'Nombre', type: 'text' },
                    { key: 'city.name', label: 'Ciudad', type: 'text' },
                    { key: 'enabled', label: 'Habilitado', type: 'boolean' }
                ],
                form: AppForms.WorkshopForm
            });
        }

        pages.push({
            slug: 'workshop-category',
            title: 'Categorías',
            subtitle: 'Categorías de servicios',
            actions: [{ icon: 'add', label: 'Agregar', action: 'add', type: 'page' }],
            actionsRows: [{ icon: 'edit', label: 'Editar', action: 'edit', type: 'modal' }],
            columns: [
                { key: 'name', label: 'Nombre', type: 'text' },
                { key: 'enabled', label: 'Habilitado', type: 'boolean' }
            ],
            form: AppForms.WorkshopCategoryForm
        });

        pages.push({
            slug: 'publication',
            title: 'Publicaciones',
            subtitle: 'Ofertas y anuncios del taller',
            actions: [{ icon: 'add', label: 'Anunciar', action: 'add', type: 'page' }],
            actionsRows: [
                { icon: 'edit', label: 'Editar', action: 'edit', type: 'modal' },
                { icon: 'delete', label: 'Borrar', action: 'delete', type: 'modal' }
            ],
            columns: [
                { key: 'title', label: 'Título', type: 'text' },
                { key: 'enabled', label: 'Visible', type: 'boolean' },
                { key: 'createdAt', label: 'Fecha', type: 'date' }
            ],
            form: AppForms.PublicationForm
        });

        // 4. FORO (TODOS MENOS TALLER QUE YA TIENE SUS PUBLICACIONES)
        if (!isTaller) {
            const forumSidebar: ObjectSidebar = {
                icon: 'message',
                label: 'nav.public_forum',
                path: '/forum',
                slug: 'forum',
                childs: [
                    { icon: 'post', label: 'forum.post.title', path: '/forum/post', slug: 'forum-post' }
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
                { icon: 'edit', label: 'Editar', action: 'edit', type: 'modal' },
                isAdmin ? { icon: 'delete', label: 'Eliminar', action: 'delete', type: 'modal' } : null
            ].filter(Boolean) as any,
            columns: [
                { key: 'title', label: 'Título', type: 'text' },
                { key: 'user.firstName', label: 'Autor', type: 'text' },
                { key: 'enabled', label: 'Moderado', type: 'boolean' }
            ],
            form: AppForms.ForumPostForm
        });

        return {
            sidebar,
            pages
        }
    }
}
