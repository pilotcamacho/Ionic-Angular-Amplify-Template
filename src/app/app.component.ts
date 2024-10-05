import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/angular/standalone';

import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';

import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';

Amplify.configure(outputs)

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonButton, IonApp, IonRouterOutlet, AmplifyAuthenticatorModule],
})
export class AppComponent {
  constructor(public authenticator: AuthenticatorService) {
    Amplify.configure(outputs);
  }
}
