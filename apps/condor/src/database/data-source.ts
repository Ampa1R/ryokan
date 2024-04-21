import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import dbConfig from '../config/db.config';

dotenv.config();

export default new DataSource(dbConfig.factory());
