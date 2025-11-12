import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractInfo";
import WalletConnect from "./components/WalletConnect";
import NetworkBadge from "./components/NetworkBadge";
import MintForm from "./components/MintForm";
import TxStatus from "./components/TxStatus";
import ErrorBox from "./components/ErrorBox";
import MetadataModal from "./components/MetadataModal";

function App() {
  const [account, setAccount] = useState(null);
  const [chainOk, setChainOk] = useState(false);
  const [metadataUri, setMetadataUri] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState("");
  const [metaData, setMetaData] = useState(null);

  const isMetamaskAvailable =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  const provider = useMemo(() => {
    if (!isMetamaskAvailable) return null;
    return new ethers.BrowserProvider(window.ethereum);
  }, [isMetamaskAvailable]);

  const connect = useCallback(async () => {
    try {
      if (!provider) throw new Error("MetaMask가 필요합니다.");
      // 권한 요청 → 계정 선택 팝업 유도
      try {
        await provider.send("wallet_requestPermissions", [
          { eth_accounts: {} },
        ]);
      } catch (e) {
        // 권한 요청이 거부되면 eth_requestAccounts로 fallback
      }
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (err) {
      setErrorMsg(err.message ?? String(err));
    }
  }, [provider]);

  const checkChain = useCallback(async () => {
    try {
      if (!provider) return;
      const network = await provider.getNetwork();
      // Sepolia: 11155111
      setChainOk(
        network.chainId === 11155111n || Number(network.chainId) === 11155111
      );
    } catch (err) {
      setErrorMsg(err.message ?? String(err));
    }
  }, [provider]);

  useEffect(() => {
    if (!isMetamaskAvailable) return;
    const handleAccountsChanged = (accs) => {
      setAccount(accs && accs.length ? accs[0] : null);
    };
    const handleChainChanged = () => {
      // 네트워크 변경 시 새로고침 권장
      window.location.reload();
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      if (!window.ethereum) return;
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [isMetamaskAvailable]);

  useEffect(() => {
    checkChain();
  }, [checkChain]);

  const toHttpUrl = useCallback((uri) => {
    if (!uri) return uri;
    if (uri.startsWith("ipfs://")) {
      return uri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
    }
    return uri;
  }, []);

  const mint = useCallback(async () => {
    setErrorMsg("");
    setTxHash("");
    try {
      if (!provider) throw new Error("Provider가 없습니다.");
      if (!account) throw new Error("지갑을 먼저 연결하세요.");
      if (!chainOk) throw new Error("네트워크를 Sepolia로 변경하세요.");
      if (!metadataUri || !metadataUri.startsWith("https://")) {
        throw new Error(
          "메타데이터 URI를 올바르게 입력하세요. (예: https://gateway.pinata.cloud/ipfs/...)"
        );
      }
      setLoading(true);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const tx = await contract.mintNFT(metadataUri);
      const receipt = await tx.wait();
      setTxHash(receipt?.hash ?? tx.hash);
      alert("NFT Minted on Sepolia!");
      try {
        setMetaError("");
        setMetaLoading(true);
        const res = await fetch(toHttpUrl(metadataUri), { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const normalized = { ...json, image: toHttpUrl(json.image) };
        setMetaData(normalized);
      } catch (e) {
        setMetaError(e.message ?? String(e));
        setMetaData(null);
      } finally {
        setMetaLoading(false);
        setModalOpen(true);
      }
    } catch (err) {
      setErrorMsg(err.shortMessage ?? err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [provider, account, chainOk, metadataUri, toHttpUrl]);

  const disconnect = useCallback(() => {
    // MetaMask는 프로그램적 disconnect를 지원하지 않음. 앱 상태를 초기화하여 '로그아웃' UX 제공.
    setAccount(null);
    setTxHash("");
    setErrorMsg("");
  }, []);

  const switchAccount = useCallback(async () => {
    try {
      if (!provider) throw new Error("MetaMask가 필요합니다.");
      // 계정 선택 UI를 강제로 띄우기 위해 권한 요청 후 다시 요청
      await provider.send("wallet_requestPermissions", [{ eth_accounts: {} }]);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0] ?? null);
    } catch (err) {
      setErrorMsg(err.message ?? String(err));
    }
  }, [provider]);

  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 520,
          maxWidth: "92%",
          padding: 24,
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          background: "#ffffff",
          boxShadow: "0 6px 28px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>MyNFT Minting</h2>

        <WalletConnect
          isMetamaskAvailable={isMetamaskAvailable}
          account={account}
          onConnect={connect}
          onDisconnect={disconnect}
          onSwitch={switchAccount}
        />

        <NetworkBadge chainOk={chainOk} />

        <MintForm
          metadataUri={metadataUri}
          setMetadataUri={setMetadataUri}
          onMint={mint}
          loading={loading}
          disabled={!account || !chainOk || loading || !metadataUri}
        />

        <TxStatus txHash={txHash} />
        <ErrorBox message={errorMsg} />
      </div>
      <MetadataModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        loading={metaLoading}
        data={metaData}
        error={metaError}
      />
    </div>
  );
}

export default App;
