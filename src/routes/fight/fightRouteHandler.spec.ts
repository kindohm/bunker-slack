import { getResponse } from './fightRouteHandler';

describe('fightRouteHandler', () => {
  it('should give response', () => {
    const response = getResponse('', '', '');
    const { status } = response;
    expect(status).toEqual(200);
  });

  it('should start new fight', () => {
    const response = getResponse('challenger', 'room', '<@opponent> h m l');
    const { status, body } = response;
    expect(body).toEqual(`challenger challenges opponent to a fight!`);
  });
});
