import { IncomingMessage, ServerResponse } from "http";
import { create } from "./index";

export const getPostData = (req: IncomingMessage): Promise<string> =>
  new Promise((res, rej) => {
    try {
      let body = "" ;

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        res(body);
      });
    } catch (error) {
      rej(error);
    }
  });

export const checkArray = (array: string[]) => {
  return (
    Array.isArray(array) && array.every((value) => typeof value === "string")
  );
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
	const body = await getPostData(req);
	if (body) {
		const { username, age, hobbies } = JSON.parse(body);
		if (
			typeof username === "string" &&
			typeof age === "number" &&
			checkArray(hobbies)
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
	}
  

  
};
