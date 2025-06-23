import { CommonModule } from '@angular/common';
import { Component, inject, input, linkedSignal, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../lib/types/sspf-cms-type';
import { MatIconModule } from '@angular/material/icon';
import { StrapiStore } from '../../store/strapi.store';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user-attribute',
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './update-user-attribute.component.html',
  styleUrl: './update-user-attribute.component.scss',
})
export class UpdateUserAttributeComponent {
  attrName = input.required<string>();
  attrDesc = input.required<string>();
  user = model.required<User>();
  disableEdit = input<boolean>(false);
  strapi = inject(StrapiStore);
  sb = inject(MatSnackBar);

  attrValue = linkedSignal(() => {
    if (this.user() === undefined) return undefined;
    return this.user()[this.attrName() as keyof User] ?? undefined;
  });

  editValue = linkedSignal(() => {
    return this.attrValue();
  });

  editFormOpen = false;

  openForm() {
    this.editFormOpen = true;
  }

  closeForm() {
    this.editFormOpen = false;
    this.editValue.set(this.attrValue());
  }

  async saveForm() {
    if (this.user().documentId) {
      const userResp = await this.strapi
        .client()
        .fetch('/users/' + this.user().id, {
          method: 'PUT',
          body: JSON.stringify({
            [this.attrName()]: this.editValue(),
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((resp) => {
          this.sb.open('บันทึกข้อมูลเรียบร้อย', 'OK', { duration: 8000 });
          this.attrValue.set(this.editValue());

          this.closeForm();
          return resp as User;
        })
        .catch((err) => {
          this.sb.open(err, 'OK', { duration: 8000 });
        });
    }
  }
}
