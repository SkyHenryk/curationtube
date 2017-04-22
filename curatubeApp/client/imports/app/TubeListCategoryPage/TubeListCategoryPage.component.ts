import { Component, OnChanges } from "@angular/core";
import template from "./TubeListCategoryPage.component.html";
import style from "./TubeListCategoryPage.component.scss";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { TubesCollection } from "../../../../both/collections/tubes.collection";
import { Observable } from "rxjs";
import { Tube } from "../../../../both/models/tube.model";
import { TubesDataService } from "../share/TubesService";


@Component({
  selector: "TubeListCategoryPage",
  template,
  styles: [ style ],
  providers: [TubesDataService]

})
export class TubeListCategoryPageComponent implements OnChanges {
  	TubeItems: Observable<Tube[]>;
    categoryName: string;
    TubeItem: Tube;
    paramsSub: Subscription;
    tubesDataService: TubesDataService

  constructor(private route: ActivatedRoute, tubesDataService: TubesDataService) {
        this.tubesDataService = tubesDataService
  }
  	ngOnInit() {
          this.paramsSub = this.route.params
        .map(params => params['categoryName'])
        .subscribe(categoryName => {
          this.categoryName = categoryName;
          var lang = this.tubesDataService.getLanguage();
          const handle = Meteor.subscribe('tubeListCategoryPage',lang, this.categoryName);

          Tracker.autorun(() => {
          const isReady = handle.ready();
          this.TubeItems = this.tubesDataService.getDataSummery({"category":this.categoryName},60).zone();
        });

        });

	}
	ngOnChanges(){
        this.paramsSub.unsubscribe();
          this.paramsSub = this.route.params
        .map(params => params['categoryName'])
        .subscribe(categoryName => {
          this.categoryName = categoryName;
          var lang = this.tubesDataService.getLanguage();
          const handle = Meteor.subscribe('tubeListCategoryPage',lang, this.categoryName);

          Tracker.autorun(() => {
          const isReady = handle.ready();
          this.TubeItems = this.tubesDataService.getDataSummery({"category":this.categoryName},60).zone();
        });

        });
    }
    ngAfterViewChecked() {
        if(document.getElementsByClassName("content").length > 0){
            document.getElementById("tubelistcategorypage-loader").style.display = "none"
        }
        else{
            document.getElementById("tubelistcategorypage-loader").style.display = "block"
        }
    }
    ngOnDestroy() {
      console.log("destroy")
        this.paramsSub.unsubscribe()
    }
}
