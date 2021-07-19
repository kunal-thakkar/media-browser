import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Filters } from '../dashboard/dashboard.component';
import { StorageService } from '../storage.service';

export interface DialogData {
  category: string;
}

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent implements OnInit {

  categoryInput: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[];

  constructor(
    private storage: StorageService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.options = this.storage.movieFilters.filter((f: Filters) => f.isCustom).map((f: Filters) => f.title);

    this.filteredOptions = this.categoryInput.valueChanges.pipe(
      map(value => this.data.category = value),
      startWith(''),
      map(value => this._filter(value))
    )
  }

  private _filter(value): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
