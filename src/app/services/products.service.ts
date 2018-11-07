import { Injectable } from '@angular/core';
import { Product } from '../store/store.component';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { CartProduct } from './cart.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export class DBProduct {

    constructor() {

    }

    Id: string;
    Category: string;
    SubCategory: string;
    Name: string;
    By: string;
    Description: string;
    Price: number;
    ImageLink: string;
    Inventory: number;
    Rating: number;
    Raters: number;
}

export interface ProductRating {
    Id: string;
    Name: string;
    Rating: number;
}

export interface ProductCategory {
    Category: string;
    SubCategories: string[];
    ShowSub: boolean;
}

export interface Discount {
    percent_from: number;
    percent_to: number;
    discount: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    public allProducts: DBProduct[];
    public filteredProducts: DBProduct[] = [];
    public ratings: ProductRating[] = [];
    public categories: ProductCategory[] = [];
    public discounts: Discount[] = [];
    constructor(private db: AngularFirestore, private authService: AuthService) {
        // this.http.get('https://mybay.herokuapp.com/data').subscribe(data => {
        //   this.allProducts = (data as any).Products;
        //   console.log(this.allProducts);
        // })

        var all = this.db.collection('Products').snapshotChanges().pipe(map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as DBProduct;
                const id = a.payload.doc.id;
                data.Id = id;
                return { id, ...data };
            });
        }));

        all.subscribe(data => {
            this.allProducts = data as DBProduct[];
            this.allProducts.sort(this.compare);
            this.filteredProducts = data as DBProduct[];

            var categories = this.allProducts.filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.Category === thing.Category && t.SubCategory === thing.SubCategory
                ))
            )
            var main = this.removeDuplicates(categories, 'Category');
            this.categories = [];
            this.categories.push({ Category: 'All', SubCategories: null, ShowSub: false })
            main.forEach(c => {
                this.categories.push({ Category: c.Category, SubCategories: [], ShowSub: false })
            });
            categories.forEach(element => {
                this.categories.find(c => c.Category == element.Category).SubCategories.push(element.SubCategory);
            });

        });

        if (this.authService.authState) {


            this.db.collection('Users').doc(this.authService.authState.email).valueChanges().subscribe(data => {
                this.ratings = (data as any).Ratings as ProductRating[];

                if (this.ratings == null)
                    this.ratings = [];
            })
        }
        this.db.collection('General').doc('Discounts').valueChanges().subscribe(data => {
            this.discounts = (data as any).all as Discount[];

            if (this.discounts == null)
                this.discounts = [];
        })

        // this.db.collection('Products').valueChanges().subscribe(data => {

        //   var id = 0;

        //   data.forEach(element => {
        //     (element as any).Id = id;
        //     id++;
        //   });
        //   this.allProducts = data as DBProduct[];
        //   this.filteredProducts = data as DBProduct[];

        //   var categories = this.removeDuplicates(this.allProducts, 'SubCategory');
        //   var main = this.removeDuplicates(categories, 'Category');
        //   this.categories = [];
        //   this.categories.push({ Category: 'All', SubCategories: null, ShowSub: false })
        //   main.forEach(c => {
        //     this.categories.push({ Category: c.Category, SubCategories: [], ShowSub: false })
        //   });
        //   categories.forEach(element => {
        //     this.categories.find(c => c.Category == element.Category).SubCategories.push(element.SubCategory);
        //   });

        //   console.log(this.categories);

        // })
    }

    compare(a, b) {
        if (a.Category < b.Category)
            return -1;
        if (a.Category > b.Category)
            return 1;
        return 0;
    }

    removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    addProduct(product: DBProduct) {
        var id = this.db.createId();
        product.Id = id;
        this.allProducts.push(product)
        this.db.collection('Products').doc(id).set(Object.assign({}, product));
    }

    deleteProduct(product) {
        var index = this.allProducts.indexOf(product);
        this.allProducts.splice(index, 1);
        this.db.collection('Products').doc(product.Id).delete();
    }

    updateProduct(product: DBProduct) {
        this.db.collection('Products').doc((product.Id).toString()).update({ Name: product.Name, By: product.By, ImageLink: product.ImageLink, Description: product.Description, Category: product.Category, SubCategory: product.SubCategory, Inventory: product.Inventory, Price: product.Price });

    }

    public updateProductInventory(product: CartProduct) {

        //    const options = { headers: { 'Content-Type': 'application/json' } };
        this.allProducts.find(a => a.Id == product.Id).Inventory = product.Inventory;
        this.db.collection('Products').doc((product.Id).toString()).update({ Inventory: product.Inventory });
        // this.http.post('https://mybay.herokuapp.com/update', JSON.stringify({ Id: product.Id, Inventory: product.Inventory }), options).subscribe(res => {
        //   console.log(res);
        // })
    }

    public updateProductRating(product: DBProduct, rating, previousRating) {
        //    const options = { headers: { 'Content-Type': 'application/json' } };
        if (previousRating == 0) {

            var p = this.allProducts.find(a => a.Id == product.Id);

            p.Raters ? p.Raters += 1 : p.Raters = 1;

            if (p.Rating)
                p.Rating = +(p.Rating + ((rating - p.Rating) / p.Raters));
            else
                p.Rating = +rating;

            this.db.collection('Products').doc((product.Id).toString()).update({ Rating: p.Rating, Raters: p.Raters });
        }
        else {
            var p = this.allProducts.find(a => a.Id == product.Id);
            p.Rating = ((p.Rating * p.Raters) - rating) / p.Raters - 1;
            p.Rating = +(p.Rating + ((rating - p.Rating) / p.Raters));

            this.db.collection('Products').doc((product.Id).toString()).update({ Rating: p.Rating });
        }


        var ratedProduct = this.ratings.find(p => p.Id == product.Id);
        if (ratedProduct) {
            this.ratings.find(p => p.Id == product.Id).Rating = rating;
        }
        else {
            ratedProduct = { Rating: rating, Id: product.Id, Name: product.Name };
            this.ratings.push(ratedProduct);
        }

        this.db.collection('Users').doc(this.authService.u.email).update({ Ratings: this.ratings });
        // this.http.post('https://mybay.herokuapp.com/update', JSON.stringify({ Id: product.Id, Inventory: product.Inventory }), options).subscribe(res => {
        //   console.log(res);
        // })
    }

    updateDiscounts(discounts) {
        this.discounts = discounts;
        this.db.collection('General').doc('Discounts').update({ all: discounts });
    }
}
