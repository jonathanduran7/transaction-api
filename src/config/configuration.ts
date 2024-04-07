export default () => ({
    port: process.env.PORT || 3000,
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT) || 3306,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    }
})
