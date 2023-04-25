import { Component } from '@angular/core';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header-default',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  faPowerOff = faPowerOff;
  name: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // const currentUser = this.authService.getUser();
    // if (currentUser) {
    //   this.name = currentUser.username;
    // }

    this.authService.getUserTwo().subscribe((user) => {
      this.name = user?.name!;
    });
  }

  logout() {
    this.authService.logout();
  }
}
