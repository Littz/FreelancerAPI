const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//'user', 'name', 'phone','skill', 'hobby'
/**
 * @swagger
 * definitions:
 *  User:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: email of the user
 *     example: 'user@example.com'
 *    password:
 *     type: string
 *     description: user password
 *    role:
 *     type: string
 *     description: User specific role. Consist of 'Freelancer' or 'Company' only
 *     example: 'Freelancer'
 *  Freelancer:
 *   type: object
 *   properties:
 *    user:
 *     type: string
 *     description: User ID
 *    name:
 *     type: string
 *     description: the name of the freelancer
 *     example: 'John Smith'
 *    phone:
 *     type: string
 *     description: freelancer phone number
 *     example: '01234567890'
 *    skill:
 *     type: string
 *     description: freelancer's programming skill
 *     example: 'JavaScript'
 *    hobby:
 *     type: string
 *     description: freelancer's hobby
 *     example: 'Fishing'
 *  Skill:
 *   type: object
 *   properties:
 *    name:
 *     type: string
 *     description: Skill name
 *     example: Swift
 */

/**
 * @swagger
 * /api/users:
 *  post:
 *   summary: Register User
 *   description: Register new User
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Register new user credential using email and password.
 *      schema:
 *       $ref: '#/definitions/User'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/User'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['email', 'password','role']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'role','isAdmin' ]));
});

module.exports = router;
