import { pin } from '../src';

const PINEAPPLE_URL = process.env.PINEAPPLE_URL ?? 'https://pineapple.fyi';

describe('pin()', () => {
  it('pins on IPFS and return the provider and cid', async () => {
    const json = { name: 'Vitalik' };
    const receipt = await pin(json);
    expect(receipt.provider).toBe('4everland');
    expect(receipt.cid).toBe(
      'bafkreibatgmdqdxsair3j52zfhtntegshtypq2qbex3fgtorwx34kzippe'
    );
  });

  it('pins on swarm and return the provider and cid', async () => {
    const json = { name: 'Vitalik' };
    const receipt = await pin(json, PINEAPPLE_URL, { protocol: 'swarm' });
    expect(receipt.provider).toBe('swarmy');
    expect(receipt.cid).toBe(
      'e4135e1002b35bc64d91c35084406fdfcc76e28d6d80256ba50ce0ffe72ee841'
    );
  });

  it('throws error for invalid protocol', async () => {
    const json = { name: 'Vitalik' };
    await expect(
      pin(json, PINEAPPLE_URL, { protocol: 'invalid' as any })
    ).rejects.toEqual({
      error: {
        code: 400,
        message: 'Invalid protocol: invalid.'
      }
    });
  });
});
