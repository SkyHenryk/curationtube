import { Component } from "@angular/core";
import template from "./FavoritePage.component.html";
import { TubesCollection } from "../../../../both/collections/tubes.collection";
import { Observable } from "rxjs";
import { Tube } from "../../../../both/models/tube.model";
import style from "./FavoritePage.component.scss";
import { TubesDataService } from "../share/TubesService";
import { Meteor } from 'meteor/meteor';
import {Router} from "@angular/router";


@Component({
  selector: "FavoritePage",
  template,
  styles: [ style ],
  providers: [TubesDataService]
})

export class FavoritePageComponent {
  	TubeItems: Observable<Tube[]>;
    tubesDataService: TubesDataService

    constructor(tubesDataService: TubesDataService,private router: Router) {
        this.tubesDataService = tubesDataService
      this.router = router
    }

  	ngOnInit() {
        if(Meteor.userId()) {
            if (Meteor.user()) {
                var favorite = Meteor.user().profile.favorite
                var lang = this.tubesDataService.getLanguage();
                const handle = Meteor.subscribe('FavoritePage', lang);

                Tracker.autorun(() => {
                    const isReady = handle.ready();
                    this.TubeItems = this.tubesDataService.getData({tubeName: {$in: favorite}}, 60).zone();
                });
            }
        }
        else{
            this.router.navigate(['/']);
        }
	}

    ngAfterViewChecked() {
        if(document.getElementsByClassName("content").length > 0){
            document.getElementById("favoritepage-loader").style.display = "none"
        }
        else{
            document.getElementById("favoritepage-loader").style.display = "block"
        }
    }
}
