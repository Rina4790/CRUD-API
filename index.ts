import * as http from "http"
import { v4 as uuidv4 } from 'uuid';
import { createUser } from './postData'

export interface IUserPost {
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUser extends IUserPost {
  id: string | typeof uuidv4;
}
const users: IUser[] = [];


export const checkArray = (array: string[]) => {
	return Array.isArray(array) && array.every((value) => typeof value === 'string');
 };

 export const create = (user: IUserPost) => new Promise((res, rej) => {
	try {
	  const newUser: IUser = { id: uuidv4(), ...user };
	  users.push(newUser);
	  res(newUser);
	} catch (error) {
	  rej(error);
	}
 });

const PORT = process.env.PORT || 4002

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
	switch (req.method) {
		case "GET":
			switch (req.url) {
				case "/api/users":
					res.writeHead(200, { 'Content-Type': 'application/json' });
					 res.end(JSON.stringify(users));
					
			}
		case "POST":
			createUser(req, res);
		}
			
	}
)

server.listen(PORT,  () => {
	console.log(PORT)
})