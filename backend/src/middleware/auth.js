import { verify, decode } from '../helpers';

const auth = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied. No token provided.');
  if (!verify(token)) return res.status(401).send('Access denied. Invalid token provided.');

  try {
    const decoded = decode(token);
    req.user = decoded.payload.user;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

export default auth;
