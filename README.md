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
  - Import a HTML file and watch it magically convert to Markdown
  - Drag and drop images (requires your Dropbox account be linked)


You can also:
  - Import and save files from GitHub, Dropbox, Google Drive and One Drive
  - Drag and drop markdown and HTML files into Dillinger
  - Export documents as Markdown, HTML and PDF

Markdown is a lightweight markup language based on the formatting conventions that people naturally use in email.  As [John Gruber] writes on the [Markdown site][df1]

> The overriding design goal for Markdown's
> formatting syntax is to make it as readable
> as possible. The idea is that a
> Markdown-formatted document should be
> publishable as-is, as plain text, without
> looking like it's been marked up with tags
> or formatting instructions.

This text you see here is *actually* written in Markdown! To get a feel for Markdown's syntax, type some text into the left window and watch the results in the right.
