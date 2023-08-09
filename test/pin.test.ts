import { pin } from '../src';

describe('pin()', () => {
  it('pins and return the provider and cid', async () => {
    const json = { name: 'Vitalik' };
    const receipt = await pin(json);
    expect(receipt.provider).toBe('4everland');
    expect(receipt.cid).toBe('bafkreibatgmdqdxsair3j52zfhtntegshtypq2qbex3fgtorwx34kzippe');
  }, 30e3);
});
