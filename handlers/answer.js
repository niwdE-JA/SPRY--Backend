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


const answerHandler = (req, res)=>{
    console.log("Recieved '/answer/' 'post' request at localhost...");
    console.log(req.params);

    //get form input params from body
    let {email, alias, message, date} = req.body;

    answer( email, alias, message, date, res );

}

const answer = ( email, alias, message, date, res )=>{
    //
    let raw = {
        alias: alias,
        message: message,
        added: date,
        email: email,
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