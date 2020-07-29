import React from 'react';
import logo from './logo.svg';
import { ethers } from "ethers";
import './App.css';
import cryptoRegAbi from './cryptoRegAbi';
import cryptoResAbi from './cryptoResAbi';

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const regContract = new ethers.Contract('0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe', cryptoRegAbi, signer);

function App() {

  const [currentEthAddress, setCurrentEthAddress] = React.useState('');
  const [domainName, setDomainName] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [tokenId, setTokenId] = React.useState('');
  const [ethAddress, setEthAddress] = React.useState('');
  const [btcAddress, setBtcAddress] = React.useState('');
  const [ltcAddress, setLtcAddress] = React.useState('');
  const [showManage, setShowManage] = React.useState(false);
  const [manageDomain, setManageDomain] = React.useState('');
  const [resAddress, setResAddress] = React.useState('');

  const handleDomainSubmit = async () => {
    setCurrentEthAddress(window.ethereum.selectedAddress.toUpperCase());
    const tokenId = ethers.utils.namehash(domainName + ".crypto");
    const owner = (await regContract.ownerOf(tokenId)).toUpperCase();
    const resolverAddress = await regContract.resolverOf(tokenId);
    const resContract = new ethers.Contract(resolverAddress, cryptoResAbi, signer);
    const records = await resContract.getMany(['crypto.ETH.address', 'crypto.BTC.address', 'crypto.LTC.address'], tokenId);
    setOwner(owner);
    setResAddress(resolverAddress);
    setTokenId(tokenId);
    setEthAddress(records[0] || '');
    setBtcAddress(records[1] || '');
    setLtcAddress(records[2] || '');
    setManageDomain(domainName + ".crypto");
    setShowManage(true);
  }

  const handleUpdateRecords = async () => {
    const resContract = new ethers.Contract(resAddress, cryptoResAbi, signer);
    // resContract.set('crypto.ETH.address', ethAddress, tokenId);
    // resContract.set('crypto.BTC.address', btcAddress, tokenId);
    // resContract.set('crypto.LTC.address', ltcAddress, tokenId);
    resContract.setMany(
      ['crypto.ETH.address', 'crypto.BTC.address', 'crypto.LTC.address'],
      [ethAddress, btcAddress, ltcAddress],
      tokenId
    );
  }

  return (
    <div className="App">
      <div className="appHeader">.Crypto Management</div>
      <div className="domainForm">
        <input 
          className="domainInput"
          placeholder="Enter your .crypto domain"
          onChange={(e) => setDomainName(e.target.value)}
          value={domainName}
        ></input>
        <div
          className="domainInputSubmit"
          onClick={handleDomainSubmit}
        >Manage Domain</div>
      </div>

      {showManage && (
        <div className="domainManage">
          <div className="domainName">{manageDomain}</div>
          <div className="domainAddresses">
            <div className="address">
              <div className="addressType">ETH</div>
              <input 
                className="addressValue"
                value={ethAddress}
                onChange={(e) => setEthAddress(e.target.value)}
                readOnly={owner !== currentEthAddress}
              ></input>
            </div>
            <div className="address">
              <div className="addressType">BTC</div>
              <input 
                className="addressValue"
                value={btcAddress}
                onChange={(e) => setBtcAddress(e.target.value)}
                readOnly={owner !== currentEthAddress}
              ></input>
            </div>
            <div className="address">
              <div className="addressType">LTC</div>
              <input 
                className="addressValue"
                value={ltcAddress}
                onChange={(e) => setLtcAddress(e.target.value)}
                readOnly={owner !== currentEthAddress}
              ></input>
            </div>
          </div>
          {(owner === currentEthAddress) && (
            <div className="updateBtn"
              onClick={handleUpdateRecords}
            >Update Records</div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
