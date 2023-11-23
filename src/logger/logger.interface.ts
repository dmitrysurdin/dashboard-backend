import { ILogObj, Logger } from 'tslog';

export interface ILogger {
	logger: Logger<ILogObj>;
	log: (...arg: unknown[]) => void;
	error: (...arg: unknown[]) => void;
	warn: (...arg: unknown[]) => void;
}
