import { createServer } from 'http';
import express from 'express';


const app = express()
var i =0


app.get('/', (req, res)=>{
    i++
    console.log(`Recieved [${i}] 'get' request(s) at localhost...`)
    // console.log(req)
    console.log(res.req.query)
    res.status('201').send("<h1>My test server says :</h1><br><h2>HELLO, WORLD!</h2>  <i>Big server</i> is listening...")
})

app.post('/', (req, res)=>{
    i++
    console.log(`Recieved [${i}] 'get' request(s) at localhost...`)
    console.log(res.req.query)
    // console.log(res)
    res.status('201').send("<h1>My test server says :</h1><br><h2>HELLO, WORLD!</h2>  <i>Big server</i> is listening...")
    // console.log(req)
})

app.listen(8080)
console.log("I am server!")