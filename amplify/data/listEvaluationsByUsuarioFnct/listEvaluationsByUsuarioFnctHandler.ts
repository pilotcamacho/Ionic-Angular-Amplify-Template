import type { Schema } from '../resource'

export const handler: Schema["listEvaluationsByUsuarioAndReto"]["functionHandler"] = async (event, context) => {
    return [
        {
            evaluationQuestionClassName: 'a.string()',
            evaluationQuestionParameters: {},
            evaluationMsResponseTimeGoal: 0,
            id: '',
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        }
    ]
}