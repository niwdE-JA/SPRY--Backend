const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        database: 'spry',
        port: 5432,
        user: 'postgres',
        password: 'judgementday'
    }
});


const answerHandler = (req, res)=>{
    console.log("Recieved '/answer/' 'post' request at localhost...");
    console.log(req.body);

    //get form input params from body
    let {email, alias, message, time} = req.body;

    answer( email, alias, message, time, res );

}

const answer = ( email, alias, message, time, res )=>{
    //
    let raw = {
        alias: alias,
        message: message,
        time: time,
        userid: email,
    };

    console.log(raw); //testing

    // add to comment database
    knex.insert(raw)
        .into('comments')
        .then((fii)=>{
            console.log("Comment added successfully!");
            res.status('201').json({status: 201, content: "Comment added successfully!"} );
        })
        .catch((err)=>{
            console.log("Error adding comment : " + err);
            res.status('201').json({status: 401, content: "Error adding comment : " + err} );
        });

}


module.exports = {
    answerHandler : answerHandler ,
}