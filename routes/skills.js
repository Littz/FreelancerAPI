const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Skill, validate} = require('../models/skill');
const express = require('express');
const router = express.Router();


/**
 * @swagger
 * /api/skills:
 *  get:
 *   summary: Get all skills
 *   description: Query all skills info.
 *   responses:
 *    200:
 *     description: success
 */
router.get('/', async (req, res) => {
    const skills = await Skill.find().sort('name');
    res.send(skills);
});

/**
 * @swagger
 * /api/skills:
 *  post:
 *   summary: Register Skill
 *   description: Register new Skill
 *   parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      description: Register new Skill for freelancer.
 *      schema:
 *       $ref: '#/definitions/Skill'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Skill'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let skill = new Skill({ name: req.body.name });
    skill = await skill.save();

    res.send(skill);
});

/**
 * @swagger
 * /api/skills/{skill_id}:
 *  put:
 *   summary: Update specific freelance
 *   description: Update skill information base on skill ID.
 *   parameters:
 *    - in: path
 *      name: skill_id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the skill
 *      example: 60136683814c7314ec16a6df
 *    - in: body
 *      name: body
 *      required: true
 *      description: New Skill information.
 *      schema:
 *       $ref: '#/definitions/Skill'
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Skill'
 *   responses:
 *    200:
 *     description: success
 *    500:
 *     description : error
 */
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const skill = await Skill.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    res.send(skill);
});


/**
 * @swagger
 * /api/skills/{skill_id}:
 *  delete:
 *   summary: delete skill
 *   description: delete skill
 *   parameters:
 *    - in: path
 *      name: skill_id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the skill
 *      example: 60136683814c7314ec16a6df
 *   responses:
 *    200:
 *     description: success
 */
router.delete('/:id', auth, async (req, res) => {
    const skill = await Skill.findByIdAndRemove(req.params.id);

    if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    res.send(skill);
});

/**
 * @swagger
 * /api/skills/{skill_id}:
 *  get:
 *   summary: Get specific freelance
 *   description: Query Skill information base on skill ID.
 *   parameters:
 *    - in: path
 *      name: skill_id
 *      schema:
 *       type: string
 *      required: true
 *      description: id of the skill_id
 *   responses:
 *    200:
 *     description: success
 */
router.get('/:id', async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    res.send(skill);
});

module.exports = router;
