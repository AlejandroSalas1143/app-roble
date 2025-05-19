import { Injectable } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class DbAdminService {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'postgres',
        });
    }

    async dropDatabase(dbName: string): Promise<void> {
        // Terminar conexiones activas excepto la actual
        await this.pool.query(
            `
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1
      AND pid <> pg_backend_pid();
    `,
            [dbName]
        );

        // Ahora sí se puede eliminar la base de datos
        await this.pool.query(`DROP DATABASE IF EXISTS "${dbName}"`);
    }

}