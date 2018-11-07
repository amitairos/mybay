import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

export class Bug {
  Index: number;
  Apply: boolean;
  Random: number;
}

@Injectable({
  providedIn: 'root'
})
export class BugsService {
public bugs: Bug[];
  constructor(private db: AngularFirestore) {
    this.db.collection('Bugs').valueChanges().subscribe(data => {
      this.bugs = data as Bug[];
    })
   }
}
