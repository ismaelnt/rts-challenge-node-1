import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";

const PORT = 3333;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((route) => {
    const methodMatches = route.method === method;
    const urlMatches = route.path.test(url);

    return methodMatches && urlMatches;
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    req.params = { ...routeParams.groups };

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🟢`);
});
