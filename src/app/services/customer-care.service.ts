import { Injectable } from "@angular/core";
import { ReplaySubject, Observable, BehaviorSubject, Subscription } from "rxjs";
import { Branch } from "../branch";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class CustomerCareService {
  private selectedBranches = new ReplaySubject<string>(1);

  private dateRange;
  branchesChanged$ = this.selectedBranches.asObservable();

  branches$ = new BehaviorSubject([]);
  constructor(private httpClient: HttpClient) { }

  /**
   * @description - request all branches from server according to the submitted date range
   */
  getCenters(all = false): Subscription {
    let url: string;
    if (all) {
      url = "comments/centers/list";

    } else {
      url = "centers";

    }
    return this.httpClient
      .get(environment.api + url, {
        params: {
          date_init: this.getDate().begin,
          date_end: this.getDate().end
        }
      })
      .pipe(take(1))
      .subscribe((centers: Array<any>) => this.branches$.next(centers));
  }

  /**
   *
   * @param branches - a list of the provided branches in selection input
   * @description - update the branches in the observable to make then
   * available from any component
   */
  selectBranches(branches: Array<Branch>): void {
    this.selectedBranches.next(
      branches.map(ele => {
        return ele.id;
      }).join(',')
    );
  }

  /**
   *
   * @param range - date range from the selection input
   * @description - transform the selected input into an object with moment format
   */
  saveDateRange(range: any): void {
    const newDate = {
      begin: moment(range.begin).format("DD/MM/YYYY"),
      end: moment(range.end).format("DD/MM/YYYY")
    };
    this.dateRange = newDate;
  }

  /**
   * @return selected date with moment format
   */
  getDate(): any {
    return this.dateRange;
  }
}
