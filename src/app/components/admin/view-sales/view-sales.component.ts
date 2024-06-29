import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SalesService } from 'src/app/services/sales.service';
import { Purchase } from 'src/app/models/purchase';

@Component({
  selector: 'app-view-sales',
  templateUrl: './view-sales.component.html',
  styleUrls: ['./view-sales.component.css']
})
export class ViewSalesComponent implements OnInit {
  sales: Purchase[] = [];
  searchForm: FormGroup;

  constructor(
    private salesService: SalesService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      query: ['']
    });
  }

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.salesService.getPurchases().subscribe({
      next: (data) => this.sales = data,
      error: (err) => console.error(err)
    });
  }

  searchSales(): void {
    const query = this.searchForm.get('query')?.value;
    if (query) {
      this.salesService.searchPurchases(query).subscribe({
        next: (data) => this.sales = data,
        error: (err) => console.error(err)
      });
    } else {
      this.loadSales();
    }
  }
}