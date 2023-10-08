const User = require('../models/user')
const auth = require('../helpers/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailValidator = require('email-validator');

exports.test = (req, res) => {
    res.json("ok");
}

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if name was entered
        if (!name) {
            return res.json({
                error: "Name is required"
            })
        };
        // validate email
        if (!email) {
            return res.json({
                error: "Email is required"
            })
        } else {
            if (emailValidator.validate(email)) {
                return res.json({
                    error: "Wrong email format"
                })
            }
        }
        // check is password is good
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and show be at least 6 characters long"
            })
        };
        //check email 
        const exist = await User.findOne({ email: email });
        if (exist) {
            return res.json({
                error: "Email is taken already"
            })
        }
        const hashedPassword = await auth.hashPassword(password)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        return res.json(user);
    } catch (err) {
        console.log(err);
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.json({
                error: "Email is required"
            })
        } else {
            if (!emailValidator.validate(email)) {
                res.json({
                    error: "Wrong email format"
                })
            }
        }
        // check if user exist
        if (!password) {
            return res.json({
                error: "Password is required"
            })
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                error: "Email not found"
            })
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        error: err
                    })
                } else if (result) {
                    const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('token', token).json({
                        user: user,
                        token: token
                    })

                } else {
                    res.json({
                        error: 'Wrong Password'
                    })
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error
        })
    }
}

exports.getProfile = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        })
    } else {
        res.json(null)
    }
}