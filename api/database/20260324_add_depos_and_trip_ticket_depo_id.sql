-- Creates Depo master table and links trip_ticket to it.

CREATE TABLE IF NOT EXISTS `depos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `location` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_depos_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `trip_ticket`
  ADD COLUMN IF NOT EXISTS `depo_id` INT NULL AFTER `remarks`;

SET @index_exists := (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'trip_ticket'
    AND index_name = 'idx_trip_ticket_depo_id'
);
SET @sql_index := IF(
  @index_exists = 0,
  'ALTER TABLE `trip_ticket` ADD INDEX `idx_trip_ticket_depo_id` (`depo_id`)',
  'SELECT 1'
);
PREPARE stmt_index FROM @sql_index;
EXECUTE stmt_index;
DEALLOCATE PREPARE stmt_index;

SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.table_constraints
  WHERE constraint_schema = DATABASE()
    AND table_name = 'trip_ticket'
    AND constraint_name = 'fk_trip_ticket_depo_id'
    AND constraint_type = 'FOREIGN KEY'
);
SET @sql_fk := IF(
  @fk_exists = 0,
  'ALTER TABLE `trip_ticket` ADD CONSTRAINT `fk_trip_ticket_depo_id` FOREIGN KEY (`depo_id`) REFERENCES `depos`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT',
  'SELECT 1'
);
PREPARE stmt_fk FROM @sql_fk;
EXECUTE stmt_fk;
DEALLOCATE PREPARE stmt_fk;
