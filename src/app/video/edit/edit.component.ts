import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import IClip from 'src/app/interfaces/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {
  @Input() activeClip: IClip | null = null;
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating clip.';
  @Output() update = new EventEmitter();

  clipId = new FormControl('', {
  });
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });
  editForm = new FormGroup({
    title: this.title,
    id: this.clipId
  })

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.modalService.register('editClip');
  }

  ngOnChanges() {
    if(!this.activeClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docId as string);
    this.title.setValue(this.activeClip.title);
  }

  ngOnDestroy() {
    this.modalService.unregister('editClip');
  }

  async submit() {
    if(!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(this.clipId.value as string, this.title.value);

    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later';
      return;
    }
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }

}
