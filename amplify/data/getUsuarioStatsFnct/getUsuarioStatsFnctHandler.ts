import type { Schema } from '../resource'

export const handler: Schema["getStatsByUsuario"]["functionHandler"] = async (Event, Context) => {

  return {
    cntDays: 0,
    cntEvalReady: 0,
    cntRetosCompleted: 0,
    cntRetosCompletedToday: 0,
    rachaDays: 0
  }
}