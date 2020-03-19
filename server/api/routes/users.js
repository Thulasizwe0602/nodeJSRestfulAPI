const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './userAvatars/');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype == 'image/jpeg' ? '.jpg' : '.png';
        cb(null, req.params.userId + ext)
    }
});
const fileType = (req, file, cb) => {
    cb(null, file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
};
const userUpload = multer(
    {
        storage: fileStorage,
        limits:
        {
            fileSize: 1024 * 1024 * 2
        },
        fileFilter: fileType
    });
const userController = require('../controllers/userController')
const isAuthorized = require('../middleware/authorise');

router.get('/', isAuthorized, userController.users_get_all);

router.get('/:userId', userController.users_get_user);

router.post('/signup', userController.users_signUp);

router.post('/signin', userController.user_signIn);

router.delete('/:userId', isAuthorized, userController.users_delete_user);

router.patch('/:userId', isAuthorized, userUpload.single('userAvatar'), userController.users_update_user);

module.exports = router;