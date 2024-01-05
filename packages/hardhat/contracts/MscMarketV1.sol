// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
contract MscMarketV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
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
    mapping(string id => bool enabled) lockeds;
    mapping(string feature => bool enabled) featureIsEnabled;

    error MscMarket__FeatureDisabled(string featurePoint);
    error MscMarket__PurchaseFailed();
    error MscMarket__InvalidSignature();
    error MscMarket__OrderIsLocked();
    error MscMarket__WithdrawFailed();

    event inscription_msc20_transfer(
      string indexed filter,
      string id,
      address indexed from,
      address indexed to,
      uint256 value
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
      bytes32 message = keccak256(abi.encodePacked(id, tick, maker, amount, price));
      if (!verify(message, r, s, v))
        revert MscMarket__InvalidSignature();
      if (!featureIsEnabled["buy"])
        revert MscMarket__FeatureDisabled("buy");
      if (msg.value < price)
        revert MscMarket__PurchaseFailed();
      if (lockeds[id])
        revert MscMarket__OrderIsLocked();

      lockeds[id] = true;

      (bool success,) = maker.call{ value: price - fee(price) }("");
      if (!success) {
        revert MscMarket__PurchaseFailed();
      }
      emit inscription_msc20_transfer(id, id, msg.sender, maker, price);
    }

    function purchases(OrderStorage[] calldata orders) external payable nonReentrant {
      if (!featureIsEnabled["buy"])
        revert MscMarket__FeatureDisabled("buy");
      for (uint256 i = 0; i < orders.length; i++) {
        if (lockeds[orders[i].id])
          revert MscMarket__OrderIsLocked();
      }

      uint256 total = 0;

      for (uint256 i = 0; i < orders.length; i++) {
        lockeds[orders[i].id] = true;
        total += orders[i].price;
      }

      if (msg.value < total)
        revert MscMarket__PurchaseFailed();
      
      for (uint256 i = 0; i < orders.length; i++) {
        string memory id = orders[i].id;
        uint256 value = orders[i].price;
        address maker = orders[i].maker;
        (bool success, ) = orders[i].maker.call{ value: value - fee(value) }("");
        if (!success)
          revert MscMarket__PurchaseFailed();
        emit inscription_msc20_transfer(id, id, msg.sender, maker, value);
        lockeds[orders[i].id] = true;
      }
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

    function verify(bytes32 message, bytes32 r, bytes32 s, uint8 v) public view returns(bool) {
      bytes32 digest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
      return ecrecover(digest, v, r, s) == verifier;
    }
}
