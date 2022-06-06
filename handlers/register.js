const crypto = import('crypto')
   
const {crypto_secret} = require('../config');

var createHmac;
crypto.then( 
    (response)=>{
        createHmac = response.createHmac;
    });

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        database: 'test',
        port: 5432,
        user: 'postgres',
        password: 'judgementday'
    }
});


const registerHandler = (req, res)=>{
    console.log("Recieved '/register' 'post' request at localhost...");
    console.log(req.body);

    //get form input params from body
    let {firstname, lastname, email, password} = req.body;

    //register using obtained values, idealy after sanitization
    register(firstname, lastname, email, password, res);

    // res.status('201').json({status: 201, content: "success!"} );
    // console.log(req);
}

const register = (firstname, lastname, email, password, res)=>{
    console.log("registering...");

    //DONE-- verify & sanitize input, make sure entries are set
    let raw = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
    }

    const password_hash = createHmac('sha256', crypto_secret)
                            .update(raw.password)
                            .digest('hex');

    //hash password for storage
    raw.password = password_hash; 
    
    //DONE-- add user to 'users' database
    knex.insert(raw)
        .into('users')
        .then((fii)=>{
            console.log('User created successfully!');
            res.status('201').json({status: 201, content: "User created successfully!"} );
        })
        .catch((err)=>{
            console.log('Error insertng user : ' + err);
            res.status('401').json({status: 401, content:"Error creating user : " +err} );
        });

}



module.exports = {
    registerHandler: registerHandler,
}