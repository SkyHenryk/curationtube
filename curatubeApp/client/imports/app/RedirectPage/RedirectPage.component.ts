import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: "RedirectPage",
  template:""
})
export class RedirectPageComponent {
	constructor(private router: Router){
		this.router = router
	}

    ngOnInit() {
       this.router.navigate(['/']);
    }
}
