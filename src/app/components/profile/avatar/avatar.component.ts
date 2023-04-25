import { Component, Input } from '@angular/core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent {
  confirmation: boolean = false;
  @Input() changePageValue: (value: 'FORM' | 'AVATAR') => void;
  avatars = [
    {
      id: 'skdghvsd',
      image: 'https://api.multiavatar.com/' + 'thais.maquine' + '.svg',
    },
    {
      id: 'sdvzzsvws',
      image: 'https://api.multiavatar.com/' + 'thais.ja' + '.svg',
    },
    {
      id: 'skdghvsdvssd',
      image: 'https://api.multiavatar.com/' + 'flavia.ja' + '.svg',
    },
    {
      id: 'sdfsdffsdfsd',
      image: 'https://api.multiavatar.com/' + 'lucas.ja' + '.svg',
    },
    {
      id: 'sdfsdsdaf',
      image: 'https://api.multiavatar.com/' + 'tonico.ja' + '.svg',
    },
  ];
  selectedAvatar: string;
  faChevronLeft = faChevronLeft;

  selectAvatar(id: string) {
    this.selectedAvatar = id;
  }
}
