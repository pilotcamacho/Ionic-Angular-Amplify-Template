import type { Schema } from '../resource'

export const handler: Schema["sendResponse"]["functionHandler"] = async (Event) => {

    return {
        usuarioId: '',
        evaluationId: '',
        dateNextEvaluationLOC: '',  // You need to calculate or set this value
        dateLastUpdateLOC: '',      // You need to calculate or set this value
        didPass: true,
        maxTimeNextEvaluationSec: 0,  // Define based on your logic
        msToRespondFirstOfTheDay: 0,  // Define based on your logic
        r: 0,
        scoreFirstOfTheDay: 0.0,
        markedAsKnown: true,
        completed: true,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
    };
}