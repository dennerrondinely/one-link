import express from "express";
import * as useragent from "express-useragent";
import { engine } from "express-handlebars";
import path from "path";
import routes from "./routes";

const app = express();

app.use(useragent.express());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

const port = 3000;

app.use(routes);

app.listen(port, () => {
  console.log(`🚀 OneLink POC rodando em http://localhost:${port}`);
  console.log(`📱 Teste no mobile para ver o redirecionamento de apps`);
});
