import { Component, input } from '@angular/core';

@Component({
  selector: 'app-timeline-item',
  imports: [],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss',
})
export class TimelineItemComponent {
  date = input.required<string>();
  title = input.required<string>();
}
