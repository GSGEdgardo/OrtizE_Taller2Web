import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.component.html',
  styleUrls: ['./purchase-modal.component.css']
})
export class PurchaseModalComponent {
  @Input() product: any;
  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();
  purchaseForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.purchaseForm = this.fb.group({
      quantity: ['', [Validators.required, Validators.min(1)]]
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
}