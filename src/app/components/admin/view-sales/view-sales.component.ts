import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Purchase } from 'src/app/models/purchase';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.css']
})
export class ViewSalesComponent implements OnInit {
  sales: Purchase[] = [];
  filteredSales: Purchase[] = [];
  searchForm: FormGroup;
  noResultsMessage: string = '';

  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    this.loadSales();

    this.searchForm.get('query')?.valueChanges.subscribe(query => {
      this.searchSales(query);
    });
  }

  loadSales(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (data) => {
        this.sales = data;
        this.filteredSales = data;
        this.noResultsMessage = data.length === 0 ? 'No se encontraron ventas' : '';
      },
      error: (err) => console.error(err)
    });
  }

  searchSales(query: string): void {
    if (query) {
      query = query.toLowerCase();
      this.filteredSales = this.sales.filter(sale =>
        sale.productName.toLowerCase().includes(query) ||
        sale.productType.toLowerCase().includes(query) ||
        sale.userName.toLowerCase().includes(query) ||
        sale.purchaseDate.toLowerCase().includes(query) ||
        sale.productPrice.toString().toLowerCase().includes(query) ||
        sale.quantity.toString().toLowerCase().includes(query) ||
        sale.totalPrice.toString().toLowerCase().includes(query)
      );
      this.noResultsMessage = this.filteredSales.length === 0 ? 'No se encontraron ventas con esos criterios de búsqueda' : '';
    } else {
      this.filteredSales = this.sales;
      this.noResultsMessage = '';
    }
  }
}
