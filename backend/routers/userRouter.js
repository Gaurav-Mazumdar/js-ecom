import express from 'express';
import bcrypt from 'bcrypt';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel';
import { generateToken, isAuth } from '../utils';

const userRouter = express.Router();

userRouter.get(
  '/createadmin',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: 'admin',
        email: 'admin@example.com',
        password: 'jsamazona',
        isAdmin: true,
      });
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const signinUser = await User.findOne({
      email: req.body.email,
    });
    if (!signinUser) {
      res.status(400).send({
        message: 'Email doesnot exists',
      });
    }
    const validPass = await bcrypt.compare(req.body.password, signinUser.password);
    if(!validPass) return res.status(400).send({message: 'Invalid Password'})
    res.send({
        _id: signinUser._id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: generateToken(signinUser),
    });
}));
userRouter.post('/register',
  expressAsyncHandler(async (req, res) => {
    const userExist = await User.findOne({email: req.body.email});
    if(userExist) return res.status(400).send({message: 'Email already registered'})

    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(req.body.password, salt);
      
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPwd,
    });
    const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
  })
);

userRouter.put(
    '/:id', isAuth,
    expressAsyncHandler(async (req, res) => {
      const user = await User.findById(req.params.id);

      const salt = await bcrypt.genSalt(10);
      const hashPwd = await bcrypt.hash(req.body.password, salt);
  
      if (!user) {
        res.status(404).send({
          message: 'User Not Found',
        });
      } else {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = hashPwd || user.password;
        const updatedUser = await user.save();
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        });
      }
    })
  );
export default userRouter;