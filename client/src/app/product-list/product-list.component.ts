import { contains, equals, greater, operator, operators } from './operators';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductListService } from '../product-list.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  loading: boolean = true;
  products: any[] = [];
  filteredProducts: any[] | null = null;
  operators: operators = { 'contains': contains, '>': greater, '=': equals };
  columns: string[] = [];
  appliedFilters: any[] = [];
  frmFilter: FormGroup;

  constructor(
    private _productListService: ProductListService,
    fb: FormBuilder
  ) {
    this.frmFilter = fb.group({
      column: new FormControl(null, Validators.required),
      operator: new FormControl(null, Validators.required),
      value: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.getProduct();
  }

  get getColumns() {
    return Object.keys(this.products[0]);
  }

  get getOperators() {
    return Object.keys(this.operators);
  }

  getProduct() {
    this._productListService.getProducts().subscribe((res: any) => {
      for (let [key, value] of Object.entries(res)) {
        this.products.push(value);
      }
      this.filteredProducts = this.products;
      this.loading = false;
      this.clear(); // resets filter form
    });
  }

  remove(filter: any) {
    const index = this.appliedFilters.findIndex(
      (appliedFilter) =>
        appliedFilter.column == filter.column &&
        appliedFilter.operator == appliedFilter.operator &&
        appliedFilter.value.toLowerCase() == filter.value.toLowerCase()
    );

    if (index > -1) {
      this.appliedFilters.splice(index, 1);
      // TODO: refilter the UI
      if(this.appliedFilters.length) {
        this.filteredProducts = null;
        this.filter()
      } else {
        this.filteredProducts = this.products;
      }
  }
}

  clear() {
    this.frmFilter.patchValue({
      column: this.getColumns[0],
      operator: this.getOperators[0],
      value: '',
    });
  }

  add() {
    this.appliedFilters.push(this.frmFilter.value);
    // TODO: update the UI
    this.filter();

  }

  filter() {
    this.appliedFilters.forEach((appliedFilter) => {
      this.filteredProducts = (this.filteredProducts || this.products).filter((product) => {
        const key = appliedFilter.column;
        const operatorName = appliedFilter.operator as string;
        const operator = this.operators[operatorName];
        const value = appliedFilter.value as string;
        return operator(product[key], value);
      });
    });
  }

}
