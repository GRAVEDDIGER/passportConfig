import { DocTypeFromGeneric, Model, Models } from "mongoose";
// type AuthObjectType ={
//     clientID:string,
//   clientSecret: string,
//   callbackURL:string
// }
export interface IpassportConfigBuilderReturn {
    buildLocalConfig:()=>IpassportConfigBuilderReturn, 
    setCrypt:(value:boolean)=>IpassportConfigBuilderReturn,
    GoogleoAuth: (authObject:AuthenticateOptionsGoogle,loginOnly:boolean)=>IpassportConfigBuilderReturn,
    setUserNotFoundMessage:(userNotFoundMessageParam:string)=>IpassportConfigBuilderReturn,
    setIncorrectPassword:(incorrectPasswordParam:string)=>IpassportConfigBuilderReturn,
    setUserAlrreadyExistsMessage:(userExistsParam:string)=>IpassportConfigBuilderReturn,
    users:Models,
    googleAuthModel:Models
}
export interface googleUser {
    username:string,
    name?:string,
    lastName?:string,
    avatar?:string
}
export interface IlocalSchema{
    username:string,
    password:string,
    [key:string]:string|number|boolean

}
export interface IbasicSchema{
       username: {
          type: String,
          required: boolean,
          unique: boolean
        },
        password: {
          type: String,
          required: boolean
        }
      }

export interface IDAO {
    table: ()=> Model<any>
    extendTable:(schema:Schema<any>)=> Schema<any>
    findById(id:string,dbModel:Model<any>,cb:any): Query<any,any,{},any>
    async createUser(dbModel:Model<any>,userData:any): Promise<any>
    loginObjectCreator(users:Model<any>,req:Request): ReadableStream<any>

}