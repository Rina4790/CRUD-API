

export interface IUserPost {
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUser extends IUserPost {
  id: string;
}
