const bcrypt = require("bcrypt");
const fs = require("fs");

const register = (req, res) => {
    const {
        username,
        name,
        password
    } = req.body;

    const jsonData = fs.readFileSync("data/users.json");
    const users = JSON.parse(jsonData);
    if (!username || !name || !password) {
        res.json({
            status: "error",
            error: "Username/name/password cannot be empty.",
        });
        return;
    }
    if (!/^\w+$/i.test(username)) {
        res.json({
            status: "error",
            error: "Username is not valid."
        });
        return;
    }
    if (users[username]) {
        res.json({
            status: "error",
            error: "Username is already taken."
        });
        return;
    }

    const hash = bcrypt.hashSync(password, 10);
    users[username] = {
        name,
        password: hash
    };


    fs.writeFileSync("data/users.json", JSON.stringify(users, null, " "));

    res.json({
        status: "success"
    });
}
const signin = (req, res) => {
    const {
        username,
        password
    } = req.body;


    const jsonData = fs.readFileSync("data/users.json");
    const users = JSON.parse(jsonData);


    if (!users[username]) {
        res.json({
            status: "error",
            error: "Username is not found."
        });
        return;
    }
    const hashedPassword = users[username].password;
    if (!bcrypt.compareSync(password, hashedPassword)) {
        res.json({
            status: "error",
            error: "Wrong password."
        });
        return;
    }


    req.session.user = {
        username,
        name: users[username].name
    };
    res.json({
        status: "success",
        user: req.session.user
    });

}
const validate = (req, res) => {
    if (!req.session.user) {
        res.json({
            status: "error",
            error: "You have not signed in."
        });
        return;
    }

    res.json({
        status: "success",
        user: req.session.user
    });
}
const signout = (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    res.json({
        status: "success"
    });
}
module.exports = {
    register,
    signin,
    signout,
    validate
};