const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Freelancer, validate} = require('../models/freelancer');
const {User} = require('../models/user');
const express = require('express');
const _ = require('lodash');
const router = express.Router();

/**
 * @swagger
 * /api/freelancers:
 *  get:
 *   summary: Get all freelances
 *   description: Query all freelances info.
 *   responses:
 *    200:
 *     description: success
 */
router.get('/', auth, async (req, res) => {
    const freelancers = await Freelancer.find()
        .populate('user', '-password').sort('name');
    res.send(freelancers);
});

/**
 * @swagger
 * /api/freelancers/{freelancer_id}:
 *  get:
 *   summary: Get specific freelance
 *   description: Query freelance information base on freelancer ID.
 *   parameters:
 *    - in: path
 *      name: freelancer_id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the freelancer
 *   responses:
 *    200:
 *     description: success
 */
router.get('/:id', auth, async (req, res) => {
    if (!req.params.id) return res.status(404).send('The freelancer with the given ID was not found.');
    const freelancers = await Freelancer.findById(req.params.id).populate('user', '-password');
    res.send(freelancers);
});

/**
 * @swagger
 * /api/freelancers:
 *  post:
 *   summary: Register User
 *   description: Register new User
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Register new user credential using email and password.
 *      schema:
 *       $ref: '#/definitions/Freelancer'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Freelancer'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let freelancer = new Freelancer(_.pick(req.body,
        ['user', 'name', 'phone','skill', 'hobby']));
    freelancer = await freelancer.save();

    res.send(freelancer);
});

/**
 * @swagger
 * /api/freelancers/{freelancer_id}:
 *  put:
 *   summary: Update specific freelance
 *   description: Update freelance information base on freelancer ID.
 *   parameters:
 *    - in: path
 *      name: freelancer_id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the freelance
 *      example: 60136683814c7314ec16a6df
 *    - in: body
 *      name: body
 *      required: true
 *      description: New freelancer object.
 *      schema:
 *       $ref: '#/definitions/Freelancer'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Freelancer'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const freelancer = await Freelancer.findByIdAndUpdate(req.params.id,
        {
            user:req.body.user,
            name: req.body.name,
            phone: req.body.phone,
            skill: req.body.skill,
            hobby: req.body.hobby
        }, { new: true });

    if (!freelancer) return res.status(404).send('The freelancer with the given ID was not found.');

    res.send(freelancer);
});

/**
 * @swagger
 * /api/freelancers/{freelancer_id}:
 *  delete:
 *   summary: delete freelancer
 *   description: delete freelancer
 *   parameters:
 *    - in: path
 *      name: freelancer_id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the freelancer
 *      example: 60136683814c7314ec16a6df
 *   responses:
 *    200:
 *     description: success
 */
router.delete('/:id', auth, async (req, res) => {
    let freelancer = await Freelancer.findById(req.params.id).populate('user', '_id');
    if (!freelancer) return res.status(404).send('The freelancer with the given ID was not found.');

    const freelancerRemoveStatus = await Freelancer.findByIdAndRemove(req.params.id);
    const userRemoveStatus = await User.findByIdAndRemove(freelancer.user._id);
    Promise.all([freelancerRemoveStatus, userRemoveStatus])
        .then(res.status(200).send('Freelancer have been remove from the database.'))
        .catch(res.status(500).send('Something went wrong. Deleting process fail.'));
});

module.exports = router;
