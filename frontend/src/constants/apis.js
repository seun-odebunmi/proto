import { getData, postData } from '../helpers/fetch';

export const initBotApi = user => getData('/botInit/', { user });
export const replyBotApi = (msg, user) => postData('/botReply/', { msg }, { user });
