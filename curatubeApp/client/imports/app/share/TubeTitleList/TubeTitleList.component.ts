import { Component, OnInit } from '@angular/core';
import template from './TubeTitleList.component.html';
import { Router} from '@angular/router';

@Component({
	selector: 'TubeTitleList',
	template,
	inputs:['TubeItems']
})

export class TubeTitleListComponent implements OnInit {
	routerDestination: string;
	constructor(private router: Router) {
		this.router = router
	  }
  	ngOnInit() {
	}
	goTubePage(value){
		this.routerDestination = '/tube/' +value
		this.router.navigate([this.routerDestination]);
	}
}