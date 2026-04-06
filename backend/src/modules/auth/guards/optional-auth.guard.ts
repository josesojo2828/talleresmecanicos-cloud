import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Si hay un error o no hay usuario, retornamos null pero NO lanzamos UnauthorizedException
    return user || null;
  }
}
