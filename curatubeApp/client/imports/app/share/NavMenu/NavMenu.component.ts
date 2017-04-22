import { Component, OnInit } from '@angular/core';
import template from './NavMenu.component.html';
import { Router} from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import { Observable } from "rxjs";
import { TubesDataService } from "../TubesService";
declare var gapi:any;
declare var result:any;
declare var googleUser:any;
declare var auth2:any;
declare var SigninOptionsBuilder:any;

@Component({
	selector: 'NavMenu',
	template,
  providers: [TubesDataService],
})

export class NavMenuComponent {
	searchName: string;
	categoryName: string;
	currentLanguage: string;
	tubesDataService : TubesDataService;
	Language?: string;
	userpic: string;

	constructor(private router: Router, tubesDataService: TubesDataService){
		this.router = router
		this.tubesDataService = tubesDataService
		this.userpic = "http://a.com"
	}
  	ngOnInit() {
        document.getElementById('logout').style.display = "none";
		const handle = Meteor.subscribe('getUserData');
		Tracker.autorun(() => {
			const isReady = handle.ready();
			var user = Meteor.users.find({_id: Meteor.userId()})
			user.forEach(function (userOne) {
				var userOneServices = userOne.services
				if(userOneServices != null){
					this.userpic = userOneServices.google.picture
					document.getElementById('userpic').setAttribute("src",this.userpic)
				}
			});
		});
	}

	showLogout(){
		if(document.getElementById('logout').style.display.indexOf("none") > -1){
			document.getElementById('logout').style.display = "block"
		}
		else{
			document.getElementById('logout').style.display = "none"
		}
	}

	ngDoCheck(){
		this.Language = this.tubesDataService.getLanguage()
		if (!Meteor.user()) {
		  document.getElementById('gsignincover').style.display = "block";
    	  document.getElementById('gsignoutcover').style.display = "none";
	    }
	    else{
		document.getElementById('gsignincover').style.display = "none";
		document.getElementById('gsignoutcover').style.display = "block";
		}
	}

	login(){

		Meteor.loginWithGoogle({
			loginStyle: 'redirect',
			requestPermissions: [
				'https://www.googleapis.com/auth/youtube.readonly',
				'https://www.googleapis.com/auth/userinfo.email',
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/plus.login'
			]
		}, function() {
			if(Meteor.userId())
			{
				if(Meteor.user()){
					var profile = Meteor.user().profile
					if(profile.favorite){
						  }
					else {
						Meteor.users.update(Meteor.userId(), {$set: {"profile.favorite": []}});
					}
				}
			}
			this.router.navigate(['/']);
		});


	}

	signOut() {
		Meteor.logout(function(err) {
  		// callback
  		document.getElementById('gsignincover').style.display = "block";
		document.getElementById('gsignoutcover').style.display = "none";
		})
		this.router.navigate(['/redirect/']);
	    }
	GoSearchPage(value: string) {

        this.searchName = '/search/'+value;
        this.router.navigate([this.searchName]);
	}
	GoTubeListPage(){
	    this.router.navigate(['/tubelist/']);
	}
	GoNoCatergory(){
		this.router.navigate(['/redirect/']);
	}
	GoCatergory(value: string){
        this.categoryName = '/category/'+value;
        this.router.navigate([this.categoryName]);
	}
	ChangeLanguage(value: string){
		this.tubesDataService.setLanguage(value);
		this.router.navigate(['/redirect/']);
	}
	subnav(){
		if(document.getElementById("offCanvas").style.display.indexOf("block") > -1 ){
			document.getElementById("offCanvas").style.display = "none";
			document.getElementById("main-content").className = "medium-12 large-12 columns"
		}
		else{
			document.getElementById("offCanvas").style.display = "block";
			document.getElementById("main-content").className = "medium-9 large-9 columns"
		}
	}
}