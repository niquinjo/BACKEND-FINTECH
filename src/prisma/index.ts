import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL!}`

const adapter = new PrismaPg({ connectionString })

const prismaClient = new PrismaClient({
  adapter
});

export default prismaClient;

//vai servir para exportar/manipular a instancia do prisma client, para evitar de ter que criar uma nova instancia toda vez que for usar o prisma, e também para centralizar a configuração do prisma em um único lugar.