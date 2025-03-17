//função que será usada no loader e nas requisições GET
import { prisma } from "~/db.server";

export async function getTasks() {
  return await prisma.tasks.findMany({
    orderBy: { id: "asc" },  // Garante a ordenação
  });
}

export async function getResources() {
  return await prisma.taskResource.findMany({
    orderBy: { id: "asc" },  // Garante a ordenação
  });
}