import { Component, OnInit } from '@angular/core';
import template from './TubeList.component.html';

@Component({
	selector: 'TubeList',
	template,
	inputs:['TubeItems','ShowVideoItems','ShowType']
})

export class TubeListComponent {
	ShowVideoItems: number;
	ShowType: string;
}