import { IncomingMessage, ServerResponse } from "http";
import { findAll, findById, create, update, remove } from "../models/userModel";

const userData = (req: IncomingMessage): Promise<string> =>
  new Promise((res, rej) => {
    try {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
      req.on("end", () => {
        res(data);
      });
    } catch (error) {
      rej(error);
    }
  });

const trueArray = (array: string[]) => {
  return (
    Array.isArray(array) && array.every((value) => typeof value === "string")
  );
};

export const serverError = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify("Sorry, the server is temporarily down"));
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify("As a result of user actions, the server was disabled.")
    );
  }
};

export const notFoundError = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify("The user was not found."));
  } catch (error) {
	serverError(req, res);
  }
};

export const getUsers = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = await findAll();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  } catch (error) {
	serverError(req, res);
  }
};

export const getUserId = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    const user = await findById(id);
    if (!user) {
      notFoundError(req, res);
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
	notFoundError(req, res);
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await userData(req);
    const { username, age, hobbies } = JSON.parse(body);
    if (
      typeof username === "string" &&
      typeof age === "number" &&
      trueArray(hobbies)
    ) {
      const user = {
        username,
        age,
        hobbies,
      };
      const newUser = await create(user);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(newUser));
    }
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify("Not all required fields have been completed"));
  } catch (error) {
	serverError(req, res);
  }
  return ServerResponse;
};

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    const user = await findById(id);
    if (!user) {
      notFoundError(req, res);
    } else {
      const body = await userData(req);
      const { username, age, hobbies } = JSON.parse(body);
      if (
        typeof username === "string" &&
        typeof age === "number" &&
        trueArray(hobbies)
      ) {
        const userData = {
          username: username || user.username,
          age: age || user.age,
          hobbies: hobbies || user.hobbies,
        };
        const newData = await update(id, userData);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify(newData));
      }
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify("Not all required fields have been completed")
      );
    }
  } catch (error) {
	notFoundError(req, res);
  }
  return ServerResponse;
};

export const deleteUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
) => {
  try {
    const user = await findById(id);
    if (!user) {
      notFoundError(req, res);
    } else {
      await remove(id);
      res.writeHead(204, { "Content-Type": "application/json" });
      res.end();
    }
  } catch (error) {
	notFoundError(req, res);
  }
};

export const errorValidId = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify("The ID you entered is not valid."));
  } catch (error) {
	serverError(req, res);
  }
};

export const errorAdsress = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify("This request address does not exist"));
  } catch (error) {
	serverError(req, res);
  }
};
