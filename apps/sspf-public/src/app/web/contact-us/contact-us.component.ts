import { Component } from '@angular/core';
import { ContactBlockComponent } from '../../components/contact-block/contact-block.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-contact-us',
  imports: [ContactBlockComponent, BreadcrumbComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {}
