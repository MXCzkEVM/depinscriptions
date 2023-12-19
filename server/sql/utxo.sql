CREATE TABLE `utxo` 
(
  `user_id` int DEFAULT NULL,
  `txid` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `owner` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `index` int NOT NULL,
  `confirmed` tinyint NOT NULL,
  `tick` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vin_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`txid`,`index`) USING BTREE
) 
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_general_ci;