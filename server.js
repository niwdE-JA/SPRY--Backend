const express = require('express') ;
const bodyParser = require('body-parser') ;
const {signinHandler} = require('./handlers/signin');
const {registerHandler} = require('./handlers/register');
const {getHome, getCoffee } = require('./handlers/get');
const {answerHandler} = require('./handlers/answer');
const {session_secret} = require('./config');
const {check, validationResult} = require('express-validator');

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
    cookie:{ maxAge: 24*60*60*1000, httpOnly: false/*true*/,},
    resave: false,
    store,
})   

const app = express();

app.use( bodyParser.json() );
app.use( sessions_config );

app.use( (req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000' );
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
    check('message').isLength({min:1}).withMessage('Name too short').isLength({max:500}).withMessage('Name too long.'),
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




app.get('/logout', (req, res)=>{
    req.session.destroy();
    console.log({content: "Logged out successfully."} );
    res.json({content: "Logged out successfully."} );
});


//@temporary-insanity
app.get('/brew', getCoffee);

app.get('/coffee', (req, res)=>{
    //  let {height, width} = req.params;
    console.log("Returning 'coffee' image at '/coffee' ...")
    res.status('418').sendFile('C:/Users/USER/Desktop/server/coffee.jpg');
});




app.listen(8080, ()=>{
    console.log("I am SPRY Server, listening on port 8080!")
});