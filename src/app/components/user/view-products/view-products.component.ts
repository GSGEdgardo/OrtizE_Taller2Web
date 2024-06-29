import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { PurchaseService } from 'src/app/services/purchase.service';
import { AccountService } from 'src/app/services/account.service';
import { debounceTime } from 'rxjs';

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
  filteredProducts: Product[] = [];
  noResultsMessage: string = '';

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

    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(query => {
      this.searchProducts(query);
    });
  }

  loadProducts(): void {
    this.productService.getAvailableProducts(1, 10).subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.noResultsMessage = data.length === 0 ? 'No se encontraron productos' : '';
      },
      error: (err) => console.error(err)
    });
  }

  searchProducts(query: string): void {
    const lowerCaseQuery = query.toLowerCase();
    if (query) {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.productType.type.toLowerCase().includes(lowerCaseQuery)
      );
      this.noResultsMessage = this.filteredProducts.length === 0 ? 'No se encontraron productos con esos criterios de búsqueda' : '';
    } else {
      this.filteredProducts = this.products;
      this.noResultsMessage = '';
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
