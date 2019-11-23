import fs from 'fs';

export const fileProcess = dataString => {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  const imageTypeRegularExpression = /\/(.*?)$/;
  const imageType = matches[1].match(imageTypeRegularExpression);
  const response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = 'jpg'; //imageType[1];
  response.data = matches[2];

  return response;
};

export const logoDir = 'logos';

export const tempLogoDir = () => {
  const dir2 = 'tmp';

  if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir);
  }

  if (!fs.existsSync(`${logoDir}/${dir2}`)) {
    fs.mkdirSync(`${logoDir}/${dir2}`);
  }

  return `${logoDir}/${dir2}`;
};
