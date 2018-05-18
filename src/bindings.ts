import {getChannel} from "./rabbitmq-conn";
import {config} from "./config";
import {userTransformer} from "./transformers";
import axios from 'axios'

/* Helper function for transforming AMQP message into HTTP requests */
const backendHost = config('BACKEND_HOST')

const dispatchToHttpEndpoint = endpoint => {
    return data => {
        console.log('dispatching..', data, 'to', endpoint)
        axios.post(endpoint, data, {
            headers: {
                'Authorization': 'key ' + config('BACKEND_SECRET')
            }
        })
            .then( res => res.data )
            .then( console.log )
            .catch( console.error )
    }
}

/* Declare the bindings */
const bindings = [
    {
        exchange: 'rc-auth.users.created',
        dispatcher: dispatchToHttpEndpoint(`http://${backendHost}/channels/users/created`),
        transformer: userTransformer as any
    },
    {
        exchange: 'rc-auth.users.updated',
        dispatcher: dispatchToHttpEndpoint(`http://${backendHost}/channels/users/updated`),
        transformer: userTransformer as any
    },
    {
        exchange: 'rc-auth.users.deleted',
        dispatcher: dispatchToHttpEndpoint(`http://${backendHost}/channels/users/deleted`),
        transformer: userTransformer as any
    }
]

/* Do the binding */
export const bindQueues = (app) => {
    let parseMessageBody = msg => JSON.parse(msg.content.toString())

    app.on('rabbitmq-ready', () => {

        let ch = getChannel()

        bindings.forEach( async binding => {
            binding.transformer = binding.transformer || ( I => I ) // identity function

            let {dispatcher, transformer, exchange} = binding

            ch.assertExchange(exchange, 'fanout', {durable: false})

            let q = await ch.assertQueue('', {exclusive: true})
            ch.bindQueue(q.queue, exchange, '')

            ch.consume(
                q.queue,
                msg => {
                    dispatcher(transformer(parseMessageBody(msg))) // parse the message, run it through transformer, and pass to dispatcher
                    ch.ack(msg)
                },
                {noAck: false}
            )
        })
    })
}
