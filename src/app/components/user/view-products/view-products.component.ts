import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { PurchaseService } from 'src/app/services/purchase.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit {
  products: Product[] = [];
  searchForm: FormGroup;
  currentPage: number = 1;
  pageSize: number = 5;
  showModal: boolean = false;
  selectedProduct: any = null;
  totalProducts: number = 0;

  constructor(
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private accountService: AccountService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAvailableProducts(this.currentPage, this.pageSize).subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error(err)
    });
  }

  loadTotalProducts(): void {
    this.productService.getAvailableProducts(1, this.pageSize).subscribe({
      next: (data) => {
        this.totalProducts = data.length;
      },
      error: (err) => console.error(err)
    });
  }

  searchProducts(): void {
    const query = this.searchForm.get('query')?.value.trim();
    if (!query) {
      this.loadProducts();
    } else {
      this.productService.searchAvailableProducts(query, this.currentPage, this.pageSize).subscribe({
        next: (data) => this.products = data,
        error: (err) => console.error(err)
      });
    }
  }

  openPurchaseModal(product: Product): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  closePurchaseModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }

  submitPurchase(data: any): void {
    const userId = this.accountService.currentAccountValue?.id.toString() || '';
    const purchase = { quantity: data.quantity.toString(), userId, productId: this.selectedProduct.id.toString() };
    this.purchaseService.makePurchase(purchase).subscribe({
      next: () => {
        alert('Compra realizada con éxito');
        this.loadProducts();
        this.closePurchaseModal();
      },
      error: (err) => console.error(err)
    });
  }

  nextPage(): void {
    if (this.products.length === this.pageSize) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
