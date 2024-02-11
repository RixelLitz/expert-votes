import { z } from "zod" // importa o zod pra validação de rotas
import { prisma } from "../../lib/prisma" //  importa o prisma client para fazer conexão com o banco e poder salvar.
import { FastifyInstance } from "fastify"

export async function createPoll(app: FastifyInstance) {
  // No fastify quando tem rotas separadas, precisamos que cada rota exporte uma função onde ela deve obrigatoriamente se async também passamos o app tipando ele com fastifyinstance
  app.post("/polls", async (request, reply) => {
    // cria uma rota hello retornando determinado valor
    const createPollBody = z.object({
      //fala que o requestbody seja um objeto (z.object) e dentro do {} a gente coloca quais propriedades queremos que tenha

      title: z.string(), // aqui passamos o title dizendo que ele é uma string
      options: z.array(z.string()),
    })
    const { title, options } = createPollBody.parse(request.body) // vai pegar esse request body e verificar se está exatamente no formato que colocamos acima. Se nao tiver ele  para o codigo, já o const {title} vai me retornar a informação atraves do zod
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return { title: option }
            }),
          },
        },
      },
    })
    return reply.status(201).send({ pollID: poll.id }) // retorna o id da tabela poll criada no arquivo do prisma
  })
}
