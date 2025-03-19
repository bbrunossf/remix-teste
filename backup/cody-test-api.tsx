export const action: ActionFunction = async ({ request }) => {
  try {
    const { updatedData, deletedTasks, resourceChanges } = await request.json();

    console.log("Método HTTP:", request.method);        
    console.log("URL:", request.url);    
    console.log("Dados recebidos (atualizados):", updatedData);
    console.log("Dados recebidos (excluídos):", deletedTasks);
    console.log("Alterações de recursos:", resourceChanges);

    // Process deleted tasks
    for (const task of deletedTasks) {
      await prisma.tasks.delete({
        where: { id: task.TaskID },
      });
      console.log(`Tarefa excluída: ID ${task.TaskID}`);
    }
    
    // Process each task for update or insert
    for (const task of updatedData) {
      // Upsert the task
      const upsertedTask = await prisma.tasks.upsert({
          where: { id: task.TaskID },
          update: {
              taskName: task.taskName,
              startDate: new Date(task.StartDate),
              endDate: new Date(task.EndDate),
              duration: task.Duration,
              progress: task.Progress || 0,
              predecessor: task.Predecessor,
              parentId: task.parentId || undefined,
              taskResources: task.Resources.id,
              notes: task.notes,
          },
          create: {
              taskName: task.taskName,
              startDate: new Date(task.StartDate),
              endDate: new Date(task.EndDate),
              duration: task.Duration,
              progress: task.Progress || 0,
              predecessor: task.Predecessor,
              parentId: task.parentId || undefined,
              taskResources: task.Resources.id,
              notes: task.notes,
          },
      });
      
      console.log("=================Relação de recursos associados à tarefa:", task.Resources);
      
      // First, delete all existing resource assignments for this task if there are changes
      const taskResourceChange = resourceChanges.find(change => change.taskId === task.TaskID);
      if (taskResourceChange) {
        // Option 1: Delete all and recreate (simpler approach)
        await prisma.taskResourceAssignment.deleteMany({
          where: { taskId: upsertedTask.id }
        });
        
        // Then create new assignments for all current resources
        for (const resourceId of task.Resources) {
          await prisma.taskResourceAssignment.create({
            data: {
              taskId: upsertedTask.id,
              taskResourceId: resourceId.id,
            }
          });
        }
      } else {
        // If no changes detected, use the original upsert approach for each resource
        for (const resourceId of task.Resources) {
          await prisma.taskResourceAssignment.upsert({
            where: { 
              taskId_taskResourceId: { 
                taskId: upsertedTask.id, 
                taskResourceId: resourceId.id 
              } 
            },
            update: {},
            create: {
              taskId: upsertedTask.id,
              taskResourceId: resourceId.id,
            },
          });
        }
      }
    }        
    return json({ success: true });
  } catch (error) {
    console.error("Error saving tasks:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};