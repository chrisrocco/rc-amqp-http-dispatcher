import express from 'express'
import dotenv from 'dotenv'
import {createRabbitMQConnection} from "./rabbitmq-conn";
import {bindQueues} from "./bindings";
import {config, env} from "./config";

/* LOAD ENVIRONMENT VALUES */
dotenv.config({ path: ".env" });

/* BOOTSTRAP THE APP */
const app = express()
app.set('port', env('PORT', 80))

/* CONNECT TO RABBITMQ */
createRabbitMQConnection({
    host: config('RABBITMQ_HOST'),
    user: config('RABBITMQ_USER', ''),
    pass: config('RABBITMQ_PASS', '')
})

bindQueues(app)

/* REGISTER ROUTES */
app.on('rabbitmq-ready', _ => console.log('connected to rabbitmq'))

export { app }
