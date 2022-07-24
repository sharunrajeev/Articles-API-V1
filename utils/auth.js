const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const fs=require('fs')

// Comment this if you are not using this in the deployment
const PUBLIC_KEY=process.env.PUBLIC_KEY
const PRIVATE_KEY=process.env.PRIVATE_KEY

// Uncomment this when you are executing the project locally with the public key file in the keys folder
// const PRIVATE_KEY=fs.readFileSync(__dirname+"/../keys/privateKey.pem")
// const PUBLIC_KEY=fs.readFileSync(__dirname+'/../keys/publicKey.pem')

function genPassword(password){
    var salt=crypto.randomBytes(32).toString('hex')
    const genHash=crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex')

    return {
        salt:salt,
        hash:genHash
    }
}


const validatePassword=(password,hash,salt)=>{
    const hashedPassword=crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex')

    return hashedPassword===hash

}


function issueJWT(admin,expiration){

 
    const username=admin.username;
    // console.log(username)
    const expiresIn=expiration;
    const payload={
        sub:username,
        iat:Date.now()
    }

    
const signedToken=jwt.sign(payload,PRIVATE_KEY,{expiresIn:expiresIn,algorithm:'RS256'})

return {
    token:signedToken,
    expires:expiresIn
}


}

module.exports.authMiddleware=(req,res,next)=>{
    const token=req.cookies.accessToken;
    console.log(req.cookies.accessToken)
    if(!token){
        res.status(403).json({success:false,message:'Forbidden'})
    }
    try{
        const data=jwt.verify(token,PUBLIC_KEY)
        console.log(data)
        next()
    }

    catch(err){
        res.status(401).json({success:false,message:'Unauthorized'})
    }

    
}


module.exports.genPassword=genPassword
module.exports.issueJWT=issueJWT
module.exports.validatePassword=validatePassword