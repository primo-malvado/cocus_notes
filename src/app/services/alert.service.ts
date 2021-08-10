import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AlertService {
  error(error: any) {
    console.error(error);
  }
  success(message: string) {
    console.log(message);
  }
}
