// src/routes/tasks.js
import { prisma } from "../db.server"; // ajuste o caminho de importação conforme sua estrutura
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const action = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());

  const taskName = formData.get("taskName");
  const startDate = new Date(formData.get("startDate"));
  const endDate = new Date(formData.get("endDate"));
  const duration = parseFloat(formData.get("duration"));
  const notes = formData.get("notes");
  const resourceName = formData.get("resourceName");
  const resourceRole = formData.get("resourceRole");

  // Criar a nova tarefa e associar o recurso
  await prisma.tasks.create({
    data: {
      taskName,
      startDate,
      endDate,
      duration,
      notes,
      progress: 0.0,
      predecessor: null,
      resources: {
        create: {                      
            resourceName,
            resourceRole
          },          
        },
      }
    },
  );

  return redirect("/cadastrar"); // Redireciona para uma página de listagem ou sucesso
};

export default function NewTask() {
    return (
        <Form method="post" className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col">
                <label htmlFor="taskName" className="mb-2 font-medium text-gray-700">Nome da Tarefa:</label>
                <input 
                    type="text" 
                    name="taskName" 
                    required 
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="startDate" className="mb-2 font-medium text-gray-700">Data de Início:</label>
                <input 
                    type="date" 
                    name="startDate" 
                    required 
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="endDate" className="mb-2 font-medium text-gray-700">Data de Término:</label>
                <input 
                    type="date" 
                    name="endDate" 
                    required 
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="duration" className="mb-2 font-medium text-gray-700">Duração:</label>
                <input 
                    type="number" 
                    step="1" 
                    name="duration" 
                    required 
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="notes" className="mb-2 font-medium text-gray-700">Notas:</label>
                <textarea 
                    name="notes" 
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
            </div>
            <div className="flex flex-col">
                <label htmlFor="resourceName" className="mb-2 font-medium text-gray-700">Nome do Recurso:</label>
                <input 
                    type="text" 
                    name="resourceName" 
                    required 
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="resourceRole" className="mb-2 font-medium text-gray-700">Função do Recurso:</label>
                <input 
                    type="text" 
                    name="resourceRole" 
                    required 
                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Criar Tarefa
            </button>
        </Form>
    );
}