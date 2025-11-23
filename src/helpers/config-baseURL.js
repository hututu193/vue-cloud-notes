// config-baseURL.js 
module.exports = {
    baseURL: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://note-server.hunger-valley.com'
}