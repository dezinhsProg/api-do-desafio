const router = require('express').Router();

// Route in categories
const categoriesRoutes = require('./categories.routes');
router.use('/categories', categoriesRoutes);

// Route in users    
const usersRoutes = require('./users.routes');
router.use('/user', usersRoutes);

module.exports = router;
