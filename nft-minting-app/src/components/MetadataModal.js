import React from 'react';

export default function MetadataModal({ open, onClose, loading, data, error }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      zIndex: 1000
    }}>
      <div style={{
        width: 560,
        maxWidth: '95%',
        borderRadius: 14,
        background: '#fff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>NFT Minted</h3>
          <button onClick={onClose} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff' }}>
            닫기
          </button>
        </div>
        <div style={{ padding: 16 }}>
          {loading ? (
            <div style={{ padding: 20 }}>메타데이터 로딩 중...</div>
          ) : error ? (
            <div style={{ color: '#b91c1c' }}>메타데이터 로드 실패: {error}</div>
          ) : data ? (
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
              <div>
                {data.image ? (
                  <img src={data.image} alt={data.name ?? 'nft'} style={{ width: '100%', borderRadius: 12, border: '1px solid #e5e7eb' }} />
                ) : (
                  <div style={{ width: '100%', height: 160, background: '#f3f4f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    No Image
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{data.name ?? 'Untitled'}</div>
                <div style={{ whiteSpace: 'pre-wrap', color: '#374151' }}>{data.description ?? 'No description'}</div>
                {data.external_url ? (
                  <div style={{ marginTop: 8 }}>
                    <a href={data.external_url} target="_blank" rel="noreferrer">external_url</a>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div>표시할 데이터가 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}


