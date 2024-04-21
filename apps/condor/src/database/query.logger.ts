import { Logger } from '@nestjs/common';

import { Logger as TypeORMLogger } from 'typeorm';

export class DatabaseQueryLogger implements TypeORMLogger {
  private logger = new Logger(DatabaseQueryLogger.name);

  logQuery(query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
    this.logger.debug('query' + ': ' + sql);
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
    this.logger.debug('query failed: ' + sql);
    this.logger.debug(error, 'error:');
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const sql = query + (parameters && parameters.length ? ' -- PARAMETERS: ' + this.stringifyParams(parameters) : '');
    this.logger.debug('query is slow: ' + sql);
    this.logger.debug('execution time: ' + time);
  }

  logSchemaBuild(message: string) {
    this.logger.debug(message);
  }

  logMigration(message: string) {
    this.logger.debug(message);
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        this.logger.debug(message);
        break;
      case 'info':
        this.logger.log(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }

  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
