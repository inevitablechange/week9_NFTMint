## Week9_NFTMINT - 입문자를 위한 가이드

이 저장소는 간단한 ERC-721 NFT를 Sepolia 테스트넷에 배포하고, 웹에서 메타데이터 URI를 입력해 민팅하는 전체 흐름을 연습하기 위한 예제입니다.

구성
- 스마트컨트랙트: `nft-contract-foundry` (Foundry)
- 프론트엔드: `nft-minting-app` (React + ethers v6)

사전 준비물
- Node.js LTS (v18 권장), npm
- MetaMask 브라우저 확장 프로그램
- Sepolia 테스트 ETH (수량 적게도 충분)
- Foundry 설치 (forge, cast)
  - macOS: 
  ```bash
  curl -L https://foundry.paradigm.xyz | bash
  foundryup
  ```

1) 저장소 설치
```bash
git clone <이 저장소 주소>
cd week9_nftmint
```

2) 컨트랙트 빌드/배포 (Sepolia)
- 환경변수에 배포 계정 개인키와 RPC를 지정하세요.
  - PRIVATE_KEY: 배포 지갑의 개인키 (테스트용 지갑 권장)
  - SEPOLIA_RPC_URL: Sepolia RPC (Infura/Alchemy 등 본인 키 포함 URL)
```bash
cd nft-contract-foundry
forge build

export PRIVATE_KEY=0x<배포_개인키>
export SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<INFURA_PROJECT_ID>

forge script script/DeployMyNFT.s.sol:DeployMyNFT \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast --verify -vvvv
```
- 배포 완료 후 출력/브로드캐스트 파일에서 컨트랙트 주소를 확인하세요.
  - 예: `0x4c41af19dddb1ef0a1635bb56a63ce9f3c4392fd`

3) 프론트엔드 설정
- 컨트랙트 주소/ABI는 기본 포함돼 있습니다. 주소가 다르면 `nft-minting-app/src/contractInfo.js`의 `CONTRACT_ADDRESS`를 바꿔주세요.

4) 프론트엔드 실행
```bash
cd ../nft-minting-app
npm install
npm start
```
- 브라우저에서 `http://localhost:3000` 접속
- MetaMask 네트워크를 Sepolia로 전환 후 지갑 연결

5) 민팅 방법
- 메타데이터 URI 입력 후 “Mint NFT” 클릭
- 예: `https://gateway.pinata.cloud/ipfs/<메타데이터CID>`
- 민팅 성공 시 트랜잭션 링크 표시, 그리고 모달에서 메타데이터의 이미지/description이 표시됩니다.

메타데이터 예시(JSON)
```json
{
  "name": "Week9 NFT #1",
  "description": "간단한 예제 NFT",
  "image": "ipfs://<이미지_CID>"
}
```
- Pinata/IPFS에 `metadata.json`, 이미지 파일을 업로드하고 CID를 얻은 뒤, `https://gateway.pinata.cloud/ipfs/<CID>` 형태로 사용하세요.
- 앱은 `ipfs://` 스킴을 자동으로 `https://gateway.pinata.cloud/ipfs/`로 변환해 표시합니다.

RPC 관련 주의사항 (중요)
- 프론트 민팅은 브라우저의 MetaMask가 연결한 RPC를 사용합니다.
- Foundry의 RPC 설정과는 별개이므로, MetaMask 네트워크의 RPC를 본인 키가 포함된 Infura/Alchemy URL로 설정하세요.
  - 예: `https://sepolia.infura.io/v3/<INFURA_PROJECT_ID>`
- Ankr 무료 RPC는 API Key 없이 차단될 수 있습니다. 에러 메시지에 “Unauthorized”가 보이면 MetaMask의 RPC를 교체하세요.

자주 겪는 오류 해결
- “Unauthorized: You must authenticate…”
  - MetaMask 네트워크 RPC가 API Key 없는 Ankr로 설정된 상태입니다. Infura/Alchemy 등으로 교체하세요.
- 민팅 버튼 비활성화
  - 지갑 연결, 네트워크 Sepolia, 올바른 `https://` 메타데이터 URL인지 확인
- React 런타임 에러
  - 본 예제는 React 18 기반입니다. 설치 시 `npm install`로 의존성을 최신으로 정리하세요.

추가 기능
- 상단에서 “계정 변경”, “연결 해제”로 계정 바꾸기/로그아웃 가능
- 민팅 성공 시 모달에서 이미지/description 표시

폴더 구조
```
week9_nftmint/
├─ nft-contract-foundry/   # Foundry 프로젝트
│  ├─ src/MyNFT.sol
│  ├─ script/DeployMyNFT.s.sol
│  └─ out/ ...
└─ nft-minting-app/        # React 프론트엔드
   ├─ src/App.js
   ├─ src/contractInfo.js
   └─ src/components/*     # UI 컴포넌트
```

문의/확장 아이디어
- 모달에 토큰 ID, Etherscan 링크, 소유자 주소까지 표시
- 이미지 미리보기/메타데이터 업로더(핀 업로드) 추가
- 네트워크 스위처 버튼(자동 전환) 추가

행운을 빕니다! Sepolia에서 안전하게 테스트하세요. 🎉


