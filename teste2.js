import  { PrismaClient } from  '@prisma/client';
const prisma = new PrismaClient();

let taskResourceId = 3;

async function createTaskWithResource() {
  // 1. Criar a tarefa
  const task = await prisma.tasks.upsert({
      where: { id: 7 }, // Se taskId não for fornecido, usa 0 para criação
      update: { // Atualiza se a tarefa já existe
        taskName: 'xxx',
        startDate: new Date(),
        endDate: new Date(),
      },
      create: { // Cria se a tarefa não existe
        taskName: 'xx3',
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    // Associar o recurso à tarefa
    const resourceAssignment = await prisma.taskResourceAssignment.upsert({
      where: { taskId_taskResourceId: { taskId: task.id, taskResourceId } }, // Chave composta
      update: {}, // Não há alterações necessárias para atualização
      create: { // Cria a associação se não existir
        taskId: task.id,
        taskResourceId,
      },
    });

  console.log('Tarefa criada com sucesso:', task);
  console.log('Associação de recurso criada com sucesso:', resourceAssignment);
}

createTaskWithResource()
  .catch((e) => {
    console.error('Erro ao criar a tarefa ou associação:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });