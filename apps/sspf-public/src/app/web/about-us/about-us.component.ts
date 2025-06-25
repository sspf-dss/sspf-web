import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { TimelineItemComponent } from '../../components/timeline-item/timeline-item.component';

@Component({
  selector: 'app-about-us',
  imports: [BreadcrumbComponent, TimelineItemComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {}
