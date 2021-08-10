import { Component, OnInit } from '@angular/core';
import { Note } from '../../dto/note';
import { noteSearchParam } from '../../dto/noteSearchParam';

import { NoteService } from '../../services/note.service';
import { saveAs } from 'file-saver';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];
  searchString: string = '';

  constructor(
    private router: Router,
    private noteService: NoteService,
    private alertService: AlertService,
    ) {}

  ngOnInit() {
    this.getNotes();

    this.noteService.listUpdatedSubscription.subscribe(() => {
      this.getNotes();
    });
  }

  getNotes(): void {
    let params: noteSearchParam = {};
    if (this.searchString) {
      params.query = this.searchString;
    }

    this.noteService
      .getNotes(params)
      .subscribe((notes: Note[]) => (this.notes = notes));
  }

  search(ev: Event): void {
    const element = ev.currentTarget as HTMLInputElement;
    this.searchString = element.value;
    this.getNotes();
  }

  uploadFile(notes: any): void {
    if (Array.isArray(notes)) {
      let list: Note[] = [];
      notes.forEach((note: any) => {
        if (
          typeof note === 'object' &&
          note !== null &&
          'title' in note &&
          'body' in note
        ) {
          list.push(note);
        }
      });
      this.noteService.create(list)
       .subscribe({
          next: () => {
              this.alertService.success('Notes added');
              this.router.navigate(['/notes']);
            },
            error: (error: string) => {
                this.alertService.error(error);
              },
            });
    }
  }
  download(): void {
    this.noteService.getNotes({}).subscribe((notes: Note[]) => {
      var file = new File([JSON.stringify(notes)], 'myNotes.json', {
        type: 'application/json',
      });
      saveAs(file);
    });
  }
}
