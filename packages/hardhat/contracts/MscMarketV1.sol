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
        uint96 initialFeeBps
    ) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        administrator = initialOwner;
        feeBps = initialFeeBps;
        featureIsEnabled["buy"] = true;
        featureIsEnabled["withdraw"] = true;
    }

    function _authorizeUpgrade(address) internal override {}

    struct MarketStorage {
      string id;
      address maker;
      uint256 amount;
      uint256 price;
      string tick;
    }

    address private administrator;
    uint96 private feeBps;
    mapping(string id => bool enabled) processing;
    mapping(string feature => bool enabled) featureIsEnabled;

    error MscMarket__FeatureDisabled(string featurePoint);
    error MscMarket__PurchaseFailed();
    error MscMarket__OrderIsProcessing();
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

    function purchase(MarketStorage calldata order) external payable nonReentrant {
        if (!featureIsEnabled["buy"])
          revert MscMarket__FeatureDisabled("buy");
        if (msg.value < order.price)
          revert MscMarket__PurchaseFailed();
        (bool success,) = order.maker.call{ value: order.price - fee(order.price) }("");
        if (!success) {
          revert MscMarket__PurchaseFailed();
        }
        emit inscription_msc20_transfer(order.id, order.id, msg.sender, order.maker, order.price);
    }

    function purchases(MarketStorage[] calldata orders) external payable nonReentrant {
      if (!featureIsEnabled["buy"])
          revert MscMarket__FeatureDisabled("buy");
      for (uint256 i = 0; i < orders.length; i++) {
        if (processing[orders[i].id])
          revert MscMarket__OrderIsProcessing();
      }

      uint256 total = 0;

      for (uint256 i = 0; i < orders.length; i++) {
        processing[orders[i].id] = true;
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
        processing[orders[i].id] = true;
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

    function verify(bytes32 msgHash, bytes memory signature) external view returns(bool) {
      require(signature.length == 65, "invalid signature length");
      bytes32 r;
      bytes32 s;
      uint8 v;
      assembly {
          r := mload(add(signature, 0x20))
          s := mload(add(signature, 0x40))
          v := byte(0, mload(add(signature, 0x60)))
      }
      return ecrecover(msgHash, v, r, s) == administrator;
    }
}
