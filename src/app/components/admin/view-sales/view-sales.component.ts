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
        this.noResultsMessage = data.length === 0 ? 'No se encontraron ventas' : '';
      },
      error: (err) => console.error(err)
    });
  }

  searchSales(query: string): void {
    if (query) {
      this.purchaseService.searchPurchases(query).subscribe({
        next: (data) => {
          this.sales = data;
          this.noResultsMessage = data.length === 0 ? 'No se encontraron ventas con esos criterios de búsqueda' : '';
        },
        error: (err) => console.error(err)
      });
    } else {
      this.loadSales();
    }
  }
}
