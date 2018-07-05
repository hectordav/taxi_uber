import { Component } from '@angular/core';
import { NavController,IonicPage } from 'ionic-angular';
import { NotificationService } from '../../services/notification-service';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  public notifications:any;

  constructor(public nav: NavController, public notificationService: NotificationService) {
    this.notifications = notificationService.getAll();
  }
}
