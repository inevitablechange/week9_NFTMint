import React from "react";

export default function WalletConnect({
  isMetamaskAvailable,
  account,
  onConnect,
  onDisconnect,
  onSwitch,
}) {
  return (
    <div style={{ marginBottom: 12, fontSize: 14 }}>
      {isMetamaskAvailable ? (
        account ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span>
              연결됨: {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={onSwitch}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #111827",
                background: "#fff",
                color: "#111827",
              }}
            >
              계정 변경
            </button>
            <button
              onClick={onDisconnect}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #ef4444",
                background: "#ef4444",
                color: "#fff",
              }}
            >
              연결 해제
            </button>
          </div>
        ) : (
          <button
            onClick={onConnect}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
            }}
          >
            지갑 연결
          </button>
        )
      ) : (
        <span>MetaMask를 설치해주세요.</span>
      )}
    </div>
  );
}
