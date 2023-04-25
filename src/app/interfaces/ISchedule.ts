export interface ISchedule {
  _id: string;
  date: string;
  hour: string;
  status?: string;
  user: {
    _id: string;
    username: string;
    name: string;
    image?: string;
  };
}
