import { Component } from "@angular/core";
import template from "./TubeListPage.component.html";
import { TubesCollection } from "../../../../both/collections/tubes.collection";
import { Observable } from "rxjs";
import { Tube } from "../../../../both/models/tube.model";
import style from "./TubeListPage.component.scss";
import { TubesDataService } from "../share/TubesService";
import { Router} from '@angular/router';


@Component({
  selector: "TubeListPage",
  template,
  styles: [ style ],
  providers: [TubesDataService]


})
export class TubeListPageComponent {
  	TubeItems: Observable<Tube[]>;
    tubesDataService: TubesDataService
	categoryName: string;

    constructor(tubesDataService: TubesDataService, private router: Router) {
        this.tubesDataService = tubesDataService
    }
    GoTubeListCategory(value: string){
	  this.categoryName = 'tubelist/category/'+value;
	  this.router.navigate([this.categoryName]);

	}
}
