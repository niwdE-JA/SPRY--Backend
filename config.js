const crypto_secret = 'mySecretHash';
const session_secret = 'hsdh12xc31sdr23vsd;qn23h23we154ty7';
const knex_config =  {
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized : false },
    }
};

module.exports = {
    crypto_secret,
    session_secret,
    knex_config
}

