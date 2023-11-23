import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			verify(req.headers.authorization.split(' ')[1], this.secret, (error, payload: JwtPayload) => {
				if (error) {
					next();
				} else if (payload) {
					req.user = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
