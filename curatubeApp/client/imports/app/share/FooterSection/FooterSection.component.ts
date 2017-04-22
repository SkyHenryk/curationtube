import { Component, OnInit } from '@angular/core';
import template from './FooterSection.component.html';
import { Router} from '@angular/router';

@Component({
	selector: 'FooterSection',
	template
})

export class FooterSectionComponent implements OnInit {
	navName: string;

	constructor(private router: Router){
		this.router = router
	}

	GoCatergory(value: string){
	  this.navName = '/'+value;
	  this.router.navigate([this.navName]);

	}
}