import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '../../generated/i18n.generated';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const startTime = request['startTime'];

        return next.handle().pipe(
            map((data) => {
                // 2. AGREGA EL GENÉRICO AQUÍ:
                const i18n = I18nContext.current<I18nTranslations>(context);

                let messageKey = 't.success.default';
                let body = data;

                if (data && typeof data === 'object' && 'message' in data) {
                    messageKey = data.message;
                    body = data.data !== undefined ? data.data : data;

                }

                // 3. QUITA EL 'as any'. Ahora TypeScript te autocompletará las claves:
                const translatedMessage = i18n ? i18n.t(messageKey as any) : messageKey;

                return {
                    body: body,
                    status: context.switchToHttp().getResponse().statusCode,
                    message: translatedMessage,
                    lang: i18n?.lang || 'es',
                    duration: startTime ? `${(performance.now() - startTime).toFixed(2)}ms` : '0ms',
                };
            }),
        );
    }
}