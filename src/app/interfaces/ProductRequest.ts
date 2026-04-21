import { UserRes } from "./UserRes"
export interface ProductRequest{

    user:UserRes,
    name:string,
    Description:string,
    price:number,
    image:string,
    discount:number,
    availability:boolean,
    brand:string,
    rating:number
}
