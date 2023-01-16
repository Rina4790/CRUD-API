import { createServer, IncomingMessage, ServerResponse } from 'http';
import {
  getUsers, getUserId, errorRouteNotFound, errorValidId, createUser, updateUser, deleteUser, handleErrorServer,
} from './controllers/userController';
import { validate as uuidValidate} from 'uuid';

export const uuidValid = (uuid: string): boolean => uuidValidate(uuid);

const PORT = process.env.PORT || 5000;

const parseUrl = (url: string | undefined) => url?.split('/').reduce((acc, cur, num) => {
	if (num < 3) return `${acc + cur}/`;
	return acc;
 }, '');
 

export const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  try {
    const route = req.url?.replace(/\/$|\/*$/g, '');
    const parseRoute = parseUrl(route)?.replace(/\/$|\/*$/g, '');
    const id = req.url?.split('/')[3];


    if (route === '/api/users' && !id && req.method === 'GET') {
      getUsers(req, res);
    } else if (parseRoute === '/api/users' && id && req.method === 'GET') {
      const valide = uuidValid(id);
      if (valide) {
        getUserId(req, res, id);
      } else {
        errorValidId(req, res);
      }
    } else if (route === '/api/users' && req.method === 'POST') {
      createUser(req, res);
    } else if (parseRoute === '/api/users' && id && req.method === 'PUT') {
      const valide = uuidValid(id);
      if (valide) {
        updateUser(req, res, id);
      } else {
        errorValidId(req, res);
      }
    } else if (parseRoute === '/api/users' && id && req.method === 'DELETE') {
      const valide = uuidValid(id);
      if (valide) {
        deleteUser(req, res, id);
      } else {
        errorValidId(req, res);
      }
    } else {
      errorRouteNotFound(req, res);
    }
  } catch (error) {
    handleErrorServer(req, res);
  }
});


  server.listen(PORT, () => console.log(`Port ${PORT}`));

