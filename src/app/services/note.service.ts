import { Injectable } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';
import { Note } from '../dto/note';
import { noteSearchParam } from '../dto/noteSearchParam';

import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class NoteService {
  listUpdatedSubscription = new Subject();

  constructor(private storageService: LocalStorageService) {}

  getSingleNote(id: number): Note {
    let list = this.getList();
    return list.find((h: Note) => h.id === id)!;
  }

  getList(params: noteSearchParam = {}) {
    let list = this.storageService.get('notes');
    if (list === null) {
      list = [];
    }

    if (params.query) {
      list = list.filter((item: Note) => {
        const regex = new RegExp(params.query!, 'i');
        return regex.test(item.title) || regex.test(item.body);
      });
    }

    return list;
  }



  create(notes: Note[]) {

    let list = this.getList();
    let id = 1;
    const lastId = Math.max.apply(
      null,
      list.map((i: Note) => i.id)
    );
    if (lastId !== Number.NEGATIVE_INFINITY) {
      id = lastId + 1;
    }
    notes.forEach(note => {

      list.push({
        id,
        title: note.title,
        body: note.body,
      });

    })
    this.storageService.set('notes', list);
    this.listUpdatedSubscription.next();

    return of(list);
  }
  update(id: number, value: Note) {
    let list = this.getList();

    list
      .filter((item: Note) => item.id == id)
      .forEach((item: Note) => {
        item.title = value.title;
        item.body = value.body;
      });

    this.storageService.set('notes', list);

    this.listUpdatedSubscription.next();

    return of(list);
  }

  delete(id: number) {
    let list = this.getList();

    list = list.filter((item: Note) => item.id != id);

    this.storageService.set('notes', list);

    this.listUpdatedSubscription.next();

    return of(list);
  }

  getNotes(params: noteSearchParam): Observable<Note[]> {
    let list = this.getList(params);

    const notes = of(list);

    return notes;
  }

  getNote(id: number): Observable<Note> {
    const note = this.getSingleNote(id);
    return of(note);
  }
}
