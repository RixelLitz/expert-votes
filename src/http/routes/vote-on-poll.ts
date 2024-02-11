import { z } from "zod" // importa o zod pra validação de rotas
import { randomUUID } from "node:crypto"
import { prisma } from "../../lib/prisma" //  importa o prisma client para fazer conexão com o banco e poder salvar.
import { FastifyInstance } from "fastify"

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })
    const voteOnParams = z.object({
      pollId: z.string().uuid(),
    })
    const { pollOptionId } = voteOnPollBody.parse(request.body)
    const { pollId } = voteOnParams.parse(request.params)

    let { sessionId } = request.cookies
    if (sessionId) {
      const userPreviousVotedOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      })
      if (userPreviousVotedOnPoll && userPreviousVotedOnPoll.pollOptionId != pollOptionId) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVotedOnPoll.id,
          },
        })
      } else if (userPreviousVotedOnPoll) {
        return reply
          .status(400)
          .send({ message: "Your already voted on this poll." })
      }
      
    }

    if (!sessionId) {
      sessionId = randomUUID()
      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true,
      })
    }
    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    })
    return reply.status(201).send()
  })
}
