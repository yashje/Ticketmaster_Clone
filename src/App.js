import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TokenMasterABI from './abis/TokenMaster.json'

// Config
import config from './config.json'

function App() {
  const [accounts, setAccounts] = useState(null);
  const [provider, setProvider] = useState(null);
  const [tokenMaster, setTokenMaster] = useState(null);
  const [allOccasion, setAllOccasion] = useState([]);
  const [oneOccasion, setOneOccasion] = useState({});
  const [toggle, setToggle] = useState(false);


  useEffect(() => {
    const requestAccounts = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Retrieve the current network details from the provider (e.g., Ethereum, Rinkeby).
      const network = await provider.getNetwork();

      // Get the contract address for the TokenMaster contract from the config object using the chain ID of the current network.
      const address = config[network.chainId].TokenMaster.address;

      // Create a new instance of the TokenMaster contract using the contract address, ABI, and the provider for interacting with the contract on the blockchain.
      const tokenmaster = new ethers.Contract(address, TokenMasterABI, provider);
      setTokenMaster(tokenmaster);

      const totalOccasions = await tokenmaster.totalOccasions();

      const occasions = [];
      for (let i = 1; i <= totalOccasions.toNumber(); i++) {
        const occasion = await tokenmaster.getEvent(i);
        occasions.push(occasion);
      }

      setAllOccasion(occasions);
      console.log(occasions);

      // Listen for changes in the connected accounts
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccounts(account);
      });
    };

    requestAccounts(); // Request accounts when the component mounts
  }, []); // Empty dependency array means this effect runs only once

  return (
    <div>
      <header>
        <Navigation accounts={accounts} setAccounts={setAccounts} />
        <h2 className="header__title"><strong>Event</strong>Tickets</h2>
      </header>
      <Sort />
      <div>
        {allOccasion.length > 0 ? allOccasion.map((oneOccasion, index) => (
          <Card
            oneOccasion={oneOccasion}
            tokenMaster={tokenMaster}
            provider={provider}
            accounts={accounts}
            toggle={toggle}
            setToggle={setToggle}
            setOneOccasion={setOneOccasion}
            key={index} />
        )) : <p>Loading events...</p>}
      </div>

      {toggle && <SeatChart
        oneOccasion={oneOccasion}
        tokenMaster={tokenMaster}
        provider={provider}
        setToggle={setToggle}
      />}

    </div>
  );
}

export default App;

