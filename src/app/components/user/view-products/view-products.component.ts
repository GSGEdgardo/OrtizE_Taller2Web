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

  /**
   * @description Initializes the component, loads the products, and sets up the search form value changes subscription.
   */
  ngOnInit(): void {
    this.loadProducts();

    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(query => {
      this.searchProducts(query);
    });
  }

  /**
   * @description Loads available products from the server.
   */
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

  /**
   * @description Searches for products based on the provided query.
   * @param query string The search query.
   */
  searchProducts(query: string): void {
    if (query) {
      this.productService.searchAvailableProducts(query, 1, 10).subscribe({
        next: (data) => {
          this.filteredProducts = data;
          this.noResultsMessage = data.length === 0 ? 'No se encontraron productos con esos criterios de búsqueda' : '';
        },
        error: (err) => console.error(err)
      });
    } else {
      this.filteredProducts = this.products;
      this.noResultsMessage = '';
    }
  }

  /**
   * @description Opens the purchase modal for the selected product.
   * @param product Product The product to be purchased.
   */
  openPurchaseModal(product: Product): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  /**
   * @description Closes the purchase modal.
   */
  closePurchaseModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }

  /**
   * @description Submits a purchase request for the selected product.
   * @param data any The purchase data.
   */
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

  /**
   * @description Loads the next page of products.
   */
  nextPage(): void {
    if (this.products.length === this.pageSize) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  /**
   * @description Loads the previous page of products.
   */
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
