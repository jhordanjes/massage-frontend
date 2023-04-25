import { Component } from '@angular/core';
import {
  faPowerOff,
  faClock,
  faTriangleExclamation,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import {
  format,
  parseISO,
  addDays,
  startOfWeek,
  isAfter,
  differenceInMinutes,
  isWeekend,
  nextMonday,
  isBefore,
  nextWednesday,
  getDay,
} from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { ScheduleService } from 'src/app/services/schedule.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  schedulesSelected: ISchedule[] = [];
  daysOfWeek: Array<{
    shorten: string;
    numeric: string;
    date: Date;
    isAvailable: boolean;
  }> = [];
  faPowerOff = faPowerOff;
  faClock = faClock;
  faCalendar = faCalendar;
  newDate = new Date();
  faTriangleExclamation = faTriangleExclamation;
  selectedDate = {
    dateFormatted:
      getDay(this.newDate) === 0 || getDay(this.newDate) > 3
        ? format(nextMonday(new Date()), "eeee',' dd MMMM")
        : format(new Date(), "eeee',' dd MMMM"),
    date:
      getDay(this.newDate) === 0 || getDay(this.newDate) > 3
        ? nextMonday(new Date())
        : new Date(),
  };
  currentUser: IUser;

  constructor(
    private scheduleService: ScheduleService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSchedule(this.selectedDate.date);
    this.generateDaysOfWeek();

    const user = this.authService.getUser();
    if (user) {
      this.currentUser = user;
    }
  }

  generateDaysOfWeek() {
    const firstDayOfWeek =
      getDay(this.newDate) === 0 || getDay(this.newDate) > 3
        ? nextMonday(this.newDate)
        : startOfWeek(this.newDate, { weekStartsOn: 1 });

    const shortWeekDays = Array.from(Array(2)).map((e, i) => {
      const date = i === 0 ? firstDayOfWeek : addDays(firstDayOfWeek, 2);
      return {
        numeric: format(date, 'dd'),
        shorten: format(date, 'iii'),
        date: date,
        isAvailable: true,
      };
    });

    // const shortWeekDays = Array.from(Array(5)).map((e, i) => {
    //   const date = i === 0 ? firstDayOfWeek : addDays(firstDayOfWeek, i);
    //   return {
    //     numeric: format(date, 'dd'),
    //     shorten: format(date, 'iii'),
    //     date: date,
    //     isAvailable: isMonday(date) || isWednesday(date) ? true : false,
    //   };
    // });

    this.daysOfWeek = shortWeekDays;
  }

  getStatus(date: string): string {
    const dateFormatted = parseISO(date);

    if (isBefore(new Date(), dateFormatted)) {
      return '';
    }

    if (
      isAfter(dateFormatted, new Date()) &&
      differenceInMinutes(dateFormatted, new Date()) <= 12
    ) {
      return 'Next appointment';
    }

    if (differenceInMinutes(dateFormatted, new Date()) > -12) {
      return 'In progress';
    }

    return '';
  }

  getSchedule(date: Date): void {
    this.selectedDate = {
      dateFormatted: format(date, "eeee',' dd MMMM"),
      date,
    };

    this.scheduleService
      .getSchedules(date.toISOString())
      .subscribe((schedules) => {
        const dataFormatted = schedules.map((item) => ({
          ...item,
          hour: format(parseISO(item.date), 'HH:mm'),
          status: this.getStatus(item.date),
        }));
        this.schedulesSelected = dataFormatted;
      });
  }

  async cancelAppointment(id: string) {
    try {
      await lastValueFrom(this.scheduleService.cancelAppointment(id));
      this.schedulesSelected = this.schedulesSelected.filter(
        (item) => item._id !== id
      );
      this.toastr.warning('Schedule canceled successfully');
    } catch (err: any) {
      this.toastr.error(
        err.error.message || 'Error when canceling appointment'
      );
    }
  }
}
