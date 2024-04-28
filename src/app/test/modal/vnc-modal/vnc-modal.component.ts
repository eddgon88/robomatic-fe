import { Component, OnInit } from '@angular/core';
declare const noVNC: any;

@Component({
  selector: 'app-vnc-modal',
  templateUrl: './vnc-modal.component.html',
  styleUrls: ['./vnc-modal.component.css']
})
export class VncModalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const vnc = new noVNC();
    
    const vncViewer = vnc.createViewer(document.getElementById('yourVNCElement'));
    vncViewer.connect('tu_host_remoto', 'tu_puerto_vnc');
  }

}
