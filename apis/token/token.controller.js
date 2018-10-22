const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { sendEmail } = require('../../services/Email');
const { errorHandler, status404Handler } = require('../../middlewares');


const User = require('../../models/user.model');

const router = express.Router();
const privateKey = fs.readFileSync(path.join(process.cwd(), 'keys/enrollment_manager'), 'utf8');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', async (req, res, next) => {
  const { associateId } = req.body;
  const foundUser = await User.findOne({ associateId });
  const payload = {
    emailId: 'nishantkumarajain@gmail.com',
    associateId: foundUser.associateId,
    name: foundUser.name,
  };
  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  const email = {
    subject: 'StackRoute Enrollment Link',
    text: `
    Hi ${payload.name},

    You can continue to Enrollment Manager using the following link. http://localhost:4200/events?token=${token}
    
    Thank you.

    Regards,
    StackRoute
    `,
    to: 'nishantkumarajain@gmail.com',
  };
  const emailResponse = await sendEmail(email);
  res.status(201).json(emailResponse);
  next();
});

router.use(status404Handler);
router.use(errorHandler);

module.exports = router;
