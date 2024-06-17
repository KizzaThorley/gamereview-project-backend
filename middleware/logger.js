export default function logger(req, res, next) {

    console.log(`--------------------------------
   INCOMING REQUEST!
   🎮 Request Method: ${req.method}
   🎮 Request URL: ${req.url}
   🎮 Request Body: 
  ${JSON.stringify(req.body, null, 2)}
  ❓ Request Query: ${req.query}
  --------------------------------`)
  
    next()
  }