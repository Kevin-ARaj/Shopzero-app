import { ProdInt } from "./prod-int";
import { UserRes } from "./UserRes";

export interface OrderResponse {
    id: number;
    user: UserRes;
    items: ProdInt[];
    date: Date;
    totalAmount: number;
}