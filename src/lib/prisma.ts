import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ['query']
}) // faz a conexão com o banco de dados o EXPORT faz com que ele possa ser acessado em outros locais
