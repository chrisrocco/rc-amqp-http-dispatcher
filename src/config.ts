
export const env = (key, def = null) => process.env[key] || def

export const config = (key, def = null) => {
    if(!_config[key] && def !== null) return def            // no config found, but default is set
    if(!_config[key]) throw "Config access error: " + key   // no config AND no default
    return _config[key]
}

const _config = {

    BACKEND_HOST: env('BACKEND_HOST'),

    BACKEND_SECRET: env('BACKEND_SECRET'),

    RABBITMQ_HOST: env('RABBITMQ_HOST'),
    RABBITMQ_USER: env('RABBITMQ_USER'),
    RABBITMQ_PASS: env('RABBITMQ_PASS'),

}