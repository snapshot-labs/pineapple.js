import { getDelegations } from '../src';
import addresses from './addresses.json';

describe('', () => {
  it('getDelegations()', async () => {
    const delegations = await getDelegations('cvx.eth', addresses, '1', 14780000);
    expect(delegations).toMatchSnapshot();
  }, 30e3);
});
