import { ProductType } from "./product-type";

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    imgUrl: string;
    productType: ProductType;
}