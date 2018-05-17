import {getChannel} from "./rabbitmq-conn";
import http from 'http'
import {config} from "./helpers";

/* Helper function for transforming AMQP message into HTTP requests */
const backendHost = config('BACKEND_HOST')
const dispatchToBackend = (route, body) => {
    return msg => {
        console.log('dispatching message...', JSON.parse(msg.content.toString()))
        msg.ack()
    }
}

/* Declare the bindings */
const BINDINGS = [
    {
        exchange: 'rc-auth.users.created',
        handler: dispatchToBackend('/channels/user.created', {})
    }
]

/* Do the binding */
export const bindQueues = (app) => {
    app.on('rabbitmq-ready', () => {

        let ch = getChannel()

        BINDINGS.forEach( async binding => {
            ch.assertExchange(binding.exchange, 'fanout', {durable: false})

            let q = await ch.assertQueue('', {exclusive: true})
            ch.bindQueue(q.queue, binding.exchange, '')
            ch.consume(q.queue, binding.handler)
        })
    })
}
