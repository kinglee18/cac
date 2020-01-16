import { Component, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { MatSelect } from "@angular/material";
import { take, takeUntil } from "rxjs/operators";
import { CustomerCareService } from "./customer-care.service";
import { Branch } from "./branch";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private customerService: CustomerCareService) {}
  protected branches: Branch[] = [];
  public branchMultiCtrl: FormControl = new FormControl();
  public dateRange: FormControl = new FormControl();
  public branchMultiFilterCtrl: FormControl = new FormControl();
  public filteredBranchesMulti: ReplaySubject<Branch[]> = new ReplaySubject<
    Branch[]
  >(1);
  protected _onDestroy = new Subject<void>();
  @ViewChild("multiSelect", { static: true }) multiSelect: MatSelect;

  ngOnInit() {
    this.customerService.getCenters().subscribe((centers: Array<any>) => {
      console.log(centersy);
      
      this.filteredBranchesMulti.next(centers.slice());
    });

    this.branchMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBranchesMulti();
      });
    this.branchMultiCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(data => {
        this.customerService.selectBranches(data);
      });
    this.dateRange.valueChanges.subscribe(date => {
      this.customerService.setDateRange(date);
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredBranchesMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.branchMultiCtrl.patchValue(val);
        } else {
          this.branchMultiCtrl.patchValue([]);
        }
      });
  }

  protected filterBranchesMulti() {
    if (!this.branches) {
      return;
    }
    let search = this.branchMultiFilterCtrl.value;
    if (!search) {
      this.filteredBranchesMulti.next(this.branches.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBranchesMulti.next(
      this.branches.filter(
        branch => branch.name.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
