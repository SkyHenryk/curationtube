import { Component, OnInit, OnChanges } from "@angular/core";
import { Observable } from "rxjs";
import { Tube } from "../../../../../../both/models/tube.model";
import { ItemArray } from "../../../../../../both/models/tube.model";
import template from "./TubeInfo.component.html";
import style from "./TubeInfo.component.scss";
import { Router} from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { CommonModule } from '@angular/common';
@Component({
  selector: "TubeInfo",
  template,
  styles: [ style ],
  inputs:['TubeItem','ShowVideoItems','ShowType']
})
export class TubeInfoComponent implements OnInit, OnChanges  {
  greeting: string;
  currentCategory : string;
  TubeItem : Tube;
  videoList : any;
  todayVideoItems : any;
  thisweekVideoItems : any;
  ratingOrderItems : any;
  viewCountOrderItems : any;
  ShowVideoItems : number;
  maxShowVideoItems: number;
  todayVideoItemsSize : number;
  thisweekVideoItemsSize : number;
  // ratingOrderItemsSize : number;
  viewCountOrderItemsSize : number;
  ShowType : string;
  channelList : ItemArray;
  routerDestination: string;
  isUser:boolean;
  isFavorate:boolean;
  selectedChannel:any;

  constructor(private router: Router) {
    this.greeting = "Hello Tube Component!";
    this.currentCategory = "thisweek"
  }

  ngOnInit() {
      if(this.ShowType=='Detail'){
        if(Meteor.userId()){
        this.isUser=true
        var profile = Meteor.user().profile

        if(profile.favorite.filter(x => x == this.TubeItem.tubeName)[0]){
          this.isFavorate = true;
        }
        else{
          this.isFavorate = false;
        }
      }
      else{
        this.isUser=false
      }
    }
    this.videoList = this.TubeItem.videoItems.thisweekVideoItems


    this.showdefault()
    this.channelList = this.TubeItem.channelList
    this.selectedChannel = this.TubeItem.channelList.map(function(x) {return x.id;})

    this.todayVideoItems = this.TubeItem.videoItems.todayVideoItems
    this.thisweekVideoItems = this.TubeItem.videoItems.thisweekVideoItems
    // this.ratingOrderItems = this.TubeItem.videoItems.ratingOrderItems
    this.viewCountOrderItems = this.TubeItem.videoItems.viewCountOrderItems

    this.todayVideoItemsSize = this.todayVideoItems.length
    this.thisweekVideoItemsSize = this.thisweekVideoItems.length
    // this.ratingOrderItemsSize = this.ratingOrderItems.length
    this.viewCountOrderItemsSize = this.viewCountOrderItems.length
  }
  ngAfterViewInit(){
    if(document.getElementById(this.TubeItem._id) != null){
      if(this.currentCategory.indexOf("channellist") > -1 ){
        document.getElementById(this.TubeItem._id).style.display = "block"
      }
      else{
        document.getElementById(this.TubeItem._id).style.display = "none"
      }
    }
  }
  addFavorite(){
    Meteor.users.update(Meteor.userId(), {$addToSet: {"profile.favorite": this.TubeItem.tubeName}});
    this.isFavorate = true;
  }
  removeFavorite(){
    Meteor.users.update(Meteor.userId(), {$pull: {"profile.favorite": this.TubeItem.tubeName}});
    this.isFavorate = false;
  }
  showdefault(){
    this.maxShowVideoItems = this.ShowVideoItems
  }
  showmore(){
    this.maxShowVideoItems += 12
  }
  ngOnChanges() {
    this.showdefault()
  }
  // goPlayAll(TubeItem) {
  //   if(this.currentCategory==="today"){
  //     window.open(TubeItem.videoUrl.todayVideoUrl);
  //   }
  //   if(this.currentCategory==="thisweek"){
  //     window.open(TubeItem.videoUrl.thisweekVideoUrl);
  //   }
  //   // if(this.currentCategory==="toprating"){
  //     // window.open(TubeItem.videoUrl.ratingOrderUrl);
  //   // }
  //   if(this.currentCategory==="mostwatched"){
  //     window.open(TubeItem.videoUrl.viewCountOrderUrl);
  //   }
  //   if(this.currentCategory==="channellist"){
  //     window.open(TubeItem.videoUrl.todayVideoUrl);
  //   }
  // }
  changeCategory(value){
    this.currentCategory = value;
    if(this.currentCategory.indexOf("today") > -1 ){
      this.videoList = this.todayVideoItems
    }
    if(this.currentCategory.indexOf("thisweek") > -1 ){
      this.videoList = this.thisweekVideoItems
    }
    // if(this.currentCategory==="toprating"){
      // this.videoList = this.ratingOrderItems
    // }
    if(this.currentCategory.indexOf("mostwatched") > -1 ){
       this.videoList = this.viewCountOrderItems
    }
    if(this.currentCategory.indexOf("channellist") > -1 ){
      if(document.getElementById(this.TubeItem._id) != null){
        document.getElementById(this.TubeItem._id).style.display = "block"
      }
      if(document.getElementById("showmore-ObjectID(\"" + this.TubeItem._id + "\")") != null){
        document.getElementById("showmore-ObjectID(\"" + this.TubeItem._id + "\")").style.display = "none"
      }
    }
    else{
      if(document.getElementById(this.TubeItem._id) != null){
        document.getElementById(this.TubeItem._id).style.display = "none"
      }
      if(document.getElementById("showmore-ObjectID(\"" + this.TubeItem._id + "\")") != null){
        document.getElementById("showmore-ObjectID(\"" + this.TubeItem._id + "\")").style.display = "block"
      }
    }
    if(this.videoList != null){
    this.videoList = this.videoList.filter(video => this.selectedChannel.indexOf(video.snippet.channelId) > -1)
    }
    else{
      this.videoList = []
    }
    this.maxShowVideoItems = this.ShowVideoItems
  }
	goTubePage(value){
		this.routerDestination = '/tube/' +value
		this.router.navigate([this.routerDestination]);
	}
	selectChannelAll(){
	  this.selectedChannel = this.TubeItem.channelList.map(function(x) {return x.id;})
      var channelSelect = document.getElementsByClassName("channel-select");
      for(var i = 0; i < channelSelect.length; i++) {
          channelSelect[i].innerHTML = "selected"
          channelSelect[i].style.backgroundColor="#e96969"
      }
      this.videoItemsRefresh()
    }
    unSelectChannelAll(){
      this.selectedChannel = []
      var channelSelect = document.getElementsByClassName("channel-select");
      for(var i = 0; i < channelSelect.length; i++) {
          channelSelect[i].innerHTML = ""
          channelSelect[i].style.backgroundColor="#f0f0f0"
      }
      this.videoItemsRefresh()
    }
    selectChannel($event,channel){

      var index = this.selectedChannel.indexOf(channel.id);
      var channelSelect = event.currentTarget.querySelector('.channel-select')
      if(index < 0){
        this.selectedChannel.push(channel.id)
        channelSelect.innerHTML = "selected"
        channelSelect.style.backgroundColor="#e96969"
      }
      else{
        this.selectedChannel.splice(index, 1);
        channelSelect.innerHTML = ""
        channelSelect.style.backgroundColor="#f0f0f0"
      }
      this.videoItemsRefresh()
    }

    videoItemsRefresh(){
      if(this.TubeItem.videoItems.todayVideoItems != null){
        this.todayVideoItems = this.TubeItem.videoItems.todayVideoItems.filter(video => this.selectedChannel.indexOf(video.snippet.channelId) > -1)
      }
      else{
        this.todayVideoItems = []
      }
      if(this.TubeItem.videoItems.todayVideoItems != null){
        this.thisweekVideoItems = this.TubeItem.videoItems.thisweekVideoItems.filter(video => this.selectedChannel.indexOf(video.snippet.channelId) > -1)
      }
      else{
        this.thisweekVideoItems = []
      }
      // this.ratingOrderItems = this.TubeItem.videoItems.ratingOrderItems.filter(video => this.selectedChannel.indexOf(video.snippet.channelId) > -1)
      if(this.TubeItem.videoItems.todayVideoItems != null){
      this.viewCountOrderItems = this.TubeItem.videoItems.viewCountOrderItems.filter(video => this.selectedChannel.indexOf(video.snippet.channelId) > -1)
      }
      else{
        this.viewCountOrderItems = []
      }
      this.todayVideoItemsSize = this.todayVideoItems.length
      this.thisweekVideoItemsSize = this.thisweekVideoItems.length
      this.viewCountOrderItemsSize = this.viewCountOrderItems.length
      // this.ratingOrderItemsSize = this.ratingOrderItems.length
      
    }

    ngAfterViewChecked() {
      var viewId = "showmore-ObjectID(\"" + this.TubeItem._id + "\")"
      if(document.getElementById(viewId) != null){
        if(this.videoList.length <= this.maxShowVideoItems){
          document.getElementById(viewId).style.display = "none"
        }
        else{
          document.getElementById(viewId).style.display = "block"
        }
      }
    }
}
