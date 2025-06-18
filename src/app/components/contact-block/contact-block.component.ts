import { Component, input } from '@angular/core';

@Component({
  selector: 'app-contact-block',
  imports: [],
  templateUrl: './contact-block.component.html',
  styleUrl: './contact-block.component.scss',
})
export class ContactBlockComponent {
  title = input.required<string>();
  email = input.required<string>();
  phone = input.required<string>();
  contact = input.required<string>();
}
