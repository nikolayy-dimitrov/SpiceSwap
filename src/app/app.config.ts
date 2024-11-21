import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { firebaseConfig } from "../environments/environment";
import { provideRouter } from "@angular/router";
import { appRouting } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";

export const appConfig = {
  providers: [
    provideRouter(appRouting),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ]
};
