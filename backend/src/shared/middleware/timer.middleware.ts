// src/shared/middleware/timer.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TimerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Guardamos el performance.now() en el objeto request
        // Usamos performance.now() para mayor precisión en milisegundos
        req['startTime'] = performance.now();
        next();
    }
}