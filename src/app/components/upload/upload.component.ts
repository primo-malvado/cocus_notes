import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})

export class FileUploadComponent {

  @Output() fileContentEvent = new EventEmitter<string>();

  fileName = '';

  constructor(
    private alertService: AlertService,
  ) {}

  async onFileSelected(event: any) {

      const file:File = event.target.files[0];

      if (file) {

        const file = event.target.files.item(0)
        const text = await file.text();
        try {

          const json = JSON.parse(text);

          this.fileContentEvent.emit(json);
        } catch (error) {
          this.alertService.error(error);
        }
      }
  }
}
