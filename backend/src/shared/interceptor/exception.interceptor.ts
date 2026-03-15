import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const startTime = request['startTime'];
        const duration = startTime ? `${(performance.now() - startTime).toFixed(2)}ms` : '0ms';
        const i18n = I18nContext.current(host);

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let messageKey: string | string[] = 'common.error.generic';
        let errorName = 'InternalServerError';

        // 1. Extraer la ubicación del error (Archivo y Línea)
        const errorSource = this.extractErrorSource(exception);

        // =====================================================
        // MANEJO DE TIPOS DE ERRORES
        // =====================================================
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res: any = exception.getResponse();
            messageKey = res.message || exception.message;
            errorName = exception.name;
        } 
        else if (exception instanceof PrismaClientKnownRequestError) {
            errorName = 'DatabaseError';
            switch (exception.code) {
                case 'P2025': status = HttpStatus.NOT_FOUND; messageKey = 't.error.db.relation_not_found'; break;
                case 'P2002': status = HttpStatus.CONFLICT; messageKey = 't.error.db.unique_constraint'; break;
                case 'P2003': status = HttpStatus.CONFLICT; messageKey = 't.error.db.foreign_key_constraint'; break;
                case 'P2023': status = HttpStatus.BAD_REQUEST; messageKey = 't.error.db.invalid_data'; break;
                default: break;
            }
        }

        // =====================================================
        // LOG DETALLADO EN CONSOLA
        // =====================================================
        const logContent = {
            method: request.method,
            url: request.url,
            status: status,
            source: errorSource, // <-- Ubicación exacta
            message: exception.message || exception
        };

        if (status >= 500) {
            this.logger.error(`[CRITICAL] ${request.method} ${request.url}`, exception.stack);
        } else {
            this.logger.warn(`[HANDLER] ${request.method} ${request.url} - Source: ${errorSource}`);
        }

        // =====================================================
        // TRADUCCIÓN Y RESPUESTA
        // =====================================================
        let translatedMessage = messageKey;
        if (i18n && typeof messageKey === 'string') {
            translatedMessage = (i18n as any).t(messageKey);
        }

        response.status(status).json({
            body: null,
            status,
            message: translatedMessage,
            error: errorName,
            source: process.env.NODE_ENV === 'development' ? errorSource : undefined, // Solo mostrar en dev
            lang: i18n?.lang || 'es',
            duration: duration,
        });
    }

    /**
     * Analiza el stack trace para encontrar el primer archivo de tu proyecto (src) 
     * que originó la excepción, ignorando node_modules.
     */
    private extractErrorSource(exception: any): string {
        const stack = exception.stack;
        if (!stack) return 'Unknown Source';

        // Buscamos la primera línea del stack que contenga archivos de tu carpeta 'src' o similar
        const lines = stack.split('\n');
        const projectLine = lines.find((line: string) => 
            (line.includes('/src/') || line.includes('\\src\\')) && 
            !line.includes('node_modules')
        );

        if (projectLine) {
            // Extraer lo que está entre paréntesis o después de "at "
            const match = projectLine.match(/(?:at\s+)?(?:.*\((.*)\)|(.*))/);
            const rawPath = match ? (match[1] || match[2]) : projectLine;
            
            // Limpiar la ruta para que sea más legible (opcional)
            return rawPath.trim();
        }

        return 'Internal/Library Source';
    }
}
