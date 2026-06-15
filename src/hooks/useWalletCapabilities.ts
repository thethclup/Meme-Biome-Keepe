import { useCapabilities } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { useMemo } from 'react';

export function useWalletCapabilities() {
  const { data: capabilities } = useCapabilities();

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.[base.id]?.atomic || capabilities?.[baseSepolia.id]?.atomic;
    const hasDataSuffix = capabilities?.[base.id]?.dataSuffix || capabilities?.[baseSepolia.id]?.dataSuffix;
    return (atomic?.status === 'ready' || atomic?.status === 'supported') || hasDataSuffix;
  }, [capabilities]);

  const supportsPaymaster = useMemo(() => {
    return capabilities?.[base.id]?.paymasterService?.supported === true || 
           capabilities?.[baseSepolia.id]?.paymasterService?.supported === true;
  }, [capabilities]);

  return { supportsBatching, supportsPaymaster };
}
