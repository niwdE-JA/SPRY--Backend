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

const getHome = (req, res)=>{
    console.log("Recieved '/home/:user_id' 'GET' request at localhost...");
    console.log(req.params);
    let {user_id}= req.params; //get form input params from body

    getData(user_id, res);

}

const getData = (user_id, res )=>{

    knex.select()
    .from('comments')
    .where('email', user_id)
    .then((output_array)=>{
        if (output_array.length == 0 /*User has no comments*/){           
            console.log("User has no comments");
            res.status('401').send("User has no comments");
        }else{
            console.log("Loaded comments successfully!");
            res.status('201').send(output_array);
        }
    })
    .catch((err)=>{
        console.log(err);
    });

}

const getCoffee = (req, res)=>{
    //  let {height, width} = req.params;
    console.log("Received 'GET' request at './brew' route.")
    res.status('418').sendFile('C:/Users/USER/Desktop/server/coffee.html');
}


module.exports = {
    getHome : getHome ,
    getCoffee: getCoffee,
}