import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF1cXGJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXxfdHVQQmZfV0J+X0U=');

import type { MetaFunction } from "@remix-run/node";

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


export default function GanttRoute() {  
  const ganttRef = useRef<GanttComponent>(null);

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
        //dataSource={formattedTasks} //primeira fonte de dados vem do loader                
        actionComplete={handleActionComplete}

        //resourceFields: define o mapa de campos para os recursos
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
          //resources: 'Resources',
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