import { createServer, IncomingMessage, ServerResponse } from "node:http";
import {
  getUsers,
  getUserId,
  errorAdsress,
  errorValidId,
  createUser,
  updateUser,
  deleteUser,
  serverError,
} from "./controllers/userController";
import { validate as uuidValidate } from "uuid";
import * as dotenv from 'dotenv';
dotenv.config();

 const uuidValid = (uuid: string): boolean => uuidValidate(uuid);

const PORT = process.env.PORT || 8000;
 const urlId = /^\/api\/users\/[^\/]+$/;

export const server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    try {
      const id = req.url?.split("/")[3];

      if (req.url === "/api/users" && !id && req.method === "GET") {
        getUsers(req, res);
		} else if (req.url.match(urlId) && id && req.method === "GET") {
			console.log(id)
        const valide = uuidValid(id);
        if (valide) {
          getUserId(req, res, id);
        } else {
          errorValidId(req, res);
        }
      } else if (req.url === "/api/users" && req.method === "POST") {
        createUser(req, res);
      } else if (req.url.match(urlId) && id && req.method === "PUT") {
        const valide = uuidValid(id);
        if (valide) {
          updateUser(req, res, id);
        } else {
          errorValidId(req, res);
        }
      } else if (req.url.match(urlId) && id && req.method === "DELETE") {
        const valide = uuidValid(id);
        if (valide) {
          deleteUser(req, res, id);
        } else {
          errorValidId(req, res);
        }
      } else {
        errorAdsress(req, res);
      }
    } catch (error) {
      serverError(req, res);
    }
  }
);

server.listen(PORT, () => console.log(`Port ${PORT}`));
