import { Component, OnInit } from '@angular/core';
import RFB from "@novnc/novnc/core/rfb";

@Component({
  selector: 'app-novnc',
  templateUrl: './novnc.component.html',
  styleUrls: ['./novnc.component.css']
})
export class NovncComponent implements OnInit {

  rfb!: RFB;

  constructor() { }

  ngOnInit(): void {
  
    let element = document.getElementById('vnc')!;
		console.log(element);
		this.rfb = new RFB(element, 'ws://localhost:6080/websockify');
		let elementafter = document.getElementById('vnc');
		console.log(elementafter);

  }

}
