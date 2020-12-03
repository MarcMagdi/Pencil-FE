import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  constructor(
    public realtimeDB: AngularFireDatabase,
    public authService: AuthService
  ) {}

  async getInitialValue() {
    const currentUser = this.authService.user;
    if (currentUser) {
      const initialValue = await this.realtimeDB.database
        .ref(currentUser.uid)
        .once('value');

      return initialValue.val()?.snapshot ?? '';
    }

    return '';
  }

  async pushTextChanges(snapshot) {
    const currentUser = this.authService.user;
    return this.realtimeDB.database.ref(currentUser.uid).set({ snapshot });
  }
}
