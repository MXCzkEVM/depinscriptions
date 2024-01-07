// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
contract MSC20Market is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        address initialVerifier,
        uint96 initialFeeBps
    ) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        administrator = initialOwner;
        verifier = initialVerifier;
        feeBps = initialFeeBps;
        featureIsEnabled["buy"] = true;
        featureIsEnabled["withdraw"] = true;
    }

    function _authorizeUpgrade(address) internal override {}

    struct OrderStorage {
      string id;
      string tick;
      address maker;
      uint256 amount;
      uint256 price;
      bytes32 r;
      bytes32 s;
      uint8 v;
    }

    address private administrator;
    address private verifier;
    uint96 private feeBps;
    mapping(string id => bool enabled) filleds;
    mapping(string feature => bool enabled) featureIsEnabled;

    error MscMarket__FeatureDisabled(string featurePoint);
    error MscMarket__PurchaseFailed();
    error MscMarket__InvalidSignature();
    error MscMarket__OrderIsLocked();
    error MscMarket__WithdrawFailed();
    error MscMarket__NoOrdersMatched();
    error MscMarket__ETHTransferFailed();

    event inscription_msc20_transferForListing(
      string indexed filterId,
      address indexed buyer,
      address indexed maker,
      string id
    );

    fallback() external payable {}

    receive() external payable {}

    function purchase(
      string memory id,
      string memory tick,
      address maker,
      uint256 amount,
      uint256 price,
      bytes32 r,
      bytes32 s,
      uint8 v
    ) external payable nonReentrant {
      if (!featureIsEnabled["buy"])
        revert MscMarket__FeatureDisabled("buy");
      if (msg.value < price)
        revert MscMarket__PurchaseFailed();
      _purchase(id, tick, maker, amount, price, r, s, v);
    }

    function purchases(OrderStorage[] calldata orders) external payable nonReentrant {
      if (!featureIsEnabled["buy"])
        revert MscMarket__FeatureDisabled("buy");
   
      uint256 balance = msg.value;
      uint16 matched = 0;

      for (uint256 i = 0; i < orders.length; i++) {
        // Don't throw error
        if (filleds[orders[i].id])
          continue;

        require(balance >= orders[i].price, "Insufficient balance");
        balance -= orders[i].price;

        _purchase(
          orders[i].id, 
          orders[i].tick, 
          orders[i].maker,
          orders[i].amount, 
          orders[i].price, 
          orders[i].r,
          orders[i].s, 
          orders[i].v
        );
        matched++;
      }
      if (matched == 0)
        revert MscMarket__NoOrdersMatched();
      // refund balance
      if (balance >  0)
        _transferETH(msg.sender, balance);
    }

    function withdraw() external onlyOwner {
      if (!featureIsEnabled["withdraw"])
        revert MscMarket__FeatureDisabled("withdraw");
      (bool success,) = administrator.call{ value: address(this).balance }("");
       if (!success)
        revert MscMarket__WithdrawFailed();
    }

    function fee(uint256 price) public view returns (uint256) {
      return (price * uint256(feeBps)) / 100;
    }

    function _verify(bytes32 message, bytes32 r, bytes32 s, uint8 v) internal view {
      bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
      if (ecrecover(digest, v, r, s) != verifier)
        revert MscMarket__InvalidSignature();
    }

    function _purchase(
      string memory id,
      string memory tick,
      address maker,
      uint256 amount,
      uint256 price,
      bytes32 r,
      bytes32 s,
      uint8 v
    ) internal {
      if (filleds[id])
        revert MscMarket__OrderIsLocked();

      _verify(keccak256(abi.encodePacked(id, tick, maker, amount, price)), r, s, v);

      // Verify the recipient is not address(0)
      require(msg.sender != address(0), "invalid recipient");

      filleds[id] = true;

      _transferETH(maker, price - fee(price));

      emit inscription_msc20_transferForListing(id, msg.sender, maker, id);
    }

    function _transferETH(address to, uint256 amount) internal {
      (bool sent,) = to.call{ value: amount }("");
      if (!sent)
        revert MscMarket__ETHTransferFailed();
    }
}
