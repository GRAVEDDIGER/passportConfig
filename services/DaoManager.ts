import { Schema } from "mongoose";
import { IDAO } from "../types";
import { MongoDAO } from "./mongoDAO";
export class DaoManager{
    MongoManager:IDAO
    constructor(
        schemaObject:Schema<any>
    ){
        this.MongoManager=new MongoDAO(schemaObject);
    }
}