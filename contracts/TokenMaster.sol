// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TokenMaster is ERC721 {
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    // struct to define type of event
    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    //mapping to create list of the event
    mapping(uint256 => Occasion) occasions;

    //mapping to count the taken seat
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;

    //Array of number seat taken in event
    mapping(uint256 => uint256[]) seatsTaken;

    //to conform a address bought ticket or not
    mapping(uint256 => mapping(address => bool)) public hasBought;

    // modifier to check owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    // this function will create a list of the events
    function event_list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;

        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    // function to create nft
    function mint(uint256 _id, uint256 _seat) public payable {
        require(_id != 0); // to check enter number is not zero
        require(_id <= totalOccasions); // to check entered number is not grater than events
        require(msg.value >= occasions[_id].cost); // to check of send ETH is grater than cost

        occasions[_id].tickets -= 1; // <-- to update the ticket count

        hasBought[_id][msg.sender] = true; // <-- to update the buying status

        seatTaken[_id][_seat] = msg.sender; // <-- to assign seat

        seatsTaken[_id].push(_seat); // <-- update seat currently taken

        totalSupply++;

        _safeMint(msg.sender, totalSupply);
    }

    // function to get event
    function getEvent(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    // function to get all taken seats
    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    // function to withdraw all ETHs from smart contract
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
