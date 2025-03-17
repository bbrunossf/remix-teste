import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXGJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXxfdHVQQmZfV0J+X0U=');

import type { MetaFunction } from "@remix-run/node";

import { useLoaderData } from '@remix-run/react'
import { useRef } from 'react';

import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-gantt/styles/material.css';
import '@syncfusion/ej2-grids/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-layouts/styles/material.css';
import '@syncfusion/ej2-lists/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-splitbuttons/styles/material.css';
import '@syncfusion/ej2-treegrid/styles/material.css';

import { GanttComponent } from '@syncfusion/ej2-react-gantt'
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data'
import { ColumnsDirective, ColumnDirective, Inject, Selection, AddDialogFieldsDirective, AddDialogFieldDirective, RowDD } from '@syncfusion/ej2-react-gantt';
import { Edit, Toolbar, ToolbarItem } from '@syncfusion/ej2-react-gantt';
import { DayMarkers, ContextMenu, Reorder, ColumnMenu, Filter, Sort } from '@syncfusion/ej2-react-gantt';

import { getTasks, getResources } from "~/utils/tasks";

//Ver como mapear os recursos e mostrar eles no campo de recursos do ganttcomponent
//Mudar a API para lidar com as solicitações

export async function loader() {
  const tasks = await getTasks();
  const resources = await getResources();
  //return { tasks, resources };
  console.log("Recursos encontrados:", resources);

//depois tem que mapear os campos
//mapear cada campo da tarefa para um objeto
const tasksWithId = tasks.map((task: any, index: number) => ({
  TaskID: task.id,
    taskName: task.taskName,
    StartDate: new Date(task.startDate),//.toISOString().split('T')[0],
    EndDate: new Date(task.endDate).toISOString().split('T')[0],
    Duration: task.duration,
    Progress: task.progress,
    parentId: task.parentId,
    Predecessor: task.predecessor,    
    notes: task.notes,
    Resources: task.resources.map((resource: any) => resource.id) // Map resource IDs
  }));
  console.log("tarefas FORMATADAS", tasksWithId);
return ({ tasks: tasksWithId, resources });
};

export default function GanttRoute() {  
  const ganttRef = useRef<GanttComponent>(null);
  const {tasks, resources} = useLoaderData<typeof loader>();
  
  if (tasks.length === 0) {
    console.log("Não há tarefas para exibir");
    };

//função para o botão de salvar
	const handleSaveButton = async () => {    
		const ganttInstance = ganttRef.current;
		const updatedData = ganttInstance?.dataSource;
		console.log('Dados para salvar:', updatedData);
		
		await fetch("/api/save-tasks", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updatedData),
	  });
  }

  
  // Configuração do DataManager com WebApiAdaptor
  // const dataManager = new DataManager({
    // url: '/api/tasks',
    // removeUrl: '/api/tasks',
    // adaptor: new WebApiAdaptor(),  
    // crossDomain: true    
  // })

  //para exibir a resposta do componente após uma ação
  const handleActionComplete = async (args: any) => {
    console.log("ActionComplete acionada");
    if (args.data) {
      console.log("Ação completada! (request e data):", args.requestType, args.data);
    }
    if (args) {
      console.log("Ação completada!! (=================args completo=============):", args);
    }
  }

  

  return (
    <div>
    <div style={{ margin: '20px' }}>
      <h1>Gerenciamento de Tarefas</h1>
      <h1>Gerenciamento de Tarefas</h1>
      <h1>Gerenciamento de Tarefas</h1>
      <h1>Gerenciamento de Tarefas</h1>
      <h1>Gerenciamento de Tarefas</h1>
      <GanttComponent
        ref={ganttRef}
        id='Default'
        //dataSource={tasks} //tem que mapear os campos primeiro
        actionComplete={handleActionComplete}

        //resourceFields: define o mapa de campos para os recursos
        resourceFields={{
          id: 'id',
          name: 'resourceName',
          unit: 'resourceRole'
        }}

        //taskFields: define o mapa de campos para as tarefas
        taskFields={{
          id: 'TaskID',
          name: 'taskName', //tem que ser name!
          startDate: 'StartDate',
          endDate: 'EndDate',
          duration: 'Duration',
          progress: 'Progress',
          parentID: 'parentId', //esse é a relação para dados flat 
          notes: 'Notes',
          //ainda não tenho coluna para o 'Resources'
          resourceInfo: 'Resources',
          //resourceInfo: 'ResourceInfo',
          //child: 'subtasks', //Não se usa o child, pois os dados são planos (flat)          
          dependency: 'Predecessor' //tem que ser 'dependency'; o da direita é o nome do campo no GanttComponent
        }}

        allowSelection={true}
        allowSorting={true} //classificar/ordenar as LINHAS ao clicar nos cabeçalhos das COLUNAS
        allowResizing={true} //redimensionar as COLUNAS
        allowReordering={true} //reordenar as COLUNAS
        allowRowDragAndDrop={true} //arrastar e soltar LINHAS
        allowTaskbarDragAndDrop={true} //arrastar e soltar TAREFAS
        enableContextMenu={true}

        //editSettings são relacionadas a alterações nas tarefas
        editSettings={{
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          //habilitar a caixa de confirmação para excluir
          showDeleteConfirmDialog: true,
          allowTaskbarEditing: true
        }}

        toolbar={['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Indent', 'Outdent']}
        height="650px"
      >
        {/* campos a serem exibidos na caixa de diálogo de Adicionar. Se não declarar aqui, e não tiver campo para tal, não aparece.
    Se não for especificado, os campos derivam dos valores de 'taskSettings' e 'columns'*/}
        <AddDialogFieldsDirective>
          <AddDialogFieldDirective type='General' headerText='General'></AddDialogFieldDirective>
          <AddDialogFieldDirective type='Dependency'></AddDialogFieldDirective>
          <AddDialogFieldDirective type='Resources'></AddDialogFieldDirective> {/* ainda não tenho coluna para o 'Resources', então não aparece, mesmo colocando aqui */}
          <AddDialogFieldDirective type='Notes'></AddDialogFieldDirective>
        </AddDialogFieldsDirective>


        <Inject services={[Selection, Edit, Toolbar, DayMarkers, ContextMenu, Reorder, ColumnMenu, Filter, Sort, RowDD]} />
      </GanttComponent>
    </div>
        <button onClick={handleSaveButton} className="bg-blue-500 text-white p-2 rounded">
          Salvar Alterações
        </button>
    </div>
  )
}