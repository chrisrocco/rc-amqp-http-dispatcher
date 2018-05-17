import express from 'express'
import dotenv from 'dotenv'
import {createRabbitMQConnection} from "./rabbitmq-conn";
import {bindQueues} from "./bindings";

/* LOAD ENVIRONMENT VALUES */
dotenv.config({ path: ".env" });

/* BOOTSTRAP THE APP */
const app = express()
app.set('port', process.env.PORT || 80)
app.set('BACKEND_SECRET', process.env.BACKEND_SECRET)

/* CONNECT TO RABBITMQ */
createRabbitMQConnection({
    host: process.env.RABBITMQ_HOST,
    user: process.env.RABBITMQ_USER,
    pass: process.env.RABBITMQ_PASS
})

bindQueues(app)

/* REGISTER ROUTES */
app.on('rabbitmq-ready', _ => console.log('connected to rabbitmq'))

export { app }
