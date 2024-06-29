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

  categories: string[] = [];
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private purchaseService: PurchaseService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: [''],
      category: [''],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.loadSales();

    this.searchForm.get('query')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.searchForm.get('category')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.searchForm.get('minPrice')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    this.searchForm.get('maxPrice')?.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadSales(): void {
    this.purchaseService.getPurchases().subscribe({
      next: (data) => {
        this.sales = data;
        this.filteredSales = data;
        this.extractCategories();
        this.noResultsMessage = data.length === 0 ? 'No se encontraron ventas' : '';
      },
      error: (err) => console.error(err)
    });
  }

  extractCategories(): void {
    this.categories = [...new Set(this.sales.map(sale => sale.productType))];
  }

  applyFilters(): void {
    let query = this.searchForm.get('query')?.value.toLowerCase() || '';
    let category = this.searchForm.get('category')?.value;
    let minPrice = this.searchForm.get('minPrice')?.value;
    let maxPrice = this.searchForm.get('maxPrice')?.value;

    this.filteredSales = this.sales.filter(sale => {
      return (
        (!query || sale.productName.toLowerCase().includes(query) || sale.userName.toLowerCase().includes(query)) &&
        (!category || sale.productType === category) &&
        (!minPrice || sale.productPrice >= minPrice) &&
        (!maxPrice || sale.productPrice <= maxPrice)
      );
    });

    this.noResultsMessage = this.filteredSales.length === 0 ? 'No se encontraron ventas con esos criterios de búsqueda' : '';
  }
}
