import { ClassConstructor } from "class-transformer";

export interface Config {
  name: string;
  factory: () => Record<string, any>,
  schema: ClassConstructor<object>,
}
