import axios from 'axios';
import { delayTime } from './config';
import { Response } from 'express';

interface IDelayedResponseArgs {
  res: Response;
  response_url: string;
  responseBody: any;
  delay?: number;
}

const EMPTY_RESPONSE = { response_type: 'in_channel' };

export const sendDelayedResponse = (
  delayedResponseArgs: IDelayedResponseArgs
) => {
  const { res, response_url, responseBody, delay } = delayedResponseArgs;

  const time = delay || delayTime;

  if (response_url) {
    console.log('response_url', response_url);
    // must send empty response immediately
    res.status(200).send(EMPTY_RESPONSE);
    console.log(`sending response in ${delayTime}ms`);

    // send actual Magic 8 Ball answer in the future
    setTimeout(async () => {
      try {
        await axios.post(response_url, responseBody);
        console.log('success.');
      } catch (err) {
        console.error('error posting to response_url', response_url);
        console.error('attempted esponse body', responseBody);
        console.error(err.response.status);
        console.error(err.response.statusText);
        console.error(err.request.path);
        console.error(err.response.data);
      }
    }, time);
  } else {
    console.warn('there was no response_url');
    res.json(responseBody);
  }
};
