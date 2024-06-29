import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.css']
})
export class PurchaseModalComponent implements OnInit {
  @Input() product: any;
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  purchaseForm: FormGroup;
  total: number = 0;
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.purchaseForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.purchaseForm.get('quantity')?.valueChanges.subscribe(value => {
      this.calculateTotal();
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.purchaseForm.valid) {
      this.submit.emit(this.purchaseForm.value);
    }
  }

  calculateTotal(): void {
    const quantity = this.purchaseForm.get('quantity')?.value || 0;
    if (quantity < 0) {
      this.errorMessage = 'La cantidad no puede ser negativa';
      this.total = 0;
    } else {
      this.errorMessage = '';
      this.total = quantity * this.product.price;
    }
  }
}
