import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';

import { Ledger, LedgerClientFactory } from '@signumjs/core';
import constate from 'constate';

import { ReadyState, AppState, WalletStatus, usePassiveStorage, useTempleClient, XTAccount } from 'lib/temple/front';

export const [
  ReadyTempleProvider,
  useAllNetworks,
  useSetNetworkId,
  useNetwork,
  useAllAccounts,
  useSetCurrentAccount,
  useAccount,
  useSettings,
  useSignum
] = constate(
  useReadyTemple,
  v => v.allNetworks,
  v => v.setNetworkId,
  v => v.network,
  v => v.allAccounts,
  v => v.setCurrentAccount,
  v => v.account,
  v => v.settings,
  v => v.signum
);

function useReadyTemple() {
  const templeFront = useTempleClient();
  assertReady(templeFront);

  const { networks: allNetworks, accounts: allAccounts, settings } = templeFront;

  /**
   * Networks
   */

  const defaultNet = allNetworks[0];
  const [networkId, updateNetworkId] = usePassiveStorage('network_id', '');

  const setNetworkId = useCallback(
    (id: string) => {
      templeFront.selectNetwork(id); // propagate to back and dapp
      updateNetworkId(id);
    },
    [updateNetworkId, templeFront]
  );

  useEffect(() => {
    async function getBestNetwork() {
      const allMainNets = allNetworks.filter(n => n.type === 'main');
      const client = LedgerClientFactory.createClient({
        nodeHost: allMainNets[0].rpcBaseURL,
        reliableNodeHosts: allMainNets.map(n => n.rpcBaseURL)
      });
      const hostUrl = await client.service.selectBestHost(false);
      const found = allNetworks.find(n => n.rpcBaseURL === hostUrl);
      setNetworkId(found?.id || allMainNets[0].id);
    }

    if (!networkId) {
      getBestNetwork();
    }
  }, [allNetworks, networkId, setNetworkId, defaultNet]);

  const network = useMemo(
    () => allNetworks.find(n => n.id === networkId) ?? defaultNet,
    [allNetworks, networkId, defaultNet]
  );

  /**
   * Accounts
   */

  const defaultAcc = allAccounts[0];
  const [accountPkh, updateAccountPkh] = usePassiveStorage('account_publickey', defaultAcc.publicKey);
  const [, updateAccountType] = usePassiveStorage('account_type', defaultAcc.type);
  const [, updateNostrAccount] = usePassiveStorage('account_publickey_nostr', defaultAcc.publicKeyNostr || '');

  const setCurrentAccount = useCallback(
    (account: XTAccount) => {
      templeFront.selectAccount(account.publicKey); // propagate to back and dapp
      updateAccountPkh(account.publicKey);
      updateAccountType(account.type);
      updateNostrAccount(account.publicKeyNostr || '');
    },
    [updateNostrAccount, updateAccountPkh, updateAccountType, templeFront]
  );

  useEffect(() => {
    if (allAccounts.every(a => a.publicKey !== accountPkh)) {
      setCurrentAccount(defaultAcc);
    }
  }, [allAccounts, accountPkh, setCurrentAccount, defaultAcc]);

  const account = useMemo(
    () => allAccounts.find(a => a.publicKey === accountPkh) ?? defaultAcc,
    [allAccounts, accountPkh, defaultAcc]
  );

  /**
   * Error boundary reset
   */

  useLayoutEffect(() => {
    const evt = new CustomEvent('reseterrorboundary');
    window.dispatchEvent(evt);
  }, [networkId, accountPkh]);

  const signum = useMemo<Ledger>(() => {
    return LedgerClientFactory.createClient({
      nodeHost: network.rpcBaseURL
    });
  }, [network]);

  return {
    allNetworks,
    network,
    networkId,
    setNetworkId,

    allAccounts,
    account,
    accountPkh,
    setCurrentAccount,

    settings,
    signum
  };
}

export function useRelevantAccounts() {
  const allAccounts = useAllAccounts();
  const account = useAccount();
  const setCurrentAccount = useSetCurrentAccount();
  useEffect(() => {
    if (allAccounts.every(a => a.publicKey !== account.publicKey)) {
      setCurrentAccount(allAccounts[0]);
    }
  }, [allAccounts, account, setCurrentAccount]);

  return useMemo(() => allAccounts, [allAccounts]);
}

function assertReady(state: AppState): asserts state is ReadyState {
  if (state.status !== WalletStatus.Ready) {
    throw new Error('Temple not ready');
  }
}
