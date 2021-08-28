
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Language, SelectOption } from '../shared/model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input('langOpt') langOpt: SelectOption[];
  @Input('sortOpt') sortOpt: SelectOption[];
  @Input('groupOpt') groupOpt: SelectOption[];
  @Output('selection') onFilterApply: EventEmitter<any> = new EventEmitter();;

  languages: FormControl = new FormControl();
  showFilter: boolean;

  fg: FormGroup = this.fb.group({
    'certification_country': [],
    'certification': [],
    'primary_release_date.gte': [],
    'primary_release_date.lte': [],
    'with_original_language': [],
    'sort_by': [],
    'group_by': []
  });

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.fg.controls['with_original_language'].setValue(this.getDefaults(this.langOpt));
    this.fg.controls['sort_by'].setValue(this.getDefault(this.sortOpt));
    this.fg.controls['group_by'].setValue(this.getDefault(this.groupOpt));
  }

  private getDefault(optGrp: SelectOption[]): string {
    let dOpt = optGrp ? optGrp.filter(o => o.selected)[0] : null;
    return dOpt ? dOpt.value : null;
  }

  private getDefaults(optGrp: SelectOption[]): string[] {
    return optGrp ? optGrp.filter(o => o.selected).map(o => o.value) : [];
  }

  applyFilter() {
    this.onFilterApply.emit(this.fg.getRawValue());
    this.showFilter = false;
  }

  resetFilter() {
    this.fg.reset({ group_by: 'genre' });
    this.onFilterApply.emit(this.fg.getRawValue());
    this.showFilter = false;
  }
}
