import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IUsersService } from './users.service.interface';
import { UsersService } from './users.service';
import { UserModel } from '@prisma/client';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUsersService;

beforeAll(() => {
	container.bind<IUsersService>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	usersService = container.get<IUsersService>(TYPES.UsersService);
	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('Should create user', async () => {
		configService.get = jest.fn().mockResolvedValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		createdUser = await usersService.createUser({
			email: 'test@gmail.com',
			name: 'John',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('Should validate user, success password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'test@gmail.com',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('Should validate user, wrong password ', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await usersService.validateUser({
			email: 'test@gmail.com',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('Should validate user, wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'test@gmail.com',
			password: '2',
		});
		expect(res).toBeFalsy();
	});
});
