import { Component, OnInit } from '@angular/core';
import template from "./TubePage.component.html";
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { TubesCollection } from "../../../../both/collections/tubes.collection";
import 'rxjs/add/operator/map';
import { Tube } from "../../../../both/models/tube.model";

@Component({
  selector: "TubePage",
  template
})
export class TubePageComponent  implements OnInit {
    tubeId: string;
    TubeItem: Tube;
    TubeItems: Observable<Tube[]>;
    paramsSub: Subscription

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
          this.paramsSub = this.route.params
        .map(params => params['tubeId'])
        .subscribe(tubeId => {
          this.tubeId = tubeId;
           var searchId = new Mongo.ObjectID(this.tubeId);
          const handle = Meteor.subscribe('tubePage', searchId);

          Tracker.autorun(() => {
          const isReady = handle.ready();
          this.TubeItems = TubesCollection.find(searchId).zone();
          });
        });
    }
    ngAfterViewChecked() {
        if(document.getElementsByClassName("content").length > 0){
            document.getElementById("tubepage-loader").style.display = "none"
        }
        else{
            document.getElementById("tubepage-loader").style.display = "block"
        }
    }
}
