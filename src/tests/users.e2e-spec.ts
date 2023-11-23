import request from 'supertest';
import { App } from '../app';
import { boot } from '../main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Should get error after registration with wrong credentials', async () => {
		const res = await request(application.app).post('/users/register').send({
			email: 'test@gmail.com',
			password: '1',
		});
		expect(res.statusCode).toBe(422);
	});

	it('Should get success after login', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@gmail.com',
			password: '123',
		});
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Should get error after login with wrong credentials', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'test@gmail.com',
			password: '1',
		});
		expect(res.statusCode).toBe(401);
	});

	it('Should get success after getting user info', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'test@gmail.com',
			password: '123',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('test@gmail.com');
	});

	it('Should get error after getting user info with wrong credentials', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'test@gmail.com',
			password: '1',
		});
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
