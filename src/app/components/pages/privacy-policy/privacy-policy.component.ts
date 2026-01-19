import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  lastUpdated: string = '14 de Diciembre de 2025';

  constructor(private location: Location) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}

