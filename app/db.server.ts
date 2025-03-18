import { PrismaClient } from '@prisma/client'
//import { withOptimize } from "@prisma/extension-optimize";

let prisma: PrismaClient
declare global {
  var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
  prisma.$connect()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      log:  [{ emit: "event", level: "query" } ],
  });
    global.__db.$connect()
  }
  prisma = global.__db
}

//teste com o Optimize, mas não vi muita vantagem não
// const prisma = new PrismaClient().$extends(
//   withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
// )

export { prisma }



//['query', 'info', 'warn', 'error'] // joga no stdout
//[{ emit: "event", level: "query" } ] // joga no console