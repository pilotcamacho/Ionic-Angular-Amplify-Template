import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Area: a
    .model({
      areaDescription: a.string(),
      areaImage: a.string(),
      areaName: a.string(),
      retos: a.hasMany('Reto', 'areaId')
    })
    .authorization((allow) => [allow.group('Admin'), allow.owner(), allow.authenticated().to(['read'])]),
  Reto: a
    .model({
      retoName: a.string(),
      retoDescription: a.string(),
      areaId: a.id().required(),
      area: a.belongsTo('Area','areaId'),
      evaluations: a.hasMany('RetoHasEvaluation', 'retoId'),
    })
    .authorization((allow) => [allow.group('Admin'), allow.owner(), allow.authenticated().to(['read'])]),
  RetoHasEvaluation: a
    .model({
      evaluationId: a.id().required(),
      retoId: a.id().required(),
      reto: a.belongsTo('Reto', 'retoId'),
      evaluation: a.belongsTo('Evaluation', 'evaluationId'),
    })
    .authorization((allow) => [allow.group('Admin'), allow.owner(), allow.authenticated().to(['read'])]),
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
      usuarioId: a.id().required(),
      evaluationId: a.id().required(),
      dateLastUpdateLOC: a.date().required(),
      didPass: a.boolean().required(),
      maxTimeNextEvaluationSec: a.integer().required(),
      msToRespondFirstOfTheDay: a.integer().required(),
      r: a.float().required(),
      scoreFirstOfTheDay: a.float().required(),
      markedAsKnown: a.boolean().default(false)
    })
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),
  Racha: a
    .model({
      usuarioId: a.id().required(),
      firstDate: a.date().required(),
      lastDate: a.date().required(),
      daysCnt: a.integer().required(),
    })
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),
  Response: a
    .model({
      usuarioId: a.id().required(),
      evaluationId: a.id().required(),
      agent: a.string(),
      keyStrokes: a.string(),
      msToRespond: a.integer().required(),
      numStops: a.integer(),
      questionAsTxt: a.string(),
      answerAsTxt: a.string(),
      responseAsTxt: a.string(),
      score: a.float().required(),
      didPass: a.boolean().required()
    })
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),
  RetoTest: a
    .model({
      usuarioId: a.id().required(),
      retoId: a.id().required(),
      dateOfTest: a.date().required(),
      testEvaluationsTest: a.id().array(), // List of Evaluations that are goining to be aske for the first time.
      testEvaluationsRehearse: a.id().array(),  // List of Evaluations that student needs to rehearse.
    })
    .identifier(['usuarioId', 'retoId', 'dateOfTest'])
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),
  UsuarioHasReto: a
    .model({
      usuarioId: a.id().required(),
      retoId: a.id().required(),
      progress: a.float(),
      maxNewPerDay: a.integer(),
      maxEvalPerDay: a.integer()      
    })
    .identifier(['usuarioId', 'retoId'])
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),
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
