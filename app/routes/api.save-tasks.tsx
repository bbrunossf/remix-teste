import { data, json } from '@remix-run/node'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { getTasks } from "~/utils/tasks";

export const action: ActionFunction = async ({ request, params }) => {
//export async function action({ request }) {
    try {
      const data = await request.json();
      const method = request.method; // Obtém o método HTTP
      console.log("Método chamado:", method);
      console.log("dados raw:", data);        
      console.log("Método HTTP:", method);        
      console.log("URL:", request.url); // detalhes da requisição

      if (method === "POST") {
        return Response.json({ answer: "nada a declarar POST" });
      }      
      else if (method === "PUT") {
        return Response.json({ answer: "nada a declarar PUT" });
      }
      else if (method === "DELETE") {
        return Response.json({ answer: "nada a declarar DELETE" });
      }      
  } catch (error) {
    console.error("Erro!!!!!!:", error);
    return data(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}

export const loader: LoaderFunction = async ({ request }) => {
    console.log("Solicitação GET no servidor=====");
    //chamar a função que retorna os dados    
      const tasks = await getTasks();
      return { tasks };
      //depois tem que mapear os campos
    };