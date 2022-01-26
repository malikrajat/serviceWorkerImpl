import {Component, OnInit} from '@angular/core';
import {SwPush, SwUpdate} from "@angular/service-worker";
import {DataService} from "./data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'jokes';
  update!: boolean;
  joke!: any;
  constructor(private swUpdate: SwUpdate, private data : DataService, readonly swPush: SwPush) {
  }

  ngOnInit() {
    this.reloadCache();
    this.data.getJokes().subscribe(res=> {
      this.joke = res;
    })
  }

  reloadCache(){
    if(this.swUpdate.isEnabled){
      this.swUpdate.available.subscribe(() =>{
        if(confirm('New version available! would you like to update?')){
          this.swUpdate.activateUpdate().then(()=> document.location.reload());
        }
      })
    }
  }
}
