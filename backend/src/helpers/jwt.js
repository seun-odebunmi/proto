import jwt from 'jsonwebtoken';

import { pbk, pvk } from '../constants';

const config = {
  privateKey: pvk,
  publicKey: pbk,
  options: {
    issuer: 'Interswitch Group',
    subject: 'support@interswitchgroup.com',
    audience: 'http://interswitchgroup.com',
    expiresIn: '1h',
    algorithm: 'RS256'
  }
};

export const sign = payload =>
  jwt.sign(payload, config.privateKey, config.options);

export const verify = token => {
  try {
    return jwt.verify(token, config.publicKey, {
      ...config.options,
      algorithm: [config.options.algorithm]
    });
  } catch (err) {
    return false;
  }
};

export const decode = token => jwt.decode(token, { complete: true });
