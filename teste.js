import  { PrismaClient } from  '@prisma/client';
const prisma = new PrismaClient();

async function createTaskWithResource() {
  // 1. Criar a tarefa
  const newTask = await prisma.tasks.create({
    data: {
      taskName: 'Nome da Tarefa',
      startDate: new Date(),
      endDate: new Date(),
    }
  });

  // 2. Associar o recurso à tarefa na tabela TaskResourceAssignment
  const resourceAssignment = await prisma.taskResourceAssignment.create({
    data: {
      taskId: newTask.id, // ID da tarefa criada
      taskResourceId: 3, // ID do recurso existente
    }
  });

  console.log('Tarefa criada com sucesso:', newTask);
  console.log('Associação de recurso criada com sucesso:', resourceAssignment);
}

createTaskWithResource()
  .catch((e) => {
    console.error('Erro ao criar a tarefa ou associação:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });