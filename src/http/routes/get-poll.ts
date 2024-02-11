import { z } from "zod" // importa o zod pra validação de rotas
import { prisma } from "../../lib/prisma" //  importa o prisma client para fazer conexão com o banco e poder salvar.
import { FastifyInstance } from "fastify"

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
    return reply.send({ poll })
  })
}
