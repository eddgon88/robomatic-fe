import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {

  lastUpdated: string = '14 de Diciembre de 2025';

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}

