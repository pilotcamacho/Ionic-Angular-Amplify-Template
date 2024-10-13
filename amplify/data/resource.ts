import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';

const getUsuarioStatsFnct = defineFunction({
  entry: './getUsuarioStatsFnct/getUsuarioStatsFnctHandler.ts'
})

const sendResponseFnct = defineFunction({
  entry: './sendResponseFnct/sendResponseFnctHandler.ts'
})

const listEvaluationsByUsuarioFnct = defineFunction({
  entry: './listEvaluationsByUsuarioFnct/listEvaluationsByUsuarioFnctHandler.ts'
})


const schema = a.schema({
  UsuarioStats: a.customType({
    cntDays: a.integer(),
    cntEvalReady: a.integer(),
    cntRetosCompleted: a.integer(),
    cntRetosCompletedToday: a.integer(),
    rachaDays: a.integer(),
  }),

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
      area: a.belongsTo('Area', 'areaId'),
      evaluations: a.hasMany('RetoHasEvaluation', 'retoId'),
      retoTests: a.hasMany('RetoTest', 'retoId'),
      usuario: a.hasMany('UsuarioHasReto', 'retoId')
    })
    .authorization((allow) => [allow.group('Admin'), allow.owner(), allow.authenticated().to(['read'])]),

  RetoHasEvaluation: a
    .model({
      retoId: a.id().required(),
      evaluationId: a.id().required(),
      order: a.integer(), // The priority of the Evaluation within this Reto - In this order will be taken to be tested.
      reto: a.belongsTo('Reto', 'retoId'),
      evaluation: a.belongsTo('Evaluation', 'evaluationId'),
    })
    .identifier(['retoId', 'evaluationId'])
    .secondaryIndexes((index) => [index("retoId").sortKeys(["order"])])
    .authorization((allow) => [allow.group('Admin'), allow.owner(), allow.authenticated().to(['read'])]),

  Evaluation: a
    .model({
      evaluationQuestionClassName: a.string(),
      evaluationQuestionParameters: a.json(),
      evaluationMsResponseTimeGoal: a.integer(),
      retos: a.hasMany('RetoHasEvaluation', 'evaluationId')
    })
    .authorization((allow) => [allow.authenticated()]),

  Racha: a
    .model({
      usuarioId: a.id().required(),
      firstDate: a.date().required(),
      lastDate: a.date().required(),
      daysCnt: a.integer().required(),
      numSalvaRacha: a.integer().default(0)
    })
    .identifier(['usuarioId'])
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
      reto: a.belongsTo('Reto', 'retoId'),
      evaluationsTest: a.id().array(), // List of Evaluations that are goining to be asked for the first time.
      evaluationsRehearse: a.id().array(),  // List of Evaluations that student needs to rehearse.
      evaluationsCompleted: a.id().array(),  // List of Evaluations that student completed.
    })
    .identifier(['usuarioId', 'retoId', 'dateOfTest'])
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),

  UsuarioHasReto: a
    .model({
      usuarioId: a.id().required(),
      retoId: a.id().required(),
      progress: a.float(),
      numEvaluationsQueued: a.integer(),
      maxNewPerDay: a.integer(),
      maxEvalPerDay: a.integer(),
      reto: a.belongsTo('Reto', 'retoId'),
    })
    .identifier(['usuarioId', 'retoId'])
    .secondaryIndexes((index) => [index("usuarioId")])
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),

  Progress: a
    .model({
      usuarioId: a.id().required(),
      evaluationId: a.id().required(),
      dateNextEvaluationLOC: a.date().required(),
      dateLastUpdateLOC: a.date().required(),
      didPass: a.boolean().required(),
      maxTimeNextEvaluationSec: a.integer().required(),
      msToRespondFirstOfTheDay: a.integer().required(),
      r: a.float().required(),
      scoreFirstOfTheDay: a.float().required(),
      markedAsKnown: a.boolean().default(false), // Manually marked as known
      completed: a.boolean().default(false), // Marked as know by the system
      evaluationsQueue: a.hasMany('EvaluationsQueue', ['usuarioId', 'evaluationId']) // Progress points to the Evaluation Queues for each of the Retos of a User that has the same evaluation.
    })
    .identifier(['usuarioId', 'evaluationId'])
    .secondaryIndexes((index) => [index("usuarioId")
      .sortKeys(["dateNextEvaluationLOC"])])
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),

  EvaluationsQueue: a
    .model({
      usuarioId: a.id().required(),
      retoId: a.id().required(),
      evaluationId: a.id().required(),
      dateNextEvaluationLOC: a.date(),
      progressId: a.string().required(),
      progress: a.belongsTo('Progress', ['usuarioId', 'evaluationId'])
    })
    .identifier(['usuarioId', 'retoId', 'evaluationId'])
    .secondaryIndexes((index) => [
      index("usuarioId").sortKeys(["retoId", "dateNextEvaluationLOC"]),
      index("usuarioId").sortKeys(["evaluationId", "dateNextEvaluationLOC"])
    ])
    .authorization((allow) => [allow.group('Admin'), allow.owner()]),


  /** CUSTOM mutations and queries */

  getStatsByUsuario: a
    .query()
    .arguments({
      usuarioId: a.id().required(),
    })
    .returns(a.ref('UsuarioStats'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(getUsuarioStatsFnct)),


  listEvaluationsByUsuarioAndReto: a // Here we need both, the Evaluations and the Progress related to the evaluations... What to do?
    .mutation()
    .arguments({
      usuarioId: a.id().required(),
      retoId: a.id().required(),
    })
    .returns((a.ref('Evaluation')).array())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(listEvaluationsByUsuarioFnct)),

  /** 
    responseCreateFunction
    retoTestUpdateEvaluationFunction
    progressUpdateFunction
  */
  sendResponse: a
    .mutation()
    .arguments({
      usuarioId: a.id().required(),
      evaluationId: a.id().required(),
      answerAsTxt: a.string().required(),
      didPass: a.boolean(),
      score: a.float().required(),
      msToRespond: a.integer().required(),
      keyStrokes: a.string().required(),
      numStops: a.integer().required(),
      questionAsTxt: a.string().required(),
      responseAsTxt: a.string().required(),
      agent: a.string().required(),
    })
    .returns(a.ref('Progress'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(sendResponseFnct)),

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
