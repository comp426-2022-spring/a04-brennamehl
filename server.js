const minimist = require("minimist")
const args = minimist(process.argv.slice(2))
args['port']
args['help']
args['debug']
args['log']

const help = `server.js [options]
        --port	Set the port number for the server to listen on. Must be an integer between 1 and 65535.

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
const logdb  = require("./database.js")
const express = require("express")
const app = express()

//sets port number
const port = args.port ||process.env.port|| 5555

const server = app.listen(port, () => {
    console.log(`App is running on port %PORT%`.replace(`%PORT%`,port))
     })
    
    
//if debug is true, returns access log and error message
if(args.debug){

app.get("/app/log/access", (req, res, next) =>{
    try{
        const logs = logdb.prepare('SELECT * FROM accesslog').all()
        res.status(200).json(stmt)
    } catch{
        console.error(e)
    }
    next()
});

app.get("/app/log/error", (req, res, next) => {
    throw new Error('Error Test Successful')
    next()
});

}
if(args.log){
    //app.post?
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


 /** Coin flip functions 
 * This module will emulate a coin flip given various conditions as parameters as defined below
 */

/** Simple coin flip
 * 
 * Write a function that accepts no parameters but returns either heads or tails at random.
 * 
 * @param {*}
 * @returns {string} 
 * 
 * example: coinFlip()
 * returns: heads
 * 
 */

function coinFlip() {
    if(Math.random() < 0.5){
      return 'heads'
    }
    else{
      return 'tails'
    }
    }
    
    /** Multiple coin flips
     * 
     * Write a function that accepts one parameter (number of flips) and returns an array of 
     * resulting "heads" or "tails".
     * 
     * @param {number} flips 
     * @returns {string[]} results
     * 
     * example: coinFlips(10)
     * returns:
     *  [
          'heads', 'heads',
          'heads', 'tails',
          'heads', 'tails',
          'tails', 'heads',
          'tails', 'heads'
        ]
     */
    
    function coinFlips(flips) {
      const flipArr = []
      for(let i = 0; i<flips; i++){
        flipArr[i] = coinFlip()
      }
      return flipArr
    }
    
    /** Count multiple flips
     * 
     * Write a function that accepts an array consisting of "heads" or "tails" 
     * (e.g. the results of your `coinFlips()` function) and counts each, returning 
     * an object containing the number of each.
     * 
     * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
     * { tails: 5, heads: 5 }
     * 
     * @param {string[]} array 
     * @returns {{ heads: number, tails: number }}
     */
    
    function countFlips(array) {
      let heads = 0
      let tails = 0
      let countObject
      for(let i = 0; i<array.length; i++){
        if(array[i]==='heads'){
          heads++
        }
        else{
          tails++
        }
      }
      if(heads>0 && tails>0){
          countObject = {heads: heads, tails: tails}
      }
      else if(tails==0){
           countObject = {heads: heads}
      }
      else{
          countObject = {tails: tails}
      }
      return countObject
    }
    
    /** Flip a coin!
     * 
     * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
     * 
     * @param {string} call 
     * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
     * 
     * example: flipACoin('tails')
     * returns: { call: 'tails', flip: 'heads', result: 'lose' }
     */
    
    function flipACoin(call) {
    let flipObject = {call: call, flip: coinFlip(), result: ''}
    if(flipObject.call === flipObject.flip){
      flipObject.result = 'win'
    } 
    else{
      flipObject.result = 'lose'
    }
    return flipObject
    }