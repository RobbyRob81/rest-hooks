'use client';
import { useLive } from '@data-client/react';
import { Formatted } from './Formatted';
import { getTicker } from 'resources/Ticker';

export default function AssetPrice({ symbol }: Props) {
  const productId = `${symbol}-USD`
  // Learn more about Reactive Data Client: https://dataclient.io/docs
  const ticker = useLive(getTicker, { productId });
  return (
    <span>
      {symbol} <Formatted value={ticker.price} formatter="currency" />
    </span>
  );
}

export interface Props {
  symbol: string;
}
