import { Component, OnInit } from '@angular/core';
import template from "./SearchResultPage.component.html";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { TubesCollection } from "../../../../both/collections/tubes.collection";
import 'rxjs/add/operator/map';
import { Tube } from "../../../../both/models/tube.model";
import { TubesDataService } from "../share/TubesService";


@Component({
  selector: "SearchResult",
  template,
  providers: [TubesDataService]

})
export class SearchResultPageComponent  implements OnInit {
    searchName: string;
    tube: Tube;
    TubeItems: Observable<Tube[]>;
    paramsSub: Subscription;
    tubesDataService: TubesDataService

    constructor(private route: ActivatedRoute, tubesDataService: TubesDataService) {
        this.tubesDataService = tubesDataService;
    }

    ngOnInit() {
          this.paramsSub = this.route.params
        .map(params => params['searchName'])
        .subscribe(searchName => {
          this.searchName = searchName;
          var lang = this.tubesDataService.getLanguage();
          const handle = Meteor.subscribe('searchResultPage',lang, this.searchName);

          Tracker.autorun(() => {
          const isReady = handle.ready();
          this.TubeItems = this.tubesDataService.getDataSummery({"tubeName": { '$regex' : '.*' + this.searchName + '.*'}},60 ).zone();
          });
        });

    }
    ngAfterViewChecked() {
        if(document.getElementsByClassName("content").length > 0){
            document.getElementById("searchresultpage-loader").style.display = "none"
        }
        else{
            document.getElementById("searchresultpage-loader").style.display = "block"
        }
    }
}
