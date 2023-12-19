CREATE TABLE `user_transfer` 
(
  `from` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `to` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `vins` text COLLATE utf8mb4_general_ci NOT NULL,
  `vouts` text COLLATE utf8mb4_general_ci NOT NULL,
  `hash` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tick` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `block_number` int DEFAULT NULL,
  `time` int DEFAULT NULL,
  PRIMARY KEY (`hash`)
) 
ENGINE = InnoDB 
DEFAULT CHARSET = utf8mb4 
COLLATE = utf8mb4_general_ci;