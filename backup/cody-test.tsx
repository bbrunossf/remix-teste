import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXGJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXxfdHVQQmZfV0J+X0U=');

import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react'
import { useRef, useState, useEffect } from 'react';

// [existing imports remain the same]

export default function GanttRoute() {  
  const ganttRef = useRef<GanttComponent>(null);
  const {tasks, resources} = useLoaderData<typeof loader>();
  
  // Track deleted tasks globally
  const [deletedTasks, setDeletedTasks] = useState<any[]>([]);
  
  // Track original resource assignments to compare with changes
  const [originalResourceAssignments, setOriginalResourceAssignments] = useState<any[]>([]);
  
  // Track resource assignment changes
  const [resourceAssignmentChanges, setResourceAssignmentChanges] = useState<any[]>([]);
  
  // Initialize original resource assignments when component loads
  useEffect(() => {
    if (tasks.length > 0) {
      const initialAssignments = tasks.map(task => ({
        taskId: task.TaskID,
        resources: [...(task.Resources || [])]
      }));
      setOriginalResourceAssignments(initialAssignments);
    }
  }, [tasks]);

  if (tasks.length === 0) {
    console.log("Não há tarefas para exibir");
  }

  // Function to detect resource assignment changes
  const detectResourceChanges = (updatedData: any[]) => {
    const changes: any[] = [];
    
    updatedData.forEach(task => {
      const originalTask = originalResourceAssignments.find(t => t.taskId === task.TaskID);
      
      if (originalTask) {
        // Find resources that were removed
        const removedResources = originalTask.resources.filter(
          (resId: any) => !task.Resources.some((res: any) => res.id === resId.id)
        );
        
        // Find resources that were added
        const addedResources = task.Resources.filter(
          (res: any) => !originalTask.resources.some((origRes: any) => origRes.id === res.id)
        );
        
        if (removedResources.length > 0 || addedResources.length > 0) {
          changes.push({
            taskId: task.TaskID,
            removedResources,
            addedResources,
            currentResources: task.Resources
          });
        }
      }
    });
    
    return changes;
  };

  // Function for the save button
  const handleSaveButton = async () => {    
    const ganttInstance = ganttRef.current;
    const updatedData = ganttInstance?.dataSource as any[];

    console.log('Dados para salvar:', updatedData);
    console.log('Tarefas excluídas:', deletedTasks);
    
    // Detect resource assignment changes
    const resourceChanges = detectResourceChanges(updatedData);
    console.log('Alterações de recursos:', resourceChanges);
    
    await fetch("/api/save-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        updatedData, 
        deletedTasks,
        resourceChanges 
      }),
    });
    
    // Update original assignments after saving
    if (updatedData) {
      const newAssignments = updatedData.map(task => ({
        taskId: task.TaskID,
        resources: [...(task.Resources || [])]
      }));
      setOriginalResourceAssignments(newAssignments);
    }
  }

  // Handle action complete event
  const handleActionComplete = async (args: any) => {
    console.log("ActionComplete acionada");
    if (args.data) {
      console.log("Ação completada! (request e data):", args.requestType, args.data);
    }
    
    if (args) {
      console.log("Ação completada!! (=================args completo=============):", args);
    }
    
    if (args.requestType === 'delete') {
      setDeletedTasks(prev => [...prev, ...args.data]);
      console.log('Tarefas excluídas:', deletedTasks);
    }
    
    // Track resource changes when editing tasks
    if (args.requestType === 'save' && args.action === 'edit') {
      const ganttInstance = ganttRef.current;
      const currentData = ganttInstance?.dataSource as any[];
      
      // Check for resource changes in the edited task
      if (currentData && args.data) {
        const editedTask = args.data;
        const originalTask = originalResourceAssignments.find(t => t.taskId === editedTask.TaskID);
        
        if (originalTask) {
          // Check if resources have changed
          const resourcesChanged = !areResourcesEqual(originalTask.resources, editedTask.Resources);
          
          if (resourcesChanged) {
            console.log('Recursos alterados para a tarefa:', editedTask.TaskID);
            console.log('Recursos originais:', originalTask.resources);
            console.log('Novos recursos:', editedTask.Resources);
          }
        }
      }
    }
  }
  
  // Helper function to compare resource arrays
  const areResourcesEqual = (resources1: any[], resources2: any[]) => {
    if (resources1.length !== resources2.length) return false;
    
    const sortedRes1 = [...resources1].sort((a, b) => a.id - b.id);
    const sortedRes2 = [...resources2].sort((a, b) => a.id - b.id);
    
    return sortedRes1.every((res, index) => res.id === sortedRes2[index].id);
  };

  // [Rest of the component remains the same]
  
  return (
    // [Existing JSX remains the same]
  )
}