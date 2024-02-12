import fastify from "fastify" // importa o fastify
import { createPoll } from "./routes/create-poll" // importa a rota create-poll
import cookie from "@fastify/cookie"
import { getPoll } from "./routes/get-poll"
import { voteOnPoll } from "./routes/vote-on-poll"
import fastifyWebsocket from "@fastify/websocket"
import { pollResults } from "./ws/poll-results"

const app = fastify() //cria uma aplicação chamando a função do fastify
app.register(cookie, {
  secret: "polls-vote-rbexpert",
  hook: "onRequest",
})
app.register(fastifyWebsocket)
app.register(createPoll) // registra a rota
app.register(getPoll)
app.register(voteOnPoll)
app.register(pollResults)

app.listen({ port: 3333 }).then(() => {
  // vou ouvir a porta 3333/ quando meu servidor entrar no ar da um console.log
  console.log("HTTP server running!")
})
