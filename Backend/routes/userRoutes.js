const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');

// Route to add a new user (accessible by any authenticated user)
router.post('/add', checkAuth, checkAdmin, userController.addUser);


// Route to edit an existing user (accessible by admin or the user editing their own profile)
router.put('/edit/:userId', checkAuth, userController.editUser);

// Route to delete a user (accessible only by admin)
router.delete('/delete/:userId', checkAuth, userController.deleteUser);

// Route for user login (accessible by everyone)
router.post('/login', userController.loginUser);

// Route to view the logged-in user's profile (accessible by authenticated user)
router.get('/viewprofile', checkAuth, userController.viewProfile);

// Route to view all users (accessible only by admin)
router.get('/viewusers', userController.viewUsers);

// Route to update profile (accessible by authenticated users)
router.put('/update', checkAuth, userController.updateProfile);

// Route for password reset (accessible by authenticated users)
// router.post('/forgot-password', checkAuth, userController.forgotPassword);

module.exports = router;
