import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadForumService {
    private readonly logger = new Logger(LoadForumService.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    public async execute() {
        this.logger.log('FORO SEED: Comenzando seeding de foro...');
        
        const users = await this.prisma.user.findMany({ take: 5 });
        if (users.length === 0) {
            this.logger.warn('FORO SEED: No se encontraron usuarios para crear publicaciones.');
            return;
        }

        this.logger.log(`FORO SEED: Se encontraron ${users.length} usuarios.`);

        const forumPosts = [
            {
                title: '¿Cuál es el mejor aceite para un motor turbo?',
                content: 'Hola a todos, acabo de comprar un coche con motor turbo y me pregunto qué marca y viscosidad de aceite recomiendan para climas cálidos.',
                userId: users[0].id,
                enabled: true,
                comments: [
                    { content: 'Yo uso 5W-30 sintético de marca reconocida, me ha funcionado bien.', userId: users[1].id },
                    { content: 'Depende mucho del manual del fabricante, revísalo primero.', userId: users[2].id }
                ]
            },
            {
                title: 'Mi coche hace un ruido extraño al frenar',
                content: 'Es un chillido agudo cada vez que piso el pedal. ¿Serán las pastillas o los discos?',
                userId: users[1].id,
                enabled: true,
                comments: [
                    { content: 'Probablemente sean las pastillas desgastadas. Cámbialas pronto para no dañar los discos.', userId: users[0].id }
                ]
            },
            {
                title: 'Recomendación de talleres en CDMX',
                content: 'Busco un taller honesto y que sepa de transmisiones automáticas en la zona sur.',
                userId: users[2].id,
                enabled: true,
                comments: []
            },
            {
                title: 'El check engine se encendió hoy',
                content: 'Escaneé el código y me sale P0420. ¿Alguien sabe si es grave?',
                userId: users[3].id || users[0].id,
                enabled: true,
                comments: [
                    { content: 'Ese código suele ser el catalizador, pero podría ser un sensor de oxígeno.', userId: users[1].id }
                ]
            }
        ];

        let createdCount = 0;
        this.logger.log(`FORO SEED: Procesando ${forumPosts.length} publicaciones predefinidas...`);
        
        for (const post of forumPosts) {
            const existing = await this.prisma.forumPost.findFirst({
                where: { title: post.title }
            });

            if (!existing) {
                const { comments, ...postData } = post;
                const newPost = await this.prisma.forumPost.create({
                    data: {
                        ...postData,
                        comments: {
                            create: comments.map(c => ({
                                ...c,
                                enabled: true
                            }))
                        }
                    }
                });
                createdCount++;
                
                // Add some initial likes
                await this.prisma.forumLike.createMany({
                    data: users.slice(0, 2).map(u => ({
                        userId: u.id,
                        postId: newPost.id
                    })),
                    skipDuplicates: true
                });
            } else {
                this.logger.debug(`FORO SEED: La publicación "${post.title}" ya existe.`);
            }
        }

        if (createdCount > 0) {
            this.logger.log(`FORO SEED: ${createdCount} publicaciones nuevas creadas.`);
        } else {
            this.logger.log(`FORO SEED: No se crearon nuevas publicaciones (ya existen o error).`);
        }
    }
}
