const { knex_config} = require('../config');
const knex = require('knex')( knex_config );

const getHome = (req, res)=>{
    console.log("Recieved '/home/:user_id' 'GET' request at localhost...");
    console.log(req.params);
    let {user_id}= req.params; //get form input params from body

    getData(user_id, res);

}

const getData = (user_id, res )=>{

    knex.select()
    .from('comments')
    .where('userid', user_id)
    .then((output_array)=>{
        if (output_array.length == 0 /*User has no comments*/){           
            console.log("User has no comments");
            res.status('201').json({status: 204, content: "User has no comments" } );
        }else{
            console.log("Loaded comments successfully!");
            // consider unescaping here
            console.log(output_array);
            
            res.status('201').json({status: 201, content: output_array} );
        }
    })
    .catch((err)=>{
        console.log(err);
    });

}


const getUser = (req, res)=>{
    console.log("Recieved '/user/:user_id' 'GET' request at localhost...");
    console.log(req.params);
    let {user_id}= req.params; //get form input params from body

    getUserInfo(user_id, res);

}

const getUserInfo = (user_id, res )=>{

    knex.select()
    .from('users')
    .where('email', user_id)
    .then((output_array)=>{
        if (output_array.length == 1 /*success*/){           
            console.log("User loaded successfully");
            res.status('201').json({status: 201, content: "success", firstname: output_array[0].firstname, lastname: output_array[0].lastname, } );
        }else if(output_array.length > 1){
            console.log("Forbidden");
            // consider unescaping here
            console.log(output_array);
            
            res.status('401').json({status: 401, content: 'forbidden'} );
        }else {
            console.log("Not found");
            // consider unescaping here
            console.log(output_array);
            
            res.status('404').json({status: 404, content: 'Not found'} );
        }
    })
    .catch((err)=>{
        console.log(err);
    });

}

const getCoffee = (req, res)=>{
    //  let {height, width} = req.params;
    console.log("Received 'GET' request at './brew' route.")
    res.status('418').sendFile(__dirname + '../coffee.html');
}


module.exports = {
    getHome : getHome ,
    getUser : getUser ,
    getCoffee: getCoffee,
}