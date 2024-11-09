import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    // dropSchema: true,
    synchronize: true,
    logging: false,
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    migrations: [join(__dirname, '..', 'migrations', '*{.js,.ts}')],
};

export default registerAs('typeorm', () => config);