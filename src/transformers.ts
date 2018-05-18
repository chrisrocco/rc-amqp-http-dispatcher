import {UserMessage} from "./models/UserMessage";
import {UserPayload} from "./models/UserPayload";


export let userTransformer = (messageData: UserMessage): UserPayload => {
    let user = {
        ...messageData.user,
        uuid: messageData.user._id
    }
    delete user['id']
    delete user['_id']
    delete user['password']
    return user
}
