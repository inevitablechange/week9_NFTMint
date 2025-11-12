import React from 'react';

export default function MintForm({ metadataUri, setMetadataUri, onMint, disabled, loading }) {
  return (
    <>
      <label style={{ fontSize: 14 }}>메타데이터 URI</label>
      <input
        type="text"
        placeholder="https://gateway.pinata.cloud/ipfs/<메타데이터CID>"
        value={metadataUri}
        onChange={(e) => setMetadataUri(e.target.value)}
        style={{ width: '100%', marginTop: 6, marginBottom: 12, padding: 10, borderRadius: 10, border: '1px solid #d1d5db' }}
      />

      <button
        onClick={onMint}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid #111827',
          background: disabled ? '#9ca3af' : '#111827',
          color: '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '민팅 중...' : 'Mint NFT'}
      </button>
    </>
  );
}


