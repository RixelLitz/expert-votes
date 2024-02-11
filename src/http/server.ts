import fastify from "fastify" // importa o fastify
import { PrismaClient } from "@prisma/client" //  importa o prisma client para fazer conexão com o banco e poder salvar.
import { z } from "zod" // importa o zod pra validação de rotas

const app = fastify() //cria uma aplicação chamando a função do fastify
const prisma = new PrismaClient() // faz a conexão com o banco de dados

app.post("/polls", async (request, reply) => {
  // cria uma rota hello retornando determinado valor
  const createPollBody = z.object({
    //fala que o requestbody seja um objeto (z.object) e dentro do {} a gente coloca quais propriedades queremos que tenha

    title: z.string(), // aqui passamos o title dizendo que ele é uma string
  })
  const { title } = createPollBody.parse(request.body) // vai pegar esse request body e verificar se está exatamente no formato que colocamos acima. Se nao tiver ele  para o codigo, já o const {title} vai me retornar a informação atraves do zod
  const poll =  await prisma.poll.create({
    data: {
      title,
    },
  })
  return reply.status(201).send({pollID: poll.id}) // retorna o id da tabela poll criada no arquivo do prisma
})
app.listen({ port: 3333 }).then(() => {
  // vou ouvir a porta 3333/ quando meu servidor entrar no ar da um console.log
  console.log("HTTP server running!")
})
