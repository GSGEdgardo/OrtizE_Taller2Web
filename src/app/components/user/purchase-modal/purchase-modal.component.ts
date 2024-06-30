import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.css']
})
export class PurchaseModalComponent implements OnInit {
  @Input() product: any;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ quantity: string }>();
  purchaseForm: FormGroup;
  total: number = 0;
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.purchaseForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * @description Initializes the component, sets up the value change subscription for the quantity field.
   */
  ngOnInit(): void {
    this.purchaseForm.get('quantity')?.valueChanges.subscribe(value => {
      this.calculateTotal();
    });
  }

  /**
   * @description Emits the close event to close the modal.
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * @description Emits the submit event with the purchase form value if the form is valid.
   */
  onSubmit(): void {
    if (this.purchaseForm.valid) {
      this.submit.emit(this.purchaseForm.value);
    }
  }

  /**
   * @description Calculates the total price based on the quantity and product price.
   */
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
