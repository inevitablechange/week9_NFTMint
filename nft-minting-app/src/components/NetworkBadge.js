import React from 'react';

export default function NetworkBadge({ chainOk }) {
  return (
    <div style={{ marginBottom: 8, fontSize: 13, color: chainOk ? '#059669' : '#b91c1c' }}>
      네트워크: {chainOk ? 'Sepolia' : 'Sepolia 아님'}
    </div>
  );
}


