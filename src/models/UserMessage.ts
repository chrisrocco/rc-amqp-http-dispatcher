
// the schema of the message sent from the auth service

export interface UserMessage {
    user: {
        _id: string
        name: string
        email: string
        image: string
    }
}