# FreelancerAPI

This API consist of 3 main endponts
  - User
  - Freelancer
  - Skill

# User.js

```javascript
// To register user
router.post('/', async (req, res) => {
    // validate request body, if not valid, return HTTP 400
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // this code is to search in the database for existing email address.
    //To make sure no duplicate email
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    // Use Lodash to pick data from req.body. (Simplify code)
    user = new User(_.pick(req.body, ['email', 'password','role']));
    
    // Create salt from bcrypt library. we will use salt object in 
    // the hashing password process. 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // Create token by calling the generateAuthToken() from User class
    const token = user.generateAuthToken();
    
    // return the token inside header under param x-auth-token
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'role','isAdmin' ]));
});
```
 
