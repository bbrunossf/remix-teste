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

import { getTasks, getResources, getUsedResources } from "~/utils/tasks";
import { PropertyPane } from '~/utils/propertyPane';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';


//Ver como mapear os recursos e mostrar eles no campo de recursos do ganttcomponent
//Mudar a API para lidar com as solicitações

export async function loader() {
  const tasks = await getTasks();
  const resources = await getResources();
  const usedResources = await getUsedResources();
  //return { tasks, resources };
  //console.log("Recursos encontrados:", resources); //devolve uma lista/array de recursos (dicts), com todos os campos id, resourceName, resourceRole
  console.log("Recursos usados:", JSON.stringify(usedResources)); //devolve uma lista/array de recursos (dicts), com todos os campos id, resourceName, resourceRole

//depois tem que mapear os campos
//mapear cada campo da tarefa para um objeto
const tasksWithId = tasks.map((task: any, index: number) => ({
  TaskID: task.id,
    taskName: task.taskName,
    StartDate: new Date(task.startDate),//.toISOString().split('T')[0],
    EndDate: new Date(task.endDate),//.toISOString().split('T')[0],
    Duration: task.duration,
    Progress: task.progress,
    parentId: task.parentId,
    Predecessor: task.predecessor,    
    notes: task.notes,
    //Resources: resources.map((resource: any) => resource.id) // Map resource IDs, mas aparece todos os recursos em cada tarefa, e é o que é passado para a API
    //Resources: resources.map((resource: any) => resource.id) //não achei esse campo na documentação ainda
    //Resources: task.taskResources    
    //Resources: resources.map((resource: any) => resource.resourceName)
    Resources: usedResources[index].taskResources.map((resource: any) => resource.taskResourceId)
  }));
  
  // Map resources to match the GanttComponent's resourceFields
  const formattedResources = resources.map((resource: any) => ({
    id: resource.id,
    resourceName: resource.resourceName,
    resourceRole: resource.resourceRole,
  }));

  console.log("tarefas FORMATADAS", tasksWithId);
  //console.log("Recursos formatados:", formattedResources); //devolve uma lista/array de recursos (dicts), com todos os campos id, resourceName, resourceRole
return ({ tasks: tasksWithId, resources: formattedResources });
};

export default function GanttRoute() {  
  const ganttRef = useRef<GanttComponent>(null);
  const {tasks, resources} = useLoaderData<typeof loader>();
  
  if (tasks.length === 0) {
    console.log("Não há tarefas para exibir");
    };

  const deletedTasks: any[] = []; // Track deleted tasks globally or in a state
  //função para o botão de salvar
	const handleSaveButton = async () => {
    try {    
      const ganttInstance = ganttRef.current;
      const updatedData = ganttInstance?.dataSource;

      console.log('Dados para salvar:', updatedData);
      console.log('Tarefas excluídas:', deletedTasks);
      
      const response = await fetch("/api/save-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updatedData, deletedTasks }), // Send both updated and deleted tasks
    });

    if (response.ok) {
      alert("Dados salvos com sucesso!"); // Exibe mensagem de sucesso
    } else {
      alert("Erro ao salvar os dados. Tente novamente."); // Exibe mensagem de erro
    }
  } catch (error) {
    console.error("Erro ao salvar os dados:", error);
    alert("Ocorreu um erro ao salvar os dados. Verifique o console para mais detalhes.");
  }
  };

  
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
    if (args.requestType === 'delete') {
      deletedTasks.push(...args.data); // Add deleted tasks to the array
      console.log('Tarefas excluídas:', deletedTasks);
    }  
  }

  
  let filterType: { [key: string]: Object }[] = [
    { text: 'Shimmer', value: 'Shimmer' },
    { text: 'Spinner', value: 'Spinner' }
  ];
  const onChange = (sel) => {
    let type: any = sel.value.toString();
    if (type === "Shimmer") {
      ganttRef.current.loadingIndicator.indicatorType = "Shimmer";
      ganttRef.current.enableVirtualMaskRow = true;
      ganttRef.current.refresh();
    } else {
      ganttRef.current.loadingIndicator.indicatorType = "Spinner";
      ganttRef.current.enableVirtualMaskRow = false;
      ganttRef.current.refresh();
    }
  }
  const loadingIndicator = {
    indicatorType: 'Shimmer'
};
  
// incluir variável para receber oe eventos da Agenda e mostrar no PropertyPane
  

  return (
    <div className='control-pane'>
    <div className='col-md-9'>
      <GanttComponent
        ref={ganttRef}
        id='Default'
        dataSource={tasks} //com os campos mapeados
        resources={resources} //relaciona aqui os recursos que aparecem no campo de recursos do ganttcomponent, senão fica vazio
        actionComplete={handleActionComplete}

        resourceIDMapping='id'
        //viewType='ResourceView' //fica muito feio, agrupado por recursos

        //resourceFields: define o mapa de campos para os recursos
        resourceFields={{
          id: 'id',
          name: 'resourceName',
          group: 'resourceRole',
          //não tenho um campo para Unit na tabela no banco de dados
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
          notes: 'notes',          
          resourceInfo: 'Resources', //resourceInfo precisa ter para aparecer na caixa de diálogo, senão nem aparece. 
          //resourceInfo:'Resources' aparece todos os recursos selecionados para a tarefa
          //resourceInfo: 'resource' aparece os recursos selecionados para a tarefa, mas nenhum selecionado ?
          //parece que tem ser o mesmo  valor colocado em ColumnDirective (mas eu não coloquei)
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
    <div className='col-md-3 property-section'>
        <PropertyPane title='Properties'>
          <table id='property' title='Properties' className='property-panel-table' style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', paddingLeft: 0 }}>
                <div style={{ paddingTop: '10px', paddingLeft: 0 }}> Indicator Type </div>
              </td>
              <td style={{ width: '70%' }}>
                <div>
                  <DropDownListComponent width="113px" id="seltype" change={onChange.bind(this)} dataSource={filterType} value="Shimmer"/>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </PropertyPane>
    </div>
        <button onClick={handleSaveButton} className="bg-blue-500 text-white p-2 rounded">
          Salvar Alterações
        </button>
  </div>
  )
}