import { getData, postData } from './util';

export const initBotApi = () => getData('/botInit/');
export const replyBotApi = (msg) => postData('/botReply/', { msg });
