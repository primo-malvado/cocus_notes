import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteDetailComponent } from './components/note-detail/note-detail.component';
import { NoteListComponent } from './components/note-list/note-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  { path: 'notes', component: NoteListComponent ,

  children: [
    { path: 'new', component: NoteDetailComponent },
    { path: 'detail/:id', component: NoteDetailComponent }
  ],
}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

