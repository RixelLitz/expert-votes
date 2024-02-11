import fastify from "fastify" // importa o fastify
import {createPoll} from "./routes/create-poll" // importa a rota create-poll

const app = fastify() //cria uma aplicação chamando a função do fastify
app.register(createPoll) // registra a rota

app.listen({ port: 3333 }).then(() => {
  // vou ouvir a porta 3333/ quando meu servidor entrar no ar da um console.log
  console.log("HTTP server running!")
})
