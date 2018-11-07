import { Component, OnInit } from '@angular/core';

const { version: appVersion } = require('../../../package.json')
@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent implements OnInit {

  public appVersion
  constructor() {
    this.appVersion = appVersion;
   }

  ngOnInit() {
  }

}
