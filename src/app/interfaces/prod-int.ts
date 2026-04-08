export interface ProdInt {
    "product_id": number,
          "name":string,
          "description":string,
          "price": number,
          "unit": string,
          "image": string,
          "discount": number,
          "availability": boolean,
          "brand": string,
          "category": string,
          "rating": number,
          "reviews": [
            {
              "user_id":number,
              "rating": number,
              "comment":string
            },
            {
              "user_id":number,
              "rating": number,
              "comment":string
            }
          ],
          "id": "30fb"
}
