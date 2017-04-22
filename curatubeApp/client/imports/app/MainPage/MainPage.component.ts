import template from "./MainPage.component.html";
import style from "./MainPage.component.scss";
import { Observable} from "rxjs";
import { Tube } from "../../../../both/models/tube.model";
import { TubesDataService } from "../share/TubesService";
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import 'rxjs/add/operator/map';

@Component({
  selector: "MainPage",
  template,
  styles: [ style ],
  providers: [TubesDataService]
})
export class MainPageComponent {
    TubeItems: Observable<Tube[]>;
    tubesDataService: TubesDataService
    subscription: Subscription;
    activatedRoute: ActivatedRoute;

    constructor(tubesDataService: TubesDataService,  activatedRoute: ActivatedRoute) {
        this.tubesDataService = tubesDataService;
        this.activatedRoute = activatedRoute;
    }

    ngOnInit() {
        var lang = this.tubesDataService.getLanguage();
        const handle = Meteor.subscribe('mainPage',lang);

        Tracker.autorun(() => {
        const isReady = handle.ready();
        this.TubeItems = this.tubesDataService.getData({"category":"main"}).zone();
      });

    }
    ngAfterViewChecked() {
        if(document.getElementsByClassName("content").length > 0){
            document.getElementById("mainpage-loader").style.display = "none"
        }
        else{
            document.getElementById("mainpage-loader").style.display = "block"
        }
    }
}
