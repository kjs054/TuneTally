import { Pipe, PipeTransform } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rating } from '../model/rating.model';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'userToObject'
})
export class UserToObjectPipe implements PipeTransform {

  constructor(private authService: AuthService) { }

  transform(objects: any) {
    const joinKeys = {};
    const uids = Array.from(new Set([].concat(objects.comments, objects.ratings).map(v => v.uid)));
    const userDocs = uids.map(u => this.authService.getUserDataById(u));
    return combineLatest(userDocs).pipe(map(docs => {
      docs.forEach(doc => (joinKeys[(doc as Rating).uid] = doc));
      Object.keys(objects).forEach(key => {
        objects[key] = objects[key].map(v => ({ ...v, user: joinKeys[v.uid] }));
      });
      return objects;
    }));
  }
}
