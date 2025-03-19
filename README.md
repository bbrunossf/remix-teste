# Criando um cronograma com a biblioteca SyncFusion

## Resumo

Este projeto tem como objetivo criar uma aplicação web com um gráfico de Gantt personalizado, usando dados de um banco de dados SQLite. Por permitir a relação entre tarefas e recursos, facilita a criação de cenários para priorizar tarefas. A aplicação é feita com o framework Remix


## Objetivo
Softwares mais simples de gerenciamento de projetos não oferecem visualização de Gantt agradáveis e iterativas. Softwares comerciais, como o MS-Project, são caros e possuem funcionalidades restritas que podem não ser suficientes para o método de trabalho da empresa. A solução foi buscar bibliotecas prontas para esse fim, que funcionassem com customização suficiente para integrar as informações desejadas.
Este projeto ajuda visualizar o horizonte de trabalho e tempo decorrido necessário para o cumprimento das tarefas, com os recusos disponíveis.


## Tecnologias Utilizadas
Este projeto foi elaborado usando Remix.  
As principais bibliotecas utilizadas foram:  
- SyncFusion, para a criação do gráfico de Gantt;
- Prisma ORM, para manipulação do banco de dados;
- Banco de dados SQLite, hospedado localmente.


## Descrição das rotas e arquivos acessórios


> * utils/tasks.ts: utilitário que possui funções usando os recursos do Prisma;    
> * utils/db.server.ts: utilitário que faz a conexão com o Prisma e fornece esse elemento para outros componentes. Possui um log que é exibido no console do cliente;  
  
> routes/  
>   * _index.tsx: gráfico de Gantt e botão de Salvar, que envia os dados para a API;   
>   * api.tasks.ts: utilitário que consulta o banco de dados e retorna as informações para as funções de loader presentes na interface principal e no endpoint da API;  
>   * api.save-tasks.tsx: endpoint de API que trata as solicitações vindas do cliente;  


## O que pode ser aproveitado:

Ainda está em andamento.  
Pode ser aproveitado o painel lateral para usar recursos de arrastar e soltar (tanto novas tarefas quanto recursos para alocar nas tarefas).  
Pode ser integrado com a Agenda, para listar os eventos da semana ou os principais marcos/entregas.  
Podem ser criados relatórios/visualizaçãoes de uso dos recursos.  
Pode ser criado um sistema de Agentes de IA, que, baseados na especialidade de cada recurso, e no histórico de projetos já concluídos, criar uma EAP e alocar os recursos automaticamente.  


## O que deve ser melhorado: 

A atualização na tela;  
Função de desfazer/refazer;  
Salvar os dados temporariamente no browser, prevenindo a perda de dados por erro na operação com o banco de dados no momento de Salvar.  