const usersRoutes = require('express').Router();
const users = require('../controllers/users.controller');
const { validaToken } = require('../middlewares/auth');

usersRoutes.get("/all",validaToken , users.findAll);

usersRoutes.get("/show/:id",validaToken , users.findOne);

usersRoutes.post("/create",validaToken , users.create);

usersRoutes.put("/update",validaToken, users.update);

usersRoutes.delete("/delete/:id",validaToken, users.delete);

usersRoutes.get("/login",validaToken, users.login);

usersRoutes.get("/user-senha",validaToken, users.senha);

usersRoutes.get("/validaToken",validaToken, users.validaToken);

module.exports = usersRoutes;