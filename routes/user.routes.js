const {Router} = require('express');
const {check, validationResult, body} = require('express-validator');
const User = require('../models/User');

const router = Router();

router.get('/all', [],
    async (req, res) => {
        try {
            return await User.find({}, (err, allUsers) => {
                if (err) console.error(err);
                res.send(allUsers)
            });
        } catch (error) {
            res.status(500)
                .json({message: "Get all user server error"})
        }
    }
);

router.get('/name/:name',
    [
        // check('name').trim().escape()
            // .isEmpty().withMessage('Field name cannot be empty')
            // .isAlpha().withMessage('Only Alphabetic symbols')
        //     .trim().escape(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data request'
                });
            }
            const name = req.params.name;
            const users = await User.find({'name': {$regex: name, $options: 'i'}},
                (err, allUsers) => {
                    if (err) console.error(err);
                    res.send(allUsers)
                });
            if (!users) {
                return res.status(400).json({
                    message: `User with name ${name} did not find`
                });
            }
        } catch (error) {
            res.status(500)
                .json({message: "Get all user server error"})
        }
    }
);

router.get('/id/:id', [
        check('id').trim().escape()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data request'
                });
                const id = req.params.id;
                console.log(id);
                const user = await User.findById({id});
                if (!user) {
                    return res.status(400).json({
                        message: `User with id ${id} did not find`
                    });
                }
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500)
                .json({message: "Get all user server error"})
        }
    }
);

// add new user
router.post('/',
    [
        body('name').trim().escape(),
        body('picture').trim().escape(),
        body('description').trim().escape()
    ],
    async (req, res) => {
        console.log('user post router')
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data request'
                });
            }
            console.log(req.body);
            const candidate = new User({...req.body});
            const user = await candidate.save();

            console.log('User:', user);
            if (!user) {
                return res.status(400).json({
                    message: `User cannot be added`
                });
            }
            res.status(200).json(user);
        } catch (error) {
            console.log("Error", error);
            res.status(500)
                .json({message: "Post new user server error"})
        }
    }
);

// update user
router.put('/',
    [
        body('_id').trim().escape(),
        // body('_id').isEmpty().withMessage('Id cannot be empty'),
        body('name').trim().escape(),
        // body('name').isEmpty().withMessage('Name cannot be empty'),
        body('picture').trim().escape(),
        body('description').trim().escape()
    ],
    async (req, res) => {
        console.log('User update router');
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data request'
                });
            }
            console.log(req.body);
            // const {id, name, picture, description} = req.body;
            const candidate = new User(req.body);
            const user = await User.findByIdAndUpdate(candidate._id, candidate);
            if (!user) {
                return res.status(400).json({
                    message: `User cannot be updated`
                });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500)
                .json({message: "Get all user server error"})
        }
    });

router.delete('/:id',
    [
        check('id').trim().escape(),
        // check('id').isEmpty().withMessage('Id cannot be empty')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data request'
                });
            }
            const id = req.params.id;
            const user = await User.findByIdAndDelete(id).exec();
            if (!user) {
                return res.status(400).json({
                    message: `User with id ${id} did not find`
                });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500)
                .json({message: "Get all user server error"})
        }
    }
);

module.exports = router;
