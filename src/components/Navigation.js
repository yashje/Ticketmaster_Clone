import { ethers } from 'ethers'

const Navigation = ({ accounts, setAccounts }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccounts(accounts)
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>tokenmaster</h1>

        <input className='nav__search' type="text" placeholder='Find millions of experiences' />

        <ul className='nav__links'>
          <li><a href="/">Concerts</a></li>
          <li><a href="/">Sports</a></li>
          <li><a href="/">Arts & Theater</a></li>
          <li><a href="/">More</a></li>
        </ul>
      </div>

      {accounts ? (
        <button
          type="button"
          className='nav__connect'
        >
          {`${accounts.slice(0, 5)}...${accounts.slice(36,40)}`}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
}

export default Navigation;