import { useAccount } from '@starknet-react/core';
import { useEffect, useState } from 'react';

// Safe wrapper for useAccount hook to prevent undefined array access errors
export const useSafeAccount = () => {
  const accountData = useAccount();
  const [safeAccount, setSafeAccount] = useState({
    address: undefined as string | undefined,
    isConnected: false,
    status: 'disconnected' as any,
    chainId: undefined as bigint | undefined
  });

  useEffect(() => {
    try {
      // Safely extract account data with proper checks
      const { address, isConnected, status, chainId } = accountData || {};
      
      setSafeAccount({
        address: address || undefined,
        isConnected: Boolean(isConnected),
        status: status || 'disconnected',
        chainId: chainId || undefined
      });
    } catch (error) {
      console.warn('Safe account hook caught error:', error);
      // Reset to safe defaults on error
      setSafeAccount({
        address: undefined,
        isConnected: false,
        status: 'disconnected',
        chainId: undefined
      });
    }
  }, [accountData]);

  return safeAccount;
};