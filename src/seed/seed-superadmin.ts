import { PrismaClient as TenantClient } from '../../prisma/generated/tenant';
const prisma = new TenantClient();

async function main() {
    const adminEmail = 'admin-openlab@uninorte.edu.co';

    const user = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin',
            password: '$2b$10$jctAqZetHwVNzEyLab0FyerVE9dKTekBxe2ahK39LNGreG5D1Z/V6',
            isVerified: true,
            role: 'superadmin',
        },
    });

    console.log(`Superadmin creado: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
