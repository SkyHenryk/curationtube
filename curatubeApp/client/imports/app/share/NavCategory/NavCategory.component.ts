import { Component,  } from '@angular/core';
import template from './NavCategory.component.html';
import { Router} from '@angular/router';
import { Meteor } from 'meteor/meteor';

@Component({
	selector: 'NavCategory',
	template
})

export class NavCategoryComponent {
	searchName: string;
	categoryName: string;
	hasFavorite:boolean;
	constructor(private router: Router){
		this.router = router
	}

	ngOnInit(){
		this.hideNavBarInSmallDisplay()
	}

	hideNavBarInSmallDisplay(){
		if(document.getElementById("start").offsetWidth < 640)
			{
				document.getElementById("offCanvas").style.display = "none";
			}
	}
	ngDoCheck() {

		this.hasFavorite = false
		if(Meteor.userId()) {
			if (Meteor.user()!=null){
					var profile = Meteor.user().profile
				if(profile.favorite){
					if(profile.favorite.length > 0){
						this.hasFavorite = true
					}
				}
			}
		}
	}

	GoSearchPage(value: string) {
	this.hideNavBarInSmallDisplay()
	  this.searchName = '/search/'+value;
	  this.router.navigate([this.searchName]);
	}
	GoTubeListPage(){
		this.hideNavBarInSmallDisplay()
	this.router.navigate(['/tubelist/']);
	}
	GoNoCatergory(){
		this.hideNavBarInSmallDisplay()
		this.router.navigate(['/']);
	}
	GoCatergory(value: string){
		this.hideNavBarInSmallDisplay()
	  this.categoryName = '/category/'+value;
	  this.router.navigate([this.categoryName]);

	}
	goPage(value){
		this.hideNavBarInSmallDisplay()
		this.router.navigate([value]);
	}
}