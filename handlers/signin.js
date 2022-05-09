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

//handles a neccessary functions...

const signinHandler = (req, res)=>{
    console.log("Recieved '/signin' 'post' request at localhost...");
    console.log(req.body);

    //get form input params from body
    let {email, password} = req.query;//testing only!!!
    // let {email, password} = req.body;

    //signin using obtained values, idealy after sanitization
    signin(email, password, req, res);
    // res.status('201').send("signin success!");
    // console.log(req);
}


const signin = (email, password, req, res)=>{
    console.log("signing in...");

    
    const password_hash = createHmac('sha256', crypto_secret)
                            .update(password)
                            .digest('hex');

    //hash password for comparing with database
    password = password_hash; 

    knex.select()
    .from('users')
    .where('email', email)
    .then((output_array)=>{
        if (output_array.length == 0 || /*User doesn't exist*/
            password != output_array[0].password/*compare hash*/
            ){           
            console.log("Signin failed: Invalid email or password");
            res.status('401').send("Signin failed: Invalid email or password");
        }else{//success
            console.log("signin success!");
            
            createSession( email, req);
            res.status('201').send("signin success!");
        }
    })
    .catch((err)=>{
        console.log(err);
    });
    //generate session token and add to 'sessions' database
    //
    //(This 'sessions database' would be used to authenticate all future actions)
    //send response containing session token
}

const createSession = (email, req)=>{
    //set 'user' session
    req.session.user = email;
}



module.exports = {
    signinHandler: signinHandler,
}