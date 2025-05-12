import React, { FC, useState } from 'react';

import classNames from 'clsx';

import { ReactComponent as CodeAltIcon } from 'app/icons/code-alt.svg';
import { ReactComponent as EyeIcon } from 'app/icons/eye.svg';
import MessageTransactionView from 'app/templates/SignumEncryptMsgView/MessageTransactionView';
import MessageView from 'app/templates/SignumEncryptMsgView/MessageView';
import ViewsSwitcher from 'app/templates/ViewsSwitcher/ViewsSwitcher';
import { T, t } from 'lib/i18n/react';
import { TempleDAppSendEncryptedMessagePayload, useSignumAssetMetadata } from 'lib/temple/front';

type OperationViewProps = {
  payload: TempleDAppSendEncryptedMessagePayload;
};

const EncryptMsgView: FC<OperationViewProps> = ({ payload }) => {
  const { symbol } = useSignumAssetMetadata();

  const SigningViewFormats = [
    {
      key: 'preview',
      name: t('preview'),
      Icon: EyeIcon
    },
    {
      key: 'raw',
      name: t('raw'),
      Icon: CodeAltIcon
    }
  ];

  // const signum = useSignum();
  // const [parsedTransaction, setParsedTransaction] = useState<ParsedTransaction | null>(null);
  // const [jsonTransaction, setJsonTransaction] = useState<object>({});
  const [signViewFormat, setSignViewFormat] = useState(SigningViewFormats[0]);
  // const [error, setError] = useState('');
  // useEffect(() => {
  //   if (!payload) return;
  //   parseSignumTransaction(payload.preview, payload.sourcePkh, signum)
  //     .then(([txParsed, txJson]) => {
  //       setParsedTransaction(txParsed);
  //       setJsonTransaction(txJson);
  //     })
  //     .catch(async err => {
  //       console.error(err);
  //       await withErrorHumanDelay(err, () => {
  //         setError(t('failedToParseTransactionData'));
  //       });
  //     });
  // }, [payload, signum]);
  //
  // const totalSigna = useMemo(() => {
  //   if (!parsedTransaction) return '';
  //
  //   const signa = Amount.fromPlanck(parsedTransaction.fee.toString());
  //   if (parsedTransaction.amount) {
  //     signa.add(Amount.fromPlanck(parsedTransaction.amount.toString()));
  //   }
  //   return signa.getSigna();
  // }, [parsedTransaction]);
  //
  // const handleErrorAlertClose = useCallback(() => setError(''), [setError]);
  //
  // if (!parsedTransaction) return null;
  //
  // if (error) {
  //   return (
  //     <Alert
  //       closable
  //       onClose={handleErrorAlertClose}
  //       type="error"
  //       title="Error"
  //       description={error}
  //       className="my-4"
  //       autoFocus
  //     />
  //   );
  // }

  return (
    <div className="flex flex-col w-full">
      <h2 className="mb-3 leading-tight flex items-center">
        <T id="payloadToSign">
          {message => <span className="mr-2 text-base font-semibold text-gray-700">{message}</span>}
        </T>

        <div className="flex-1" />

        <ViewsSwitcher activeItem={signViewFormat} items={SigningViewFormats} onChange={setSignViewFormat} />
      </h2>

      <div className={classNames(signViewFormat.key !== 'raw' && 'hidden')}>
        <MessageView plainMessage={payload.plainMessage} />
      </div>
      {/*<JsonView*/}
      {/*  jsonObject={jsonTransaction}*/}
      {/*  className={classNames(signViewFormat.key !== 'raw' && 'hidden')}*/}
      {/*  jsonViewStyle={{ height: '11rem', maxHeight: '100%', overflow: 'auto' }}*/}
      {/*/>*/}

      <div className={classNames(signViewFormat.key !== 'preview' && 'hidden')}>
        <MessageTransactionView to={payload.targetPkh} />
        {/*<TransactionView transaction={parsedTransaction} />*/}
      </div>

      <div className="mt-4 leading-tight flex text-base font-semibold text-gray-700 items-center justify-between w-full">
        <span>{t('totalAmount')}</span>
        <span>
          {payload.feeSigna}&nbsp;{symbol}
        </span>
      </div>
    </div>
  );
};

export default EncryptMsgView;
