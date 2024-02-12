import { z } from "zod" // importa o zod pra validação de rotas
import { prisma } from "../../lib/prisma" //  importa o prisma client para fazer conexão com o banco e poder salvar.
import { FastifyInstance } from "fastify"
import { redis } from "../../lib/redis"

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })
    const { pollId } = getPollParams.parse(request.params)
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
    if (!poll) {
      return reply.status(400).send({ message: "Poll Not Found" })
    }
    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES")
    const votes = result.reduce((obj, line, index) => {
      if (index % 2 == 0) {
        const score = result[index + 1]
        Object.assign(obj, { [line]: Number(score) })
      }
      return obj
    }, {} as Record<string, number>)
    console.log(votes)
    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => {
          return{
            id: option.id,
            title: option.title,
            score: (option.id in votes) ? votes[option.id] : 0
          }
        }),
      },
    })
  })
}
