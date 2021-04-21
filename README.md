<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This is an REST API built with node.js, express, MongoDB. The API provide CRUD operations on a user's profile and their tasks.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)

## Usage

Here is a table of the API endpoints start with <https://jokerh-task-manager.herokuapp.com>

| API endpoints    | Method |       Description       |               Body Parameters |
| ---------------- | :----: | :---------------------: | ----------------------------: |
| /users           |  POST  |       create user       |         name, email, password |
| /users/login     |  POST  |       user login        |               email, password |
| /users/logout    |  POST  |       user logout       |                               |
| /users/logoutall |  POST  | remove all access token |                               |
| /users/me/avatar |  POST  |   upload user avatar    |                      avatar\* |
| /users/me/avatar | DELETE |   delete user avatar    |                               |
| /tasks           |  POST  |       create task       | title, description, completed |
| /users/me        |  GET   |       get profile       |                               |
| /uses/:id/avatar |  GET   |   get profile avatar    |                               |
| /tasks           |  GET   |      get all tasks      |                               |
| /tasks/:id       |  GET   |     get single task     |                               |
| /users/me        | PATCH  |       update user       |    name, email, password, age |
| /tasks/:id       | PATCH  |       update task       |        description, completed |
| /users/me        | DELETE |       delete user       |                               |
| /tasks/:id       | DELETE |       delete task       |                               |

---

body parameters are in JSON formate with the exception of avatar  
avatar\*: type of form-data, only accept file end with .jpg, .jpeg, .png

<!-- LICENSE -->

## License

Distributed under the MIT License.

<!-- CONTACT -->

## Contact

Ziping Liu - zipingliu_herrick@outlook.com

Project Link: [https://github.com/ZipingLiu-JokerH/node_task_manager-api](https://github.com/ZipingLiu-JokerH/node_task_manager-api)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [JSON Web Tokens](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [postman](https://www.postman.com/)
- [Best README Template](https://github.com/othneildrew/Best-README-Template)
- [heroku](https://www.heroku.com/)
