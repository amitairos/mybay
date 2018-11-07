import { Component, OnInit } from '@angular/core';
import { CartService, Purchase } from '../services/cart.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { ProductsService } from '../services/products.service';
import { PaymentsService } from '../services/payments.service';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {

  constructor(public cartService: CartService, private productsService: ProductsService, private paymentsService: PaymentsService,
    private http: HttpClient, private authService: AuthService, private db: AngularFirestore, private dialog: MatDialog) { }

  ngOnInit() {
  }


  removePurchase(purchase) {
    this.cartService.removePurchase(purchase);
  }

  cancelPurchase(purchase: Purchase) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      Title: "Cancel Purchase",
      Body: "Are you sure you want to cancel this purchase?"
    };

    const dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          
          this.cartService.cancelPurchase(purchase).then(canceled => {
            if (canceled) {

              this.paymentsService.addPayment(false, purchase.PriceSum, new Date(Date.now()), purchase.PaymentMethod, purchase.CCNumber).then(refunded => {
                
                  const options = { headers: { 'Content-Type': 'application/json' } };
                  this.db.collection('Users').doc(this.authService.authState.email).ref.get().then(data => {
                    var first = data.data().FirstName;
                    var last = data.data().LastName;

                    var subject = "MyBay Purchase Cancellation"
                    var body = "Hi " + first + " " + last + "<br/><br/>";
                    body += `As you requested, your purchase for the following items has been canceled: <br/><br/>`;

                    purchase.Products.forEach(product => {
                      body += `<div style='display: flex; width: 100%; margin:20px; align-items:left center; justify-content: left; text-align: left'>
                  <div style='width: 15%;'>
                  <img src="${product.Image}" style='max-width: 100%;
                  max-height: 100px;
                  display: block;'/>
                  </div>
                  `
                      body += "<div style='margin: 10px;'><b>" + product.Name + "</b><br/>Price: <b>$" + product.Price + "</b><br/>Quantity: <b>" + product.Quantity + "</b>.</div> </div>";
                    });

                    body += `<br/>
            You have been refunded <b>$${purchase.PriceSum.toFixed(2)}</b><br/><br/>

            Thank you for using MyBay<br/>
            <img src="https://mybay-990af.firebaseapp.com/assets/myBay.png" style=' height: auto;
              width: auto;
              max-height: 100px;
              max-width: 150px;
              object-fit: cover;'/>
              `
                    this.http.post('https://mybay.herokuapp.com/email', JSON.stringify({ email: this.authService.authState.email, subject: subject, body: body }), options).subscribe(res => {
                      console.log(res);
                      purchase.Products.forEach(p => {
                        p.Inventory += p.Quantity;
                        this.productsService.allProducts.forEach(product => {
                          if (p.Id == product.Id)
                            this.productsService.updateProductInventory(p);
                        });
                      });
                    })
                  });

              });
            }
          });

        }
        else {

        }

      }
    );
  }

}
