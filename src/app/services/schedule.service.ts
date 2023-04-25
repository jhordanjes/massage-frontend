import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISchedule } from '../interfaces/ISchedule';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IHourAvailable } from '../interfaces/IHourAvailable';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getSchedules(date: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${environment.apiUrl}/appointments`, {
      params: new HttpParams().set('date', date),
    });
  }

  getHoursOfDayAvailability() {
    return this.http.get<{
      dateForScheduling: string;
      availableTimes: IHourAvailable[];
    }>(`${environment.apiUrl}/appointments/hours-availability`);
  }

  createAppointment(date: Date): Observable<any> {
    const user = this.authService.getUser();

    return this.http.post(`${environment.apiUrl}/appointments`, {
      date,
      user: user?._id,
    });
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/appointments/${id}`);
  }
}

type Schedule = Omit<ISchedule, 'hour'>;
