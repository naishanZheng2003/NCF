import React, { memo } from 'react';

import { Address } from '@signumjs/core';

import { useSignumAccountPrefix } from 'lib/temple/front';

type HashShortViewProps = {
  hash: string;
  isAccount?: boolean;
  trim?: boolean;
  trimAfter?: number;
  firstCharsCount?: number;
  lastCharsCount?: number;
  delimiter?: string;
};

const HashShortView = memo<HashShortViewProps>(
  ({
    hash,
    isAccount = false,
    trim = true,
    trimAfter = 32,
    firstCharsCount = 7,
    lastCharsCount = 4,
    delimiter = '…'
  }) => {
    const prefix = useSignumAccountPrefix();
    if (!hash) return null;

    const trimmedHash = (() => {
      let address = hash;
      try {
        address = isAccount ? Address.create(hash, prefix).getReedSolomonAddress() : hash;
      } catch (e) {
        // no op as no valid Signum Address
      }
      if (!trim) return address;
      const ln = address.length;
      return ln > trimAfter ? (
        <>
          {address.slice(0, firstCharsCount)}
          <span className="opacity-75">{delimiter}</span>
          {address.slice(ln - lastCharsCount, ln)}
        </>
      ) : (
        address
      );
    })();

    return <>{trimmedHash}</>;
  }
);

export default HashShortView;
