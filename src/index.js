const express = require("express");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

require("./db/mongoose");

const app = express();
const port = process.env.PORT;

// set up express, so it can auto parse
// incoming json data to object, so we can
// access from req handlers
app.use(express.json());

// link each router into the app
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
