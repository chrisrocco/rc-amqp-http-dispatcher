

export const env = key => process.env[key]

export const config = key => env(key)
