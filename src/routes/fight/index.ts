import express from 'express';
import { Request, Response } from 'express';
import { IFightRouteResponse, getResponse } from './fightRouteHandler';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const { body } = req;
  const { response_url, user_name, channel_name, text } = body;

  const resp = getResponse(user_name, channel_name, text);
  res.send(resp.status).json(resp.body);
});
