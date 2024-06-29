import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { ProductType } from 'src/app/models/product-type';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {

  products: Product[] = [];
  productTypes: ProductType[] = [];
  searchQuery: string = '';
  confirmDeleteModalVisible: boolean = false;
  addProductModalVisible: boolean = false;
  editProductModalVisible: boolean = false;
  newProduct: any = {
    name: '',
    price: 0,
    stock: 0,
    productTypeId: '',
    image: null
  };
  currentProduct: any = {
    id: null,
    name: '',
    price: 0,
    stock: 0,
    productTypeId: '',
    image: null
  };
  originalProduct: any = null;
  errorMessage: string = '';
  fieldErrors: any = {};
  productIdToDelete: number | null = null;

  constructor(private productService: ProductService) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    this.loadProducts();
    this.loadProductTypes();
  }

  /**
   * Loads all products by calling the ProductService.
   */
  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  /**
   * Loads all product types by calling the ProductService.
   */
  loadProductTypes(): void {
    this.productService.getProductTypes().subscribe(data => {
      this.productTypes = data;
    });
  }

  /**
   * Filters the products based on the search query.
   * @param event The input event from the search bar.
   */
  searchProducts(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (query) {
      this.productService.getProducts().subscribe(data => {
        this.products = data.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.productType.type.toLowerCase().includes(query)
        );
      });
    } else {
      this.loadProducts();
    }
  }

  /**
   * Opens the modal for adding a new product.
   */
  openAddProductModal(): void {
    this.addProductModalVisible = true;
  }

  /**
   * Closes the modal for adding a new product and resets form fields.
   */
  closeAddProductModal(): void {
    this.addProductModalVisible = false;
    this.errorMessage = '';
    this.fieldErrors = {};
    this.newProduct = {
      name: '',
      price: 0,
      stock: 0,
      productTypeId: '',
      image: null
    };
  }

  /**
   * Opens the modal for editing an existing product.
   * @param product The product to be edited.
   */
  openEditProductModal(product: Product): void {
    this.currentProduct = { ...product, productTypeId: product.productType.id };
    this.originalProduct = { ...product, productTypeId: product.productType.id }; // Guardar el producto original
    this.editProductModalVisible = true;
  }

  /**
   * Closes the modal for editing a product and resets form fields.
   */
  closeEditProductModal(): void {
    this.editProductModalVisible = false;
    this.errorMessage = '';
    this.fieldErrors = {};
    this.currentProduct = {
      id: null,
      name: '',
      price: 0,
      stock: 0,
      productTypeId: '',
      image: null
    };
    this.originalProduct = null;
  }

  /**
   * Handles the file selection for product image upload.
   * @param event The file input event.
   * @param isEdit Boolean flag indicating if the operation is for editing a product.
   */
  onFileSelected(event: Event, isEdit = false): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (isEdit) {
        this.currentProduct.image = file;
      } else {
        this.newProduct.image = file;
      }
    }
  }

  /**
   * Adds a new product by sending the form data to the ProductService.
   */
  addProduct(): void {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price);
    formData.append('stock', this.newProduct.stock);
    formData.append('productTypeId', this.newProduct.productTypeId);
    formData.append('image', this.newProduct.image);

    this.productService.addProduct(formData).subscribe({
      next: response => {
        console.log(response);
        alert(response);
        this.loadProducts();
        this.closeAddProductModal();
      },
      error: err => {
        if (err.status === 400 && err.error) {
          try {
            const errorJson = JSON.parse(err.error);
            this.setFieldErrors(errorJson.errors);
          } catch (e) {
            this.errorMessage = err.error;
          }
        } else {
          this.errorMessage = 'Unexpected error. Please try again.';
        }
        console.error('Error adding product', err);
      }
    });
  }

  /**
   * Updates an existing product by sending the form data to the ProductService.
   */
  updateProduct(): void {
    const formData = new FormData();
    const originalProduct = this.originalProduct;

    if (this.currentProduct.name !== originalProduct.name) {
      formData.append('name', this.currentProduct.name);
    }
    if (this.currentProduct.price !== originalProduct.price) {
      formData.append('price', this.currentProduct.price.toString());
    }
    if (this.currentProduct.stock !== originalProduct.stock) {
      formData.append('stock', this.currentProduct.stock.toString());
    }
    if (this.currentProduct.productTypeId !== originalProduct.productTypeId) {
      formData.append('productTypeId', this.currentProduct.productTypeId.toString());
    }
    if (this.currentProduct.image instanceof File) {
      formData.append('image', this.currentProduct.image);
    }

    this.productService.editProduct(this.currentProduct.id, formData).subscribe({
      next: response => {
        console.log(response);
        alert('Producto actualizado con éxito');
        this.loadProducts();
        this.closeEditProductModal();
      },
      error: err => {
        if (err.status === 400 && err.error) {
          try {
            const errorJson = JSON.parse(err.error);
            this.setFieldErrors(errorJson.errors);
          } catch (e) {
            this.errorMessage = err.error;
          }
        } else {
          this.errorMessage = 'Error inesperado. Por favor, inténtelo de nuevo.';
        }
        console.error('Error al actualizar el producto', err);
      }
    });
  }

  /**
   * Sets field-specific error messages.
   * @param errors The errors object returned from the server.
   */
  setFieldErrors(errors: any): void {
    this.fieldErrors = {};
    if (errors.Name) {
      this.fieldErrors.name = errors.Name[0];
    }
    if (errors.Image) {
      this.fieldErrors.image = errors.Image[0];
    }
    if (errors.ProductTypeId) {
      this.fieldErrors.productTypeId = errors.ProductTypeId[0];
    }
    if (errors.Price) {
      this.fieldErrors.price = errors.Price[0];
    }
    if (errors.Stock) {
      this.fieldErrors.stock = errors.Stock[0];
    }
  }

  /**
   * Opens the modal to confirm product deletion.
   * @param id The ID of the product to be deleted.
   */
  openConfirmDeleteModal(id: number): void {
    this.confirmDeleteModalVisible = true;
    this.productIdToDelete = id;
  }

  /**
   * Closes the modal for product deletion confirmation.
   */
  closeConfirmDeleteModal(): void {
    this.confirmDeleteModalVisible = false;
    this.productIdToDelete = null;
  }

  /**
   * Confirms the deletion of a product by calling the ProductService.
   */
  confirmDelete(): void {
    if (this.productIdToDelete !== null) {
      this.productService.deleteProduct(this.productIdToDelete).subscribe({
        next: response => {
          console.log(response);
          alert(response);
          this.loadProducts();
          this.closeConfirmDeleteModal();
        },
        error: err => {
          console.error('Error deleting product', err);
        }
      });
    }
  }
}
