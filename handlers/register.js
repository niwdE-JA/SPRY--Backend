const crypto = import('crypto')
   
const {crypto_secret, knex_config} = require('../config');
const {v4: uuidv4} = require('uuid');
const sendMail = require('../mail/sendMail');
const {template} = require('../mail/message')

var createHmac;
crypto.then( 
    (response)=>{
        createHmac = response.createHmac;
    });

const knex = require('knex')( knex_config );


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
        epoch_time: new Date().getTime()
    };

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
            createVerificationLink(raw.email, raw.firstname);
        })
        .catch((err)=>{
            console.log('Error insertng user : ' + err);
            res.status('401').json({status: 401, content:"Error creating user : " +err} );
        });

}

async function createVerificationLink(email, firstname) {
    const id = uuidv4();
    const link = "http://spry-anonymous.herokuapp.com/verify" +`?email=${email}&id=`+ id ;
    
    try{
        await knex.insert({ email, id, epoch_time: new Date().getTime() })
                    .into('urls');

        sendMail(
        // console.log( 
            email, 
            "Verify your SPRY account.", 

            `Welcome to SPRY, ${firstname}!\n\
            Just one last step to complete your registration...\n\
            Follow this verification link within 24hours, so we know it's you: \n\
            ${link} \n\n\
            Enjoy!`,
            
            template(firstname, link)
        );
    }catch(err){
        console.log("Error generating link : " + err);
        res.status('201').json({status: 401, content: "Error generating link : " + err} );
    }
    
}


module.exports = {
    registerHandler: registerHandler,
}