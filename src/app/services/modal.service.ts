import {Injectable} from '@angular/core';
import {IModal} from "../interfaces/modal.interface";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {
  }

  unregister(id: string) {
    this.modals = this.modals.filter(el => el.id !== id);
  }

  register(id: string) {
    this.modals.push({
      id,
      visible: false
    })
  }

  isModalOpen(id: string): boolean {
    return !!this.modals.find(el => el.id === id)?.visible;
  }

  toggleModal(id: string): void {
    const modal = this.modals.find(el => el.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }


}
