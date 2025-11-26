// config-baseURL.js 
export default {
    baseURL: process.env.NODE_ENV === 'development'
        ? '/api'
        : 'https://note-server.hunger-valley.com'
}