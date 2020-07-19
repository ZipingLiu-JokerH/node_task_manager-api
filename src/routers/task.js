const express = require("express");

const Task = require("../models/task");
const authMiddleware = require("../middleware/auth");

const router = new express.Router();

// post request to create a new task
router.post("/tasks", authMiddleware, async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id });
    try {
        const result = await task.save();
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send(error);
    }
});

// get request to fetch all tasks
// if querying string provided return these tasks
// ?completed=true
// ?limit=10&skip=10
// ?sortBy=createdAt_asc/desc
router.get("/tasks", authMiddleware, async (req, res) => {
    const match = {};
    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }
    const sort = {};
    if (req.query.sortBy) {
        const [value, pattern] = req.query.sortBy.split("_");
        sort[value] = pattern === "desc" ? -1 : 1;
    }

    try {
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        res.status(500).send();
    }
});

// get request to fetch a single task with id
router.get("/tasks/:id", authMiddleware, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

// patch request to update a task
router.patch("/tasks/:id", authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid Update!" });
    }

    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => (task[update] = req.body[update]));
        await task.save();

        res.send(task);
    } catch (error) {
        // Later we will handle 2 cases here, error from connection to db or error from validation
        res.status(400).send();
    }
});

// delete request to delete a task
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const result = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!result) {
            return res.status(404).send();
        }
        res.send(result);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
