import React, { useCallback, useMemo } from 'react';

import classNames from 'clsx';

import Name from 'app/atoms/Name';
import SubTitle from 'app/atoms/SubTitle';
import { ReactComponent as CloseIcon } from 'app/icons/close.svg';
import { t, T } from 'lib/i18n/react';
import { useContacts, Contact } from 'lib/temple/front';
import { useFilteredContacts } from 'lib/temple/front/use-filtered-contacts.hook';
import { useConfirm } from 'lib/ui/dialog';

import IdenticonSignum from '../../../atoms/IdenticonSignum';
import CustomSelect, { OptionRenderProps } from '../../CustomSelect';
import HashChip from '../../HashChip';
import AddNewContactForm from './AddNewContactForm';

type ContactActions = {
  remove: (address: string) => void;
};

const AddressBook: React.FC = () => {
  const { removeContact } = useContacts();
  const { allContacts } = useFilteredContacts();
  const confirm = useConfirm();

  const handleRemoveContactClick = useCallback(
    async (accountId: string) => {
      if (
        !(await confirm({
          title: t('actionConfirmation'),
          children: t('deleteContactConfirm')
        }))
      ) {
        return;
      }

      await removeContact(accountId);
    },
    [confirm, removeContact]
  );

  const contactActions = useMemo<ContactActions>(
    () => ({
      remove: handleRemoveContactClick
    }),
    [handleRemoveContactClick]
  );

  return (
    <div className="w-full max-w-sm p-2 pb-4 mx-auto">
      <SubTitle className="mb-4">
        <T id="addNewContact" />
      </SubTitle>

      <AddNewContactForm className="mb-8" />

      <div className="mb-4 flex flex-col">
        <span className="text-base font-semibold text-gray-700">
          <T id="currentContacts" />
        </span>

        <span className={classNames('mt-1', 'text-xs font-light text-gray-600')} style={{ maxWidth: '90%' }}>
          <T id="updateContactDescription" />
        </span>
      </div>

      <CustomSelect
        actions={contactActions}
        className="mb-6"
        getItemId={getContactKey}
        items={allContacts}
        OptionIcon={ContactIcon}
        OptionContent={ContactContent}
        light
        hoverable={false}
      />
    </div>
  );
};

export default AddressBook;

const ContactIcon: React.FC<OptionRenderProps<Contact, string, ContactActions>> = ({ item }) => (
  <IdenticonSignum address={item.accountId} size={32} className="flex-shrink-0 shadow-xs" />
);

const ContactContent: React.FC<OptionRenderProps<Contact, string, ContactActions>> = ({ item, actions }) => (
  <div className="flex flex-1 w-full">
    <div className="flex flex-col justify-between flex-1">
      <Name className="mb-px text-sm font-medium leading-tight text-left">{item.name}</Name>

      <div className="text-xs font-light leading-tight text-gray-600">
        <HashChip hash={item.accountId} isAccount small />
      </div>
    </div>

    {item.accountInWallet ? (
      <div className="flex items-center">
        <span
          className={classNames(
            'mx-1',
            'rounded-sm',
            'border border-opacity-25',
            'px-1 py-px',
            'leading-tight',
            'text-opacity-50',
            'border-black text-black'
          )}
          style={{ fontSize: '0.6rem' }}
        >
          <T id="ownAccount" />
        </span>
      </div>
    ) : (
      <button
        className={classNames(
          'flex-none p-2',
          'text-gray-500 hover:text-gray-600',
          'transition ease-in-out duration-200'
        )}
        onClick={evt => {
          evt.stopPropagation();
          actions?.remove(item.accountId);
        }}
      >
        <CloseIcon className="w-auto h-5 stroke-current stroke-2" title={t('delete')} />
      </button>
    )}
  </div>
);

function getContactKey(contact: Contact) {
  return contact.accountId;
}
