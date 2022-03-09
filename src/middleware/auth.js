// const authenticate = function(req, res, next) {
//     //check the token in request header
//     //validate this token

//     next()
// }


const authorise = function(req, res, next) {
    // comapre the logged in user's id and the id in request
    if(!token) return res.send({status: false, msg: "token must be present in the request header"})
    let decodedToken = jwt.verify(token, 'functionup-thorium')
    //console.log(decodedToken);
    if(!decodedToken) return res.send({status: false, msg:"token is not valid"})
    
    //userId for which the request is made. In this case message to be posted.
    let userToBeModified = req.params.userId
    //userId for the logged-in user
    let userLoggedIn = decodedToken.userId

    //userId comparision to check if the logged-in user is requesting for their own data
    if(userToBeModified != userLoggedIn) return res.send({status: false, msg: 'User logged is not allowed to modify the requested users data'})

    next()
}

    module.exports.authorise = authorise 
