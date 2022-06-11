import fetch from 'cross-fetch';
import { getAddress } from '@ethersproject/address';
import { formatBytes32String } from '@ethersproject/strings';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import shot from '@snapshot-labs/snapshot.js';
import subgraphs from './subgraphs.json';

const CONTRACT = '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446';
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
const EMPTY_SPACE = formatBytes32String('');
const abi = ['function delegation(address, bytes32) view returns (address)'];

export async function gqlQuery(url: string, query) {
  const init = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: jsonToGraphQLQuery({ query }) })
  };
  const res = await fetch(url, init);
  return await res.json();
}

export async function getDelegations(
  space: string,
  addresses: string[],
  network,
  snapshot: number | 'latest'
) {
  // Find delegators addresses
  let accounts: any = Object.fromEntries(addresses.map((address) => [address, true]));
  const query = {
    delegations: {
      __args: {
        first: 1000,
        where: {
          space_in: ['', space],
          delegate_in: addresses
        }
      },
      delegator: true
    }
  };
  if (snapshot !== 'latest') query.delegations.__args['block'] = { number: snapshot };
  const { data } = await gqlQuery(subgraphs[network], query);
  data.delegations.forEach((delegation) => (accounts[getAddress(delegation.delegator)] = true));
  accounts = Object.keys(accounts);

  // Get delegations on-chain
  const id = formatBytes32String(space);
  const options = { blockTag: snapshot };
  const multi = new shot.utils.Multicaller(network, shot.utils.getProvider(network), abi, options);
  accounts.forEach((account) => {
    multi.call(`${account}.base`, CONTRACT, 'delegation', [account, EMPTY_SPACE]);
    multi.call(`${account}.space`, CONTRACT, 'delegation', [account, id]);
  });
  const delegations = await multi.execute();

  // Build delegation links
  const total = {};
  addresses.forEach((address) => {
    total[address] = Object.entries(delegations)
      .filter(([, delegation]: any) => {
        if (delegation.space === address) return true;
        if (delegation.space === EMPTY_ADDRESS && delegation.base === address) return true;
        return false;
      })
      .map(([account]) => account);
  });

  return Object.fromEntries(
    Object.entries(total).filter(
      ([address, d]: any) =>
        d.length > 0 ||
        JSON.stringify(delegations[address]) ===
          JSON.stringify({ base: EMPTY_ADDRESS, space: EMPTY_ADDRESS })
    )
  );
}
