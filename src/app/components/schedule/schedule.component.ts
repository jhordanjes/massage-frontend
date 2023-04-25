import { Component } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { IHourAvailable } from 'src/app/interfaces/IHourAvailable';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  schedulesAvailable: IHourAvailable[] = [];
  dateForSheduling: Date;
  dateFormatted = '';
  selectedHour = '';
  faChevronLeft = faChevronLeft;

  constructor(
    private scheduleService: ScheduleService,
    private router: Router,
    private toastr: ToastrService,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.getScheduleAvailable();
  }

  getScheduleAvailable(): void {
    this.scheduleService.getHoursOfDayAvailability().subscribe((data) => {
      const dataFormatted = data.availableTimes.filter(
        (item) => item.available
      );
      this.schedulesAvailable = dataFormatted;
      this.dateForSheduling = parseISO(data.dateForScheduling);

      this.dateFormatted = format(
        parseISO(data.dateForScheduling),
        "eeee',' dd MMMM"
      );
    });
  }

  selectHour(hour: string) {
    this.selectedHour = hour;
  }

  async createAppointment() {
    const [hour, minutes] = this.selectedHour.split(':');

    this.dateForSheduling.setHours(+hour);
    this.dateForSheduling.setMinutes(+minutes);

    try {
      await lastValueFrom(
        this.scheduleService.createAppointment(this.dateForSheduling)
      );

      this.toastr.success('Schedule saved successfully');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.toastr.error(
        err.error.message || 'Error when canceling appointment'
      );
    }
  }
}
