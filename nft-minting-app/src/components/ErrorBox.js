import React from 'react';

export default function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{ marginTop: 12, fontSize: 13, color: '#b91c1c' }}>
      에러: {message}
    </div>
  );
}


