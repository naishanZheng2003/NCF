import React, { FC, useCallback, useEffect, useRef } from 'react';

import { useForm } from 'react-hook-form';

import FormField from 'app/atoms/FormField';
import FormSubmitButton from 'app/atoms/FormSubmitButton';
import AccountBanner from 'app/templates/AccountBanner';
import { T, t } from 'lib/i18n/react';
import { useTempleClient, useRelevantAccounts, useAccount } from 'lib/temple/front';
import { withErrorHumanDelay } from 'lib/ui/humanDelay';
import { navigate } from 'lib/woozie';

const SUBMIT_ERROR_TYPE = 'submit-error';

type FormData = {
  password: string;
};

const RemoveAccount: FC = () => {
  const { removeAccount } = useTempleClient();
  const allAccounts = useRelevantAccounts();
  const account = useAccount();

  const prevAccLengthRef = useRef(allAccounts.length);
  useEffect(() => {
    const accLength = allAccounts.length;
    if (prevAccLengthRef.current > accLength) {
      navigate('/');
    }
    prevAccLengthRef.current = accLength;
  }, [allAccounts]);

  const { register, handleSubmit, errors, setError, clearError, formState } = useForm<FormData>();
  const submitting = formState.isSubmitting;

  const onSubmit = useCallback(
    async ({ password }) => {
      if (submitting) return;
      clearError('password');
      try {
        await removeAccount(account.publicKey, password);
      } catch (err: any) {
        console.error(err);
        await withErrorHumanDelay(err, () => {
          setError('password', SUBMIT_ERROR_TYPE, err.message);
        });
      }
    },
    [submitting, clearError, setError, removeAccount, account.publicKey]
  );

  return (
    <div className="w-full max-w-sm p-2 mx-auto">
      <AccountBanner
        account={account}
        label={t('accountToBeRemoved')}
        labelDescription={t('ifYouWantToRemoveAnotherAccount')}
        className="mb-6"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormField
          ref={register({ required: t('required') })}
          label={t('password')}
          labelDescription={t('enterPasswordToRemoveAccount')}
          id="removeacc-secret-password"
          type="password"
          name="password"
          placeholder="********"
          errorCaption={errors.password?.message}
          containerClassName="mb-4"
        />

        <T id="remove">
          {message => (
            <FormSubmitButton loading={submitting} disabled={submitting}>
              {message}
            </FormSubmitButton>
          )}
        </T>
      </form>
    </div>
  );
};

export default RemoveAccount;
