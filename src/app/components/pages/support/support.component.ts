import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  email: string = 'contacto@robomatic.cloud';
  instagramUrl: string = 'https://www.instagram.com/robomatic.bot';
  whatsappUrl: string = 'https://wa.me/56929827325';
  facebookUrl: string = 'https://www.facebook.com/profile.php?id=61575280474592';
  linkedinUrl: string = 'https://www.linkedin.com/company/robomatic-rpa/';

  constructor(private location: Location) { }

  ngOnInit(): void { }

  goBack(): void {
    this.location.back();
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  copyEmail(): void {
    navigator.clipboard.writeText(this.email);
  }
}

