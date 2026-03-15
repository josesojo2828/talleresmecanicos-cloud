import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const startTime = request['startTime'];
        const duration = startTime ? `${(performance.now() - startTime).toFixed(2)}ms` : '0ms';
        const i18n = I18nContext.current(host);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let messageKey: string | string[] = 'Internal Server Error';
        let errorName = 'Error';

        // 1. Manejo de Errores HTTP (Los que lanzas tú: BadRequestException, etc)
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res: any = exception.getResponse();
            messageKey = res.message || exception.message;
            errorName = exception.name;
        }

        // 2. Manejo de Errores de Prisma (Base de datos)
        else if (exception instanceof PrismaClientKnownRequestError) {
            errorName = 'DatabaseError';

            // P2025: "An operation failed because it depends on one or more records that were required but not found"
            // Pasa cuando usas 'connect' con un ID que no existe.
            if (exception.code === 'P2025') {
                status = HttpStatus.NOT_FOUND;
                messageKey = 'error.db.relation_not_found'; // <--- Clave para tu JSON
            }
            // P2002: Unique constraint failed (Ej: Email duplicado que se escapó a tu validación manual)
            else if (exception.code === 'P2002') {
                status = HttpStatus.CONFLICT;
                messageKey = 'error.db.unique_constraint';
            }
        }

        // 3. Traducción
        let translatedMessage = messageKey;
        if (i18n && typeof messageKey === 'string') {
            translatedMessage = (i18n as any).t(messageKey);
        }

        response.status(status).json({
            body: null,
            status,
            message: translatedMessage,
            error: errorName,
            lang: i18n?.lang || 'es',
            duration: duration,
        });
    }
}