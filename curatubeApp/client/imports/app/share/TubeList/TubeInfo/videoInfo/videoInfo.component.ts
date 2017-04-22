import {Component, OnInit, Input} from "@angular/core";
import template from "./videoInfo.component.html";
import { Meteor } from 'meteor/meteor';

@Component({
    selector: "videoInfo",
    inputs:['currentCategory','video','maxShowVideoItems', 'ShowType'],
    template
})
export class VideoInfoComponent implements OnInit{
    currentCategory: string;
    video: any;
    maxShowVideoItems: number;
    ShowType: string;
    format: any;

    goPlay(url) {
        if(Meteor.userId()) {
            if (Meteor.user()) {
                if (Meteor.user().profile.logging) {
                }
                else {
                    Meteor.users.update(Meteor.userId(), {$set: {"profile.logging": []}});
                }
                    var logging = "[" + new Date().toISOString() + "]" + this.video.id
                    Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.logging": logging}});
            }
        }
        window.open(url);
    }

}
