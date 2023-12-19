CREATE TABLE block (
  id INT AUTO_INCREMENT PRIMARY KEY,
  block_id INT NOT NULL,
  block_number int NOT NULL,
  block_hash varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  block_data text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
);
