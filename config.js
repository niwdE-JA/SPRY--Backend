const crypto_secret = process.env.CRYPTO_SECRET || 'mySecretHash';
const session_secret = process.env.SESSION_SECRET || 'hsdh12xc31sdr23vsd;qn23h23we154ty7';
const knex_config =  process.env.NODE_ENV === "production" ?
{
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized : false },
    }
}:
{
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        database: 'spry',
        port: 5432,
        user: 'postgres',
        password: 'judgementday'
    }
};

module.exports = {
    crypto_secret,
    session_secret,
    knex_config
}

