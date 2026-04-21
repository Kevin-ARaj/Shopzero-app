import {UserRes} from "./UserRes"
import {ProdInt} from "./prod-int"

export interface OrderInt{
    id:number,
    user:UserRes,
    items:ProdInt[],
    date:Date,
    totalAmount:number                            
}