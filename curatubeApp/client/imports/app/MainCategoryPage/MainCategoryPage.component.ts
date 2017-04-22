import { Component, OnChanges } from "@angular/core";
import template from "./MainCategoryPage.component.html";
import style from "./MainCategoryPage.component.scss";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from "rxjs";
import { Tube } from "../../../../both/models/tube.model";
import { TubesDataService } from "../share/TubesService";

@Component({
  selector: "MainCategoryPage",
  template,
  styles: [ style ],
  providers: [TubesDataService]

})
export class MainCategoryPageComponent implements OnChanges {
  	TubeItems: Observable<Tube[]>;
    categoryName: string;
    TubeItem: Tube;
    paramsSub: Subscription;
    tubesDataService: TubesDataService
    constructor(tubesDataService: TubesDataService, private route: ActivatedRoute) {
        this.tubesDataService = tubesDataService;
    }
  	ngOnInit() {
          this.paramsSub = this.route.params
        .map(params => params['categoryName'])
        .subscribe(categoryName => {
          this.categoryName = categoryName;
          var lang = this.tubesDataService.getLanguage();
          const handle = Meteor.subscribe('mainCategoryPage',lang, this.categoryName);

          Tracker.autorun(() => {
          const isReady = handle.ready();
          this.TubeItems = this.tubesDataService.getData({"category": this.categoryName}).zone();
          });
        });

	}
	ngOnChanges(){
        console.log("OnChanges")
        this.paramsSub.unsubscribe();
          this.paramsSub = this.route.params
        .map(params => params['categoryName'])
        .subscribe(categoryName => {
          this.categoryName = categoryName;
          var lang = this.tubesDataService.getLanguage();
          const handle = Meteor.subscribe('mainCategoryPage',lang);

          Tracker.autorun(() => {
          const isReady = handle.ready();
          this.TubeItems = this.tubesDataService.getData({"category": this.categoryName}).zone();
          });
          });
    }
    ngAfterViewChecked() {
        if(document.getElementsByClassName("content").length > 0){
            document.getElementById("maincategorypage-loader").style.display = "none"
        }
        else{
            document.getElementById("maincategorypage-loader").style.display = "block"
        }
    }
    ngOnDestroy() {
      console.log("destroy")
        this.paramsSub.unsubscribe()
    }
}
