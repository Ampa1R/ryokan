import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

import appConfig from './app.config';
import dbConfig from './db.config';
import { Config } from './base';

const logger = new Logger('Config');

const configurations: Config[] = [appConfig, dbConfig];

const validate = <T extends object, V>(
  schema: ClassConstructor<T>,
  config: V,
): string[] => {
  const errors: string[] = [];
  const instance = plainToInstance(schema, config, {
    enableImplicitConversion: true,
  });
  const validationErrors = validateSync(instance, {
    skipMissingProperties: false,
  });
  if (validationErrors.length > 0) {
    validationErrors.forEach((error) => {
      if (!error.constraints) {
        return;
      }
      Object.values(error.constraints).forEach((constraint) => {
        logger.error(constraint);
        errors.push(constraint);
      });
    });
  }
  return errors;
};

setTimeout(() => {
  const errors = [];
  for (const configuration of configurations) {
    errors.push(...validate(configuration.schema, configuration.factory()));
  }
  if (errors.length > 0) {
    process.exit(1);
  }
}, 0);

export default {
  load: configurations.map(({ name, factory }) => registerAs(name, factory)),
};
