import { ValueProvider } from '../types/provider';
import { Token } from '../types/token';

// eslint-disable-next-line no-shadow
export enum LoggerLevel {
  OFF = 0,
  FATAL = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
  TRACE = 6,
  ALL = 7,
}

export const LOGGER_LEVEL: Token<LoggerLevel> = Symbol('LOGGER_LEVEL');

export const LoggerLevelProvider: ValueProvider<LoggerLevel> = {
  provide: LOGGER_LEVEL,
  useValue: LoggerLevel.ALL,
};