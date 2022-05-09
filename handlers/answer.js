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
    //let {user_id, question_id}= req.params;
    // res.status('201').send(req.params);

    //get form input params from body
    let {email, alias, message, added_date} = req.body;

    answer( email, alias, message, added_date, res );

}

const answer = ( email, alias, message, added_date, res )=>{
    //
    let raw = {
        alias: alias,
        message: message,
        added: added_date,
        email: email,
    };

    // add to comment database
    knex.insert(raw)
        .into('comments')
        .then((fii)=>{
            console.log("Comment added successfully!");
            res.status('201').send("Comment added successfully!");
        })
        .catch((err)=>{
            console.log("Error adding comment : " + err);
            res.status('201').send("Error adding comment : " + err);
        });

}


module.exports = {
    answerHandler : answerHandler ,
}