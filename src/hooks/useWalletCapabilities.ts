import { useCapabilities } from 'wagmi';
import { base } from 'wagmi/chains';
import { useMemo } from 'react';

export function useWalletCapabilities() {
  const { data: capabilities } = useCapabilities({ chainId: base.id });

  const supportsBatching = useMemo(() => {
    const atomic = capabilities?.atomic;
    const hasDataSuffix = capabilities?.dataSuffix;
    return (
      atomic?.status === 'ready' ||
      atomic?.status === 'supported' ||
      Boolean(hasDataSuffix)
    );
  }, [capabilities]);

  const supportsPaymaster = useMemo(() => {
    return capabilities?.paymasterService?.supported === true;
  }, [capabilities]);

  return { supportsBatching, supportsPaymaster };
}
