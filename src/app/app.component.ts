import {ApplicationRef, Component, OnInit} from '@angular/core';
import {SwPush, SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {DataService} from "./data.service";
import {filter, interval, map} from "rxjs";

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
    private appRef: ApplicationRef,
    readonly swPush: SwPush) {
  }

  ngOnInit() {
    this.reloadCache();
    this.pushservice();
    this.data.getJokes().subscribe(res=> {
      this.joke = res;
    })
    window.addEventListener('online', this.isOnline, false)
    window.addEventListener('offline', this.isOnline, false)
  }

  isOnline(): void {
    if (navigator.onLine) {
      console.log('online');
    } else {
      console.log('offline');
    }
    this.checkUpdate();
  }

  reloadCache(){
    if(this.swUpdate.isEnabled){
      // this.swUpdate.available.subscribe(() =>{
      //   if(confirm('New version available! would you like to update?')){
      //     this.swUpdate.activateUpdate().then(()=> document.location.reload());
      //   }
      // })

      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
            if(confirm('New version available! would you like to update?')){
              this.swUpdate.activateUpdate().then(()=> document.location.reload());
            }
        }),
      );

      this.swUpdate.activated.subscribe((event) => {
        console.log(`current`, event.previous, `available `, event.current);
      });

    }
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);

        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => console.log('checked'));
          console.log('update checked');
        });
      }
    });
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

  // private loadModalPwa(): void {
  //   if (this.platform.ANDROID) {
  //     window.addEventListener('beforeinstallprompt', (event: any) => {
  //       event.preventDefault();
  //
  //     });
  //   }
  //
  //   if (this.platform.IOS && this.platform.SAFARI) {
  //     const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
  //     if (!isInStandaloneMode) {
  //
  //     }
  //   }
  // }

}
//TODO: web-push send-notification --endpoint="https://fcm.googleapis.com/fcm/send/crnx9IRt9eI:APA91bGaLnSs3O6DJCF4IRxg4UOoTVcicbowAb8T31vDWXrqDCFNdAtWZNV53ufnOSDnLjSx5yshJ-NNfrZoI340KRkikg2QEDRD3QuDmIWsJ3DaNSGjviYISA5gTLrd_UQDwAzFKFdL" --key="BOLXmcvTfW4x1455dinQdyiOdiv6f3FusaH2mbwuyBtTJgOYuCnG5PuHkY7JAOBTHSZuAwpX2CuiAcf6tY3i2aY" --auth="UCvcjcOMvCI4Qt2DPppPpQ" --payload="{ \"test\": \"Hello data\"}" --vapid-subject="http://127.0.0.1:8080/" --vapid-pubkey=BNYwYbsn9GrzAE6wEIYZFaNVuMYmcB3YzJm-hwQRlmejgAcPgeCbVK5xdBbgBQIh1lgaTx45RBOfxkChW8FZyfE --vapid-pvtkey=30pjW8hGcJsGs-bCR1DUe0mBE7tNDR-KIO2zvfgFjTQ
// https://youtu.be/eoaE0M_DRFI
