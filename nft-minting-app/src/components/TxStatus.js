import React from 'react';

export default function TxStatus({ txHash }) {
  if (!txHash) return null;
  return (
    <div style={{ marginTop: 12, fontSize: 13 }}>
      트랜잭션: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer">{txHash.slice(0, 10)}...</a>
    </div>
  );
}


