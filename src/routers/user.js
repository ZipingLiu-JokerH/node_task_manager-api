const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const { sendWelcomeEamil, sendGoodbyEamil } = require("../emails/account");

const router = new express.Router();
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Only accept these file type: jpg, jpeg, png"));
        }
        cb(undefined, true);
    }
});

// post request to create a new user
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEamil(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// user login
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// user logout
router.post("/users/logout", authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// user logout all (remove all auth token)
router.post("/users/logoutAll", authMiddleware, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

// get request to fetch loged in user profile
router.get("/users/me", authMiddleware, async (req, res) => {
    res.send(req.user);
});

// patch request to update a user
router.patch("/users/me", authMiddleware, async (req, res) => {
    // by default update on non existing field will be ignored
    // we want to handle this case and let user know something went wrong
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const user = req.user;
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.send(user);
    } catch (error) {
        // Later we will handle 2 cases here, error from connection to db or error from validation
        res.status(400).send(error);
    }
});

// delete request to delete a user
router.delete("/users/me", authMiddleware, async (req, res) => {
    try {
        await req.user.remove();
        sendGoodbyEamil(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
});

// user upload profile picture
router.post(
    "/users/me/avatar",
    authMiddleware,
    upload.single("avatar"),
    async (req, res) => {
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

// delete user profile picture
router.delete("/users/me/avatar", authMiddleware, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

// get user profile picture
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }

        // set the response header, indicate what data is sending back
        res.set("Content-type", "image/png");
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;
