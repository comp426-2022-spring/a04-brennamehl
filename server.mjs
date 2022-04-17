import minimist from "minimist"
const args = minimist(process.argv.slice(2))
args['port']
args['help']
args['debug']
args['log']

const help = `server.js [options]
--port	Set the port number for the server to listen on. Must be an integerbetween 1 and 65535.

--debug	If set to \`true\`, creates endpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message \"Error test successful.\" Defaults to 
            \`false\`.

--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help	Return this message and exit.`;

//If help is true, prints the help content to the log
if(args.help||args.h){
    console.log(help)
    process.exit(0)
}

//other imports and dependencies
import {coinFlip, coinFlips, countFlips, flipACoin} from "./modules/coin.mjs"
import logdb  from "./database.js"
import express from "express"
const app = express()

//sets port number
const port = args.port ||process.env.port|| 5555

const server = app.listen(port, () => {
    console.log(`App is running on port %PORT%`.replace(`%PORT%`,port))
     })
    
    
//if debug is true, returns access log and error message
if(args.debug){

}

if(args.log){
    //write log files to database
}


//multiple flips endpoint
app.get("/app/flips/:number", (req, res) =>{
    let flipsArr = coinFlips(req.params.number)
    res.status(200).json({ "raw" : flipsArr , "summary": countFlips(flipsArr)})
    res.type("text/plain")
})  

//flip with heads guess endpoint
app.get("/app/flip/call/heads", (req, res) =>{
    let result = flipACoin("heads")
    res.status(200).json({"call" : result.call, "flip" : result.flip, "result" : result.result})
    res.type("text/plain")
})

//flip with tails guess endpoint
app.get("/app/flip/call/tails", (req, res) =>{
    let result = flipACoin("tails")
    res.status(200).json({"call" : result.call, "flip" : result.flip, "result" : result.result})
    res.type("text/plain")
})

//flip endpoint
app.get("/app/flip", (req, res) =>{
    res.status(200).json({ "flip" : coinFlip() })
    res.type("text/plain")
})

 //default endpoint
app.get("/app", (req, res) =>{
     res.statusCode = 200
     res.statusMessage = 'OK';
     res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' })
     res.end(res.statusCode+ ' ' +res.statusMessage)
      
//endpoint for nonexistent URL
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
    res.type("text/plain")
 })
 })
