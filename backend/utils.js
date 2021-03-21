import jwt from 'jsonwebtoken';
import config from './config';

export const generateToken = (user) => jwt.sign(
    {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
    },
    config.JWT_SECRET, {
        expiresIn: '1hr'
    }
);

export const isAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if(!bearerToken){
        res.status(401).send({message: 'Token is not provided'});
    }else{
        const token = bearerToken.slice(7, bearerToken.length);
        jwt.verify(token, config.JWT_SECRET, (err, data) =>{
            if(err){
                res.status(401).send({message:'Invalid token'});
            }
            req.user = data;
            next();
        })
    }
}