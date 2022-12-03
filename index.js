const express = require('express') ;
const bodyParser = require('body-parser') ;
const {signinHandler} = require('./handlers/signin');
const {registerHandler} = require('./handlers/register');
const {getHome, getUser, getCoffee } = require('./handlers/get');
const {answerHandler} = require('./handlers/answer');
const {session_secret, knex_config} = require('./config');
const {check, validationResult} = require('express-validator');
const PORT = process.env.PORT || 8080;
const IS_PRODUCTION = process.env.NODE_ENV === "production";


const knex = require('knex')( knex_config );
const {v4: uuidv4} = require('uuid');
const sessions = require('express-session') ;
const KnexSessionStore = require('connect-session-knex')(sessions);


const store = new KnexSessionStore( {
    knex,
});

const sessions_config =  sessions( {
    genid: (req)=>uuidv4(),
    secret: session_secret,
    rolling: true,
    saveUninitialized: true/*true*/,
    cookie:{
        // sameSite: (IS_PRODUCTION) ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
        // secure: (IS_PRODUCTION),
        maxAge: 24*60*60*1000,
        httpOnly: IS_PRODUCTION/*true*/,
    },
    resave: false,
    store,
})   

const app = express();

app.use( bodyParser.json() );
app.use( sessions_config );

app.use( (req, res, next)=>{
    const allowedOrigins = [ 'https://spry-anonymous.herokuapp.com','http://spry-anonymous.herokuapp.com', 'http://localhost:3000' ];
    const origin = req.headers.origin ;
    // if ( allowedOrigins.includes(origin) ) {
    if ( true ) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        console.log(origin)
    }
    // res.setHeader('Access-Control-Allow-Origin', '*' );
    res.setHeader('Access-Control-Allow-Credentials', 'true' );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type' );
    next();
} );



const authZero = (req, res, next)=>{
    if ( req.session && req.params.user_id == req.session.user){
        console.log(req.session);
        next();
    }else{
        //invalid session
        //GOTO login
        console.log({content: 'Invalid session'});
        res.status('401').json({status: 401, content: 'Invalid session'});
    }

}

const signin_check = [
    check('email').isEmail().withMessage('Invalid Email').trim(),
    check('password').isLength({min:8, max: 20}).withMessage('Invalid Password: Must be between 8 and 20 chracters').trim(),
];
const register_check = [
    check('email').isEmail().withMessage('Invalid Email').trim(),
    check('password').isLength({min:8, max: 20}).withMessage('Invalid Password: Must be between 8 and 20 chracters').trim(),//escape tooo
    check('firstname').isLength({min:1}).withMessage('Name too short').isLength({max:20}).withMessage('Name too long.').trim(),
    check('lastname').isLength({min:1}).withMessage('Name too short').isLength({max:20}).withMessage('Name too long.').trim()
];
const home_check = [
    check('user_id').isEmail().withMessage("Invalid User! 'User_id' must be Email").trim(),
];
const answer_check = [
    check('email').isEmail().withMessage("Invalid Email").trim(),
    check('alias').isLength({min:1}).withMessage('Name too short').isLength({max:20}).withMessage('Name too long.').trim(),
    check('message').isLength({min:1}).withMessage('Name too short').isLength({max:500}).withMessage('Name too long.').trim(),
    // check('date').isDate().withMessage('Invalid date'),
];


const isValid = (req, res, next)=>{
    const errors = validationResult(req) ;
    console.log('Validating input...');

    if (errors.isEmpty() ){
        console.log('Input verified');
        next();
    }else{
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000' );
        res.status('401').json({status: 401, errors: errors.array() } );
        
        console.log('Validation error!');
        console.log({errors: errors.array() } );
    }
}



app.post(
    '/signin',
    signin_check,
    isValid,
    signinHandler
);


app.post('/register',
    register_check,
    isValid,
    registerHandler
);

app.post('/answer',
    answer_check,
    isValid,
    answerHandler
);


app.get('/home/:user_id',
    home_check,
    isValid,
    authZero,
    getHome
);

app.get('/user/:user_id',
    home_check,
    isValid,
    authZero,
    getUser
);

app.get('/verify', async (req, res)=>{
    let {id, email} = req.query ;

    let unverified = await knex.select().from("urls").where('email', email);//andwhere
    if (unverified[0].id === id){
        await knex("users").update({verified: true}).where('email', email);
        await knex.delete().from("urls").where('email', email);
        console.log("Verified successfully!");
        res.status('201').sendFile(__dirname + '/verify_success.html');
        // res.json({content: "Verified successfully!"} );
    }else{
        console.log("Failed to verify.");
        res.json({error:"", content: "Failed to verify."} );
    }
} );



app.get('/logout', (req, res)=>{
    req.session.destroy();
    console.log({content: "Logged out successfully."} );
    res.json({content: "Logged out successfully."} );
});

app.use('/', express.static('public'));


// For OGP image:
app.get('/spry-image', (req, res)=>{
    //  let {height, width} = req.params;
    console.log("Returning 'spry' image at '/spry-image' ...")
    res.status('201').sendFile(__dirname + '/spry.jpg');
});


//@temporary-insanity
app.get('/brew', getCoffee);

app.get('/coffee', (req, res)=>{
    //  let {height, width} = req.params;
    console.log("Returning 'coffee' image at '/coffee' ...")
    res.status('418').sendFile(__dirname + '/handlers/coffee/coffee.jpg');
});


let scheduler = async () => {
    await deleteExpired(24*60*60*1000);
    
    setTimeout(
        scheduler
    , 8*60*60*1000);
}

async function deleteExpired(lifespan){
    //
    let epoch_time = new Date().getTime() - lifespan ;

    await knex.delete().from('users').where('epoch_time','<', epoch_time )
                                        .andWhere('verified',false);    
    await knex.delete().from('urls').where('epoch_time','<', epoch_time );    

    console.log("Clearing expired verification emails...")
}

scheduler();

app.listen(PORT, ()=>{
    console.log(`I am SPRY Server, listening on port ${PORT}!`);
});

module.exports = app