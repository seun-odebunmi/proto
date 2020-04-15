import crypto from 'crypto';

export const generatePassword = () => Math.random().toString(36).slice(-8);

export const generateSalt = (length = 20) =>
  crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);

export const hashPassword = (password, salt) => {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  const passwordHash = hash.digest('hex');

  return passwordHash;
};
