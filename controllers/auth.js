const passport = require('../config/ppConfig');
const router = express.router();
const passport = require('../models');

const { User } = require('../models');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
  });
  
  router.get('/login', (req, res) => {
    res.render('auth/login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    successFlash: 'Welcome back ...',
    failureFlash: 'Either email or password is incorrect' 
  }));
  

  router.post('/signup', async (req, res) => {
    // we now have access to the user info (req.body);
    const { email, name, password } = req.body; // goes and us access to whatever key/value inside of the object
    try {
      const [user, created] = await User.findOrCreate({
          where: { email },
          defaults: { name, password }
      });
  
      if (created) {
          // if created, success and we will redirect back to / page
          console.log(`----- ${user.name} was created -----`);
          const successObject = {
              successRedirect: '/',
              successFlash: `Welcome ${user.name}. Account was created and logging in...`
          }
          // 
          passport.authenticate('local', successObject)(req, res);
      } else {
        // Send back email already exists
        req.flash('error', 'Email already exists');
        res.redirect('/auth/signup'); // redirect the user back to sign up page to try again
      }
    } catch (error) {
          // There was an error that came back; therefore, we just have the user try again
          console.log('**************Error');
          console.log(error);
          req.flash('error', 'Either email or password is incorrect. Please try again.');
          res.redirect('/auth/signup');
    }
  });
  
  module.exports = router;