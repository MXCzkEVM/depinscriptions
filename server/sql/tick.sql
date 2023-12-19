CREATE TABLE `tick` 
(
  `tick` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `amt` bigint NOT NULL DEFAULT '0',
  `max` bigint NOT NULL DEFAULT '0',
  `holder` bigint NOT NULL DEFAULT '0',
  `creator` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_time` int NOT NULL,
  `deploy_time` int NOT NULL,
  `lim` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`tick`)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_general_ci;