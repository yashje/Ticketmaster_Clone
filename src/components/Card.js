import { ethers } from 'ethers'

const Card = ({ oneOccasion, toggle, setToggle, setOneOccasion }) => {
  const togglePop = () => {
    setOneOccasion(oneOccasion)
    toggle ? setToggle(false) : setToggle(true)
  }

  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{oneOccasion.date}</strong><br />{oneOccasion.time}
        </p>

        <h3 className='card__name'>
          {oneOccasion.name}
        </h3>

        <p className='card__location'>
          <small>{oneOccasion.location}</small>
        </p>

        <p className='card__cost'>
          <strong>
            {ethers.utils.formatUnits(oneOccasion.cost.toString(), 'ether')}
          </strong>
          ETH
        </p>

        {oneOccasion.tickets.toString() === "0" ? (
          <button
            type="button"
            className='card__button--out'
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className='card__button'
            onClick={() => togglePop()}
          >
            View Seats
          </button>
        )}
      </div>

      <hr />
    </div >
  );
}

export default Card;