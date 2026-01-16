const { Router } = require("express");
const Home = require("./controllers/home");
const Redirect = require("./controllers/redirect");

const routes = new Router();

routes.get("/", Home.render);
routes.get("/:id", Redirect.renderRedirectPage);

module.exports = routes;