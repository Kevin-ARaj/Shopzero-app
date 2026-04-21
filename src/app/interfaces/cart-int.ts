import { ProdInt } from "./prod-int";
import { UserRes } from "./UserRes";

export interface CartInt{
    id:string,
    user:UserRes,
    product:ProdInt,
    quantity:number
}