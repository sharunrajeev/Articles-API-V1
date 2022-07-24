const fs=require('fs')
const passport=require('passport')
const {Admin}= require('../models/admin')
const JwtStratergy=require('passport-jwt').Strategy
const ExtractJwt=require('passport-jwt').ExtractJwt

// Comment this if you are not using this in the deployment
const PUB_KEY=process.env.PUBLIC_KEY

// Uncomment this when you are executing the project locally with the public key file in the keys folder
// const PUB_KEY=fs.readFileSync(__dirname+"/../keys/publicKey.pem","utf-8")

const options={
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:PUB_KEY,
    algorithms:['RS256']
}

const stratergy=new JwtStratergy(options,async(payload,done)=>{
    await Admin.findOne({where:{username:payload.sub}}).then((user)=>{
        if(user){
            return done(null,user)
        }
        else{
            return done(null,false)
        }
    }).catch(err=>done(err,null))

})

module.exports=(passport)=>{
    passport.use(stratergy)
}