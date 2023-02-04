import mongoose,{ DocTypeFromGeneric, Model, Query, Schema } from 'mongoose'
import String from "mongoose"
import {IbasicSchema, IDAO} from '../types'
export class MongoDAO implements IDAO {
    constructor(
        protected databaseObject: Schema<any>,
        protected basicSchema:any = {
            username: {
              type: String,
              required: true,
              unique: true
            },
            password: {
              type: String,
              required: true
            }
          }
    ){}
    table=():Model<any>=>mongoose.model("users",this.databaseObject)

    extendTable= (schemaObject:Schema<any>) => {
      return schemaObject.add(this.basicSchema)
    }
    findById = (id: string, dbModel: mongoose.Model<any>,cb:any): Query<any,any,{},any> =>{
        return dbModel.findById(id,cb)
    }
    createUser=  async (dbModel: mongoose.Model<any, {}, {}, {}, any>,userData:any): Promise<any> =>{
        return await dbModel.create(userData)
    }
    loginObjectCreator=(users: mongoose.Model<any, {}, {}, {}, any>, req: Request): ReadableStream<any> =>{
           let objeto:any 
            Object.keys(users.schema.obj).forEach(keyValue=>{
            if (req.body !==null && req.body[keyValue as keyof ReadableStream<any>]!==undefined){ 
              objeto={...objeto,[keyValue]:req.body[keyValue as keyof ReadableStream<any>]}}
            })
            return objeto
    }
}
