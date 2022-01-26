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
  vapidKeys:string = `BNYwYbsn9GrzAE6wEIYZFaNVuMYmcB3YzJm-hwQRlmejgAcPgeCbVK5xdBbgBQIh1lgaTx45RBOfxkChW8FZyfE`;

  constructor(
    private swUpdate: SwUpdate,
    // private service:NotificationService,
    private data : DataService,
    readonly swPush: SwPush) {
  }

  ngOnInit() {
    this.reloadCache();
    this.pushservice();
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
  private pushservice() {
    if(this.swPush.isEnabled) {
      this.swPush.messages.subscribe(msg => {
        console.log(msg);
      });

      this.swPush.requestSubscription({
        serverPublicKey:this.vapidKeys
      }).then(pushSubscription => {
        console.log(pushSubscription.toJSON());
      })
    }

  }
}
//TODO: web-push send-notification --endpoint="https://fcm.googleapis.com/fcm/send/crnx9IRt9eI:APA91bGaLnSs3O6DJCF4IRxg4UOoTVcicbowAb8T31vDWXrqDCFNdAtWZNV53ufnOSDnLjSx5yshJ-NNfrZoI340KRkikg2QEDRD3QuDmIWsJ3DaNSGjviYISA5gTLrd_UQDwAzFKFdL" --key="BOLXmcvTfW4x1455dinQdyiOdiv6f3FusaH2mbwuyBtTJgOYuCnG5PuHkY7JAOBTHSZuAwpX2CuiAcf6tY3i2aY" --auth="UCvcjcOMvCI4Qt2DPppPpQ" --payload="{ \"test\": \"Hello data\"}" --vapid-subject="http://127.0.0.1:8080/" --vapid-pubkey=BNYwYbsn9GrzAE6wEIYZFaNVuMYmcB3YzJm-hwQRlmejgAcPgeCbVK5xdBbgBQIh1lgaTx45RBOfxkChW8FZyfE --vapid-pvtkey=30pjW8hGcJsGs-bCR1DUe0mBE7tNDR-KIO2zvfgFjTQ
// https://youtu.be/eoaE0M_DRFI
