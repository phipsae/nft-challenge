// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';

import './ToColor.sol';
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721, Ownable, ERC721Enumerable {

  using Strings for uint256;
  using ToColor for bytes3;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("Loogies", "LOOG") {
    transferOwnership(0xD042799bADfc032db4860b7Ee0fc28371332eBc2);
  }

  struct TokenTraits {
    address owner;
    bytes3 color;
    bytes3 backgroundColor;
    uint256 chubbiness;
    uint256 height;
  }

  mapping (uint256 => TokenTraits) public tokenTraits;

  uint256 mintDeadline = block.timestamp + 100 hours;
  uint256 public NFTPrice = 0.001 ether;
  uint256 public maxSupply = 100;

 function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
{
    return super.supportsInterface(interfaceId);
}


  function mintItem()
      public payable
      returns (uint256)
  {
      require( block.timestamp < mintDeadline, "DONE MINTING");
      require(msg.value == NFTPrice, "not enought ETH");
      require(totalSupply() < maxSupply, "Maxium supply reached");
		NFTPrice += 0.0001 ether ;
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _safeMint(msg.sender, id);

      bytes32 predictableRandom = keccak256(abi.encodePacked( blockhash(block.number-1), msg.sender, address(this), id ));
      bytes32 predictableRandom2 = keccak256(abi.encodePacked( blockhash(block.number+2), msg.sender, address(this), id ));

      TokenTraits memory traits = TokenTraits({
        owner: msg.sender,
        color: bytes2(predictableRandom[0]) | ( bytes2(predictableRandom[1]) >> 8 ) | ( bytes3(predictableRandom[2]) >> 16 ),
        backgroundColor: bytes2(predictableRandom2[0]) | ( bytes2(predictableRandom2[1]) >> 8 ) | ( bytes3(predictableRandom2[2]) >> 16 ),
        chubbiness: 80 + ((70 * uint256(uint8(predictableRandom[3]))) / 255),
        height: 50 + ((20 * uint256(uint8(predictableRandom[3]))) / 255)
      });

      tokenTraits[id] = traits;

      return id;
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
       string memory name = getName(id);
       string memory description = getDescription(id);
       string memory image = getImage(id);

      return buildMetadata(name, description, image);
  }

  function getName(uint256 id) internal view returns (string memory) {
      return string(abi.encodePacked('Bumbly #', id.toString()));
  }

  function getDescription(uint256 id) internal view returns (string memory) {
      return string(abi.encodePacked('This Bumbly has a power of ', (tokenTraits[id].chubbiness * tokenTraits[id].height).toString(), '!!!'));
  }

  function getImage(uint256 id) internal view returns (string memory) {
      return Base64.encode(bytes(generateSVGofTokenById(id)));
  }

  function buildMetadata(string memory name, string memory description, string memory image) internal pure returns (string memory) {
    return string(abi.encodePacked(
        'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
            '{"name":"', name, '", "description":"', description, '", "image": "data:image/svg+xml;base64,', image, '"}'
        )))
    ));
}

  function generateSVGofTokenById(uint256 id) internal view returns (string memory) {

    string memory svg = string(abi.encodePacked(
      '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">',
        renderTokenById(id),
      '</svg>'
    ));

    return svg;
  }

  function renderTokenById(uint256 id) public view returns (string memory) {
    return string(abi.encodePacked(
        renderBackground(id),
        renderLeftEar(id),
        renderRightEar(id),
        renderHead(id),
        renderEyes(),
        renderNose()
    ));
}

function renderBackground(uint256 id) internal view returns (string memory) {
    return string(abi.encodePacked(
        '<rect width="100%" height="100%" fill="#', tokenTraits[id].backgroundColor.toColor(),'"/>'
    ));
}

function renderLeftEar(uint256 id) internal view returns (string memory) {
    return string(abi.encodePacked(
        '<ellipse fill="#', tokenTraits[id].color.toColor(), '" stroke-width="3" cx="130" cy="150" rx="30" ry="40" stroke="#000"/>'
    ));
}

function renderRightEar(uint256 id) internal view returns (string memory) {
    return string(abi.encodePacked(
        '<ellipse fill="#', tokenTraits[id].color.toColor(), '" stroke-width="3" cx="280" cy="150" rx="30" ry="40" stroke="#000"/>'
    ));
}

function renderHead(uint256 id) internal view returns (string memory) {
    return string(abi.encodePacked(
        '<ellipse fill="#', tokenTraits[id].color.toColor(), '" stroke-width="3" cx="204.5" cy="211.8" rx="',
        tokenTraits[id].chubbiness.toString(), '" ry="', tokenTraits[id].height.toString(), '" stroke="#000"/>'
    ));
}

function renderEyes() internal pure returns (string memory) {
    return string(abi.encodePacked(
      // <!-- Left Eye -->
        '<ellipse stroke-width="3" ry="29.5" rx="29.5" cx="181.5" cy="154.5" stroke="#000" fill="#fff"/>',
        '<ellipse ry="3.5" rx="2.5" cx="173.5" cy="154.5" stroke-width="3" stroke="#000" fill="#000000"/>',
      // <!-- Right Eye -->
        '<ellipse stroke-width="3" ry="29.5" rx="29.5" cx="219.5" cy="168.5" stroke="#000" fill="#fff"/>',
        '<ellipse ry="3.5" rx="3" cx="218" cy="169.5" stroke-width="3" fill="#000000" stroke="#000"/>'
        ));
}

function renderNose() internal pure returns (string memory) {
        return string(abi.encodePacked(
        '<ellipse fill="#000000" cx="204.5" cy="230" rx="20" ry="15" />'
        ));
}

function withdraw() public onlyOwner {
		(bool sent, ) = msg.sender.call{value: address(this).balance }("");
        require(sent, "Failed to send Ether");
	}
}
