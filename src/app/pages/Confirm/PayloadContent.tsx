import React, { FC, memo, useMemo } from 'react';

import classNames from 'clsx';

import AccountTypeBadge from 'app/atoms/AccountTypeBadge';
import HashShortView from 'app/atoms/HashShortView';
import Name from 'app/atoms/Name';
import { OptionRenderProps } from 'app/templates/CustomSelect';
import NostrSignView from 'app/templates/NostrSignView/NostrSignView';
import EncryptMsgView from 'app/templates/SignumEncryptMsgView/EncryptMsgView';
import SignView from 'app/templates/SignumSignView/SignView';
import { T } from 'lib/i18n/react';
import { XTAccount, TempleDAppPayload } from 'lib/messaging';
import { useRelevantAccounts } from 'lib/temple/front';

import IdenticonSignum from '../../atoms/IdenticonSignum';

const AccountIcon: FC<OptionRenderProps<XTAccount>> = ({ item }) => (
  <IdenticonSignum address={item.publicKey} size={32} className="flex-shrink-0 shadow-xs" />
);

const AccountOptionContentHOC = () => {
  return memo<OptionRenderProps<XTAccount>>(({ item: acc }) => (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center">
        <Name className="text-sm font-medium leading-tight">{acc.name}</Name>
        <AccountTypeBadge account={acc} />
      </div>

      <div className="flex flex-wrap items-center mt-1">
        <div className={classNames('text-xs leading-none', 'text-gray-700')}>
          <HashShortView hash={acc.publicKey} isAccount />
        </div>
      </div>
    </div>
  ));
};

interface PayloadContentProps {
  accountPkhToConnect: string;
  payload: TempleDAppPayload;
}

const PayloadContent: React.FC<PayloadContentProps> = ({ accountPkhToConnect, payload }) => {
  const allAccounts = useRelevantAccounts();
  const AccountOptionContent = useMemo(() => AccountOptionContentHOC(), []);
  const currentAccount = useMemo(
    () => allAccounts.find((a: XTAccount) => a.publicKey === accountPkhToConnect),
    [allAccounts, accountPkhToConnect]
  );

  if (payload.type === 'connect') {
    return (
      <div className={classNames('mt-4 p-2', 'w-full', 'flex flex-col', 'border rounded border-gray-200')}>
        <h2 className={classNames('leading-tight', 'flex flex-col')}>
          <T id="currentAccount">
            {message => <span className="text-base font-semibold text-gray-700">{message}</span>}
          </T>
          <div className="my-4 flex flex-row">
            <AccountIcon item={currentAccount!} index={1} />
            <span className="mr-2" />
            <AccountOptionContent item={currentAccount!} index={1} />
          </div>

          <T id="confirmConnectionHint">
            {message => <p className="mb-4 text-xs font-light text-center text-gray-700">{message}</p>}
          </T>
        </h2>
      </div>
    );
  }
  if (payload.type === 'sign') {
    return <SignView payload={payload} />;
  }

  if (payload.type === 'signNostr') {
    return <NostrSignView payload={payload} />;
  }

  if (payload.type === 'sendEncryptedMsg') {
    return <EncryptMsgView payload={payload} />;
  }

  return null;
};

export default PayloadContent;
