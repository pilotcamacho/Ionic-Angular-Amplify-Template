import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Area: a
    .model({
      areaDescription: a.string(),
      areaImage: a.string(),
      areaName: a.string(),
      retos: a.hasMany('Reto', 'areaId')
    })
    .authorization((allow) => [allow.authenticated()]),
  Reto: a
    .model({
      retoName: a.string(),
      retoDescription: a.string(),
      areaId: a.id().required(),
      area: a.belongsTo('Area','areaId'),
      evaluations: a.hasMany('RetoHasEvaluation', 'retoId'),
    })
    .authorization((allow) => [allow.authenticated()]),
  RetoHasEvaluation: a
    .model({
      evaluationId: a.id().required(),
      retoId: a.id().required(),
      reto: a.belongsTo('Reto', 'retoId'),
      evaluation: a.belongsTo('Evaluation', 'evaluationId'),
    })
    .authorization((allow) => [allow.authenticated()]),
  Evaluation: a
    .model({
      evaluationQuestionClassName: a.string(),
      evaluationQuestionParameters: a.json(),
      evaluationMsResponseTimeGoal: a.integer(),
      retos: a.hasMany('RetoHasEvaluation', 'evaluationId')
    })
    .authorization((allow) => [allow.authenticated()]),
  Progress: a
    .model({
      usuarioId: a.id(),
      evaluationId: a.id(),
      dateLastUpdateLOC: a.date(),
      didPass: a.boolean(),
      maxTimeNextEvaluationSec: a.integer(),
      msToRespondFirstOfTheDay: a.integer(),
      r: a.float(),
      scoreFirstOfTheDay: a.float(),
      markedAsKnown: a.boolean()
    })
    .authorization((allow) => [allow.authenticated()]),
  Racha: a
    .model({
      firstDate: a.date(),
      lastDate: a.date(),
      daysCnt: a.integer()
    })
    .authorization((allow) => [allow.authenticated()]),
  Response: a
    .model({
      usuarioId: a.id(),
      evaluationId: a.id(),
      agent: a.string(),
      keyStrokes: a.string(),
      msToRespond: a.integer(),
      numStops: a.integer(),
      questionAsTxt: a.string(),
      answerAsTxt: a.string(),
      responseAsTxt: a.string(),
      score: a.float(),
      didPass: a.boolean()
    })
    .authorization((allow) => [allow.authenticated()]),
  RetoTest: a
    .model({
      usuarioId: a.id(),
      retoId: a.id(),
      dateOfTest: a.date(),
    })
    .authorization((allow) => [allow.authenticated()]),
  UsuarioHasReto: a
    .model({
      usuarioId: a.id(),
      retoId: a.id(),
      progress: a.float(),
      maxNewPerDay: a.integer(),
      maxEvalPerDay: a.integer()      
    })
    .authorization((allow) => [allow.authenticated()]),
  });

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
