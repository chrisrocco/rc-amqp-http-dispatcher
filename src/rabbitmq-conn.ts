import * as amqp from 'amqplib'

import {app} from "./app"

export let rabbitConnection
export let rabbitChannel

export let getChannel = () => rabbitChannel

// Run when bootstrapping the application
export let createRabbitMQConnection = async ({ host, user, pass }) => {
    rabbitConnection = await amqp.connect(`amqp://${user}:${pass}@${host}`)
    rabbitChannel = await rabbitConnection.createChannel()
    app.emit('rabbitmq-ready', { rabbitConnection, rabbitChannel })
    return rabbitChannel
}
