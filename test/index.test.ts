import { pin } from '../src';

describe('', () => {
  it('pin()', async () => {
    const json = { name: 'Vitalik' };
    const receipt = await pin(json);
    expect(receipt).toBe('Qme7sLwdao2KKMZ3oJd7dEfi6cbRg3H3PZUDeAW4U3wyZZ');
  }, 30e3);
});
