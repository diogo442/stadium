const config = {
    db: process.env.MONGO_URI,
    secret: process.env.JWT_SECRET,
    expiresPassword: 86400,
    saltRounds: 10
 }
 
 module.exports = config;