import { Models,Schema as SchemaType} from "mongoose"
import { AuthenticateOptionsGoogle } from "passport-google-oauth20"
import {  IpassportConfigBuilderReturn, IlocalSchema } from './types';
import DAOSelectorObject from './services/selectorDAO';
import { loggerObject } from './helper/loggerHLP';
//const DAOSelectorObject=DAOs as unknown as DAOs.default
const passport =require( 'passport')
const bcrypt=require( 'bcrypt')
const GoogleStrategy=require( 'passport-google-oauth20').Strategy
const {registerStrategy,loginStrategy} = require('./strategies/local')
const oAuthModes=require('./strategies/oAuth2')
////////////////
//SCHEMAS

function passportConfigBuilder (schemaObject:SchemaType<IlocalSchema>,dbType: "MONGO" ="MONGO"): IpassportConfigBuilderReturn {
//////////////////
//variables
/////////////////
  const DAOlocal=new DAOSelectorObject[dbType](schemaObject,"localSchema") // DaoMongo(schemaObject,"localSchema")
  const DAOgoa=new DAOSelectorObject[dbType](schemaObject,"goaSchema")//DaoMongo(schemaObject,"goaSchema")
  let userNotFoundMessage:string =""
  let incorrectPasswordMessage:string
  let userAlrreadyExistsMessage:string
  let crypt = true
  let hasVerificationFlag:boolean=false
  let notVerifiedMessage:string


  ///////////////
  //FUNCTIONS
  //////////////
  
  ////// HELPERS////////
  const createHash = (password:string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  const isValid = (user:any, password:string) => bcrypt.compareSync(password, user.password as string)  
  
  /////////SETERS////////
  function setUserNotFoundMessage(this:IpassportConfigBuilderReturn, userNotFoundParam:string){
    userNotFoundMessage=userNotFoundParam
    return this
  }
  function setIncorrectPassword(this:IpassportConfigBuilderReturn, incorrectPasswordParam:string){

    incorrectPasswordMessage=incorrectPasswordParam
    return this
  }
  function setUserAlrreadyExistsMessage(this:IpassportConfigBuilderReturn, userExistsParam:string){
    userAlrreadyExistsMessage =userExistsParam
    return this
  }
  function setCrypt (this:IpassportConfigBuilderReturn ,value:boolean):IpassportConfigBuilderReturn {
    crypt = value
    return this 
  }
  function hasVerification (this:IpassportConfigBuilderReturn):IpassportConfigBuilderReturn{
    hasVerificationFlag=true
    return this
  }
  function setNotVerifiedMessage(this:IpassportConfigBuilderReturn,message:string):IpassportConfigBuilderReturn{
    notVerifiedMessage=message
    return this
  }
  /////////BUILDERS///////////////////
  function buildLocalConfig (this:IpassportConfigBuilderReturn):IpassportConfigBuilderReturn {
    registerStrategy(DAOlocal,userAlrreadyExistsMessage,createHash,crypt,hasVerificationFlag)
    passport.serializeUser(async (user:Models, done:any) => {
      loggerObject.debug.debug({level:"debug",message:"serializeUser",data:await user["_id"]})
      done(null,await user._id)
    })
    passport.deserializeUser(async (id:string, done:any) => {
     await DAOlocal.findById(id,done) //users.findById(id, done)
    })
    loginStrategy(DAOlocal,userNotFoundMessage,incorrectPasswordMessage,isValid,notVerifiedMessage)
    return this
  }
  function GoogleoAuth (this:IpassportConfigBuilderReturn, authObject:AuthenticateOptionsGoogle, loginOnly = false):IpassportConfigBuilderReturn {
   console.log(oAuthModes)
    const {justLogin,loginAndRegister}=oAuthModes(DAOgoa,DAOlocal,userNotFoundMessage) //oAuthModes(DAOgoa.model,DAOlocal.model,userNotFoundMessage)
    passport.use(new GoogleStrategy(authObject,
      (loginOnly) ? justLogin : loginAndRegister))
    passport.serializeUser(async (user:Models, done:any) => {
      done(null,await user._id)
    })
    passport.deserializeUser((id:string, done:any) => {
     if (loginOnly){DAOlocal.findById(id,done)}
     else {DAOgoa.findById(id,done)}
      //googleAuthModel.findById(id, done)
    })
    return this
  }
  return { buildLocalConfig, setCrypt, GoogleoAuth,setUserNotFoundMessage,setIncorrectPassword,setUserAlrreadyExistsMessage,hasVerification,setNotVerifiedMessage,localModel:DAOlocal.model,goaModel:DAOgoa.model }
}


module.exports = passportConfigBuilder
