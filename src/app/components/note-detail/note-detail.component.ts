import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { NoteService } from '../../services/note.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AlertService } from '../../services/alert.service';
import { Note } from '../../dto/note';
@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
})
export class NoteDetailComponent implements OnInit {
  note?: Note;

  id: string | null = null;
  isAddMode: boolean = false;
  loading = false;
  submitted = false;

  noteForm = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
  });

  constructor(
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private noteService: NoteService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.getNote();
    });
  }

  getNote(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isAddMode = !this.id;

    if (!this.isAddMode) {
      this.noteService
        .getNote(Number(this.id))
        .subscribe((note) => this.noteForm.patchValue(note));
    }
  }

  onSubmit() {
    if (this.noteForm.invalid) {
      return;
    }

    if (this.isAddMode) {
      this.createNote();
    } else {
      this.updateNote();
    }
  }

  private createNote() {
    this.noteService.create([this.noteForm.value]).subscribe({
      next: () => {
        this.alertService.success('Note added');
        this.router.navigate(['/notes']);
      },
      error: (error: string) => {
        this.alertService.error(error);
        this.loading = false;
      },
    });
  }

  deleteNote() {
    this.noteService.delete(Number(this.id),).subscribe({
      next: () => {
        this.alertService.success('Note deleted');
        this.router.navigate(['/notes']);
      },
      error: (error: string) => {
        this.alertService.error(error);
        this.loading = false;
      },
    });
  }

  private updateNote() {
    this.noteService.update(Number(this.id), this.noteForm.value).subscribe({
      next: () => {
        this.alertService.success('Note updated');
        this.router.navigate(['/notes']);
      },
      error: (error: string) => {
        this.alertService.error(error);
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.location.back();
  }
}
