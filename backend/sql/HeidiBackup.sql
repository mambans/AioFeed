-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.18 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for information_schema
CREATE DATABASE IF NOT EXISTS `information_schema` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `information_schema`;

-- Dumping structure for table information_schema.CHARACTER_SETS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`CHARACTER_SETS` AS select `cs`.`name` AS `CHARACTER_SET_NAME`,`col`.`name` AS `DEFAULT_COLLATE_NAME`,`cs`.`comment` AS `DESCRIPTION`,`cs`.`mb_max_length` AS `MAXLEN` from (`mysql`.`character_sets` `cs` join `mysql`.`collations` `col` on((`cs`.`default_collation_id` = `col`.`id`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.CHECK_CONSTRAINTS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`CHECK_CONSTRAINTS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_SCHEMA`,`cc`.`name` AS `CONSTRAINT_NAME`,`cc`.`check_clause_utf8` AS `CHECK_CLAUSE` from (((`mysql`.`check_constraints` `cc` join `mysql`.`tables` `tbl` on((`cc`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.COLLATIONS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`COLLATIONS` AS select `col`.`name` AS `COLLATION_NAME`,`cs`.`name` AS `CHARACTER_SET_NAME`,`col`.`id` AS `ID`,if(exists(select 1 from `mysql`.`character_sets` where (`mysql`.`character_sets`.`default_collation_id` = `col`.`id`)),'Yes','') AS `IS_DEFAULT`,if(`col`.`is_compiled`,'Yes','') AS `IS_COMPILED`,`col`.`sort_length` AS `SORTLEN`,`col`.`pad_attribute` AS `PAD_ATTRIBUTE` from (`mysql`.`collations` `col` join `mysql`.`character_sets` `cs` on((`col`.`character_set_id` = `cs`.`id`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.COLLATION_CHARACTER_SET_APPLICABILITY
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`COLLATION_CHARACTER_SET_APPLICABILITY` AS select `col`.`name` AS `COLLATION_NAME`,`cs`.`name` AS `CHARACTER_SET_NAME` from (`mysql`.`character_sets` `cs` join `mysql`.`collations` `col` on((`cs`.`id` = `col`.`character_set_id`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.COLUMNS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`COLUMNS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `TABLE_IF NOT EXISTS CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,(`col`.`name` collate utf8_tolower_ci) AS `COLUMN_NAME`,`col`.`ordinal_position` AS `ORDINAL_POSITION`,`col`.`default_value_utf8` AS `COLUMN_DEFAULT`,if((`col`.`is_nullable` = 1),'YES','NO') AS `IS_NULLABLE`,substring_index(substring_index(`col`.`column_type_utf8`,'(',1),' ',1) AS `DATA_TYPE`,internal_dd_char_length(`col`.`type`,`col`.`char_length`,`coll`.`name`,0) AS `CHARACTER_MAXIMUM_LENGTH`,internal_dd_char_length(`col`.`type`,`col`.`char_length`,`coll`.`name`,1) AS `CHARACTER_OCTET_LENGTH`,if((`col`.`numeric_precision` = 0),NULL,`col`.`numeric_precision`) AS `NUMERIC_PRECISION`,if(((`col`.`numeric_scale` = 0) and (`col`.`numeric_precision` = 0)),NULL,`col`.`numeric_scale`) AS `NUMERIC_SCALE`,`col`.`datetime_precision` AS `DATETIME_PRECISION`,(case `col`.`type` when 'MYSQL_TYPE_STRING' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_VAR_STRING' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_VARCHAR' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_TINY_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_MEDIUM_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_LONG_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_ENUM' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_SET' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) else NULL end) AS `CHARACTER_SET_NAME`,(case `col`.`type` when 'MYSQL_TYPE_STRING' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_VAR_STRING' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_VARCHAR' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_TINY_BLOB' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_MEDIUM_BLOB' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_BLOB' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_LONG_BLOB' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_ENUM' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) when 'MYSQL_TYPE_SET' then if((`cs`.`name` = 'binary'),NULL,`coll`.`name`) else NULL end) AS `COLLATION_NAME`,`col`.`column_type_utf8` AS `COLUMN_TYPE`,`col`.`column_key` AS `COLUMN_KEY`,internal_get_dd_column_extra((`col`.`generation_expression_utf8` is null),`col`.`is_virtual`,`col`.`is_auto_increment`,`col`.`update_option`,if(length(`col`.`default_option`),true,false),`col`.`options`) AS `EXTRA`,get_dd_column_privileges(`sch`.`name`,`tbl`.`name`,`col`.`name`) AS `PRIVILEGES`,ifnull(`col`.`comment`,'') AS `COLUMN_COMMENT`,ifnull(`col`.`generation_expression_utf8`,'') AS `GENERATION_EXPRESSION`,`col`.`srs_id` AS `SRS_ID` from (((((`mysql`.`columns` `col` join `mysql`.`tables` `tbl` on((`col`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `coll` on((`col`.`collation_id` = `coll`.`id`))) join `mysql`.`character_sets` `cs` on((`coll`.`character_set_id` = `cs`.`id`))) where ((0 <> internal_get_view_warning_or_error(`sch`.`name`,`tbl`.`name`,`tbl`.`type`,`tbl`.`options`)) and (0 <> can_access_column(`sch`.`name`,`tbl`.`name`,`col`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`,(`col`.`hidden` <> 'Visible'))));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.COLUMN_PRIVILEGES
CREATE TEMPORARY TABLE IF NOT EXISTS `COLUMN_PRIVILEGES` (
  `GRANTEE` varchar(292) NOT NULL DEFAULT '',
  `TABLE_CATALOG` varchar(512) NOT NULL DEFAULT '',
  `TABLE_SCHEMA` varchar(64) NOT NULL DEFAULT '',
  `TABLE_NAME` varchar(64) NOT NULL DEFAULT '',
  `COLUMN_NAME` varchar(64) NOT NULL DEFAULT '',
  `PRIVILEGE_TYPE` varchar(64) NOT NULL DEFAULT '',
  `IS_GRANTABLE` varchar(3) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.COLUMN_STATISTICS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`COLUMN_STATISTICS` AS select `mysql`.`column_statistics`.`schema_name` AS `SCHEMA_NAME`,`mysql`.`column_statistics`.`table_name` AS `TABLE_IF NOT EXISTS NAME`,`mysql`.`column_statistics`.`column_name` AS `COLUMN_NAME`,`mysql`.`column_statistics`.`histogram` AS `HISTOGRAM` from `mysql`.`column_statistics` where (0 <> can_access_table(`mysql`.`column_statistics`.`schema_name`,`mysql`.`column_statistics`.`table_name`));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.ENGINES
CREATE TEMPORARY TABLE IF NOT EXISTS `ENGINES` (
  `ENGINE` varchar(64) NOT NULL DEFAULT '',
  `SUPPORT` varchar(8) NOT NULL DEFAULT '',
  `COMMENT` varchar(80) NOT NULL DEFAULT '',
  `TRANSACTIONS` varchar(3) DEFAULT NULL,
  `XA` varchar(3) DEFAULT NULL,
  `SAVEPOINTS` varchar(3) DEFAULT NULL
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.EVENTS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`EVENTS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `EVENT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `EVENT_SCHEMA`,`evt`.`name` AS `EVENT_NAME`,`evt`.`definer` AS `DEFINER`,`evt`.`time_zone` AS `TIME_ZONE`,'SQL' AS `EVENT_BODY`,`evt`.`definition_utf8` AS `EVENT_DEFINITION`,if((`evt`.`interval_value` is null),'ONE TIME','RECURRING') AS `EVENT_TYPE`,convert_tz(`evt`.`execute_at`,'+00:00',`evt`.`time_zone`) AS `EXECUTE_AT`,convert_interval_to_user_interval(`evt`.`interval_value`,`evt`.`interval_field`) AS `INTERVAL_VALUE`,`evt`.`interval_field` AS `INTERVAL_FIELD`,`evt`.`sql_mode` AS `SQL_MODE`,convert_tz(`evt`.`starts`,'+00:00',`evt`.`time_zone`) AS `STARTS`,convert_tz(`evt`.`ends`,'+00:00',`evt`.`time_zone`) AS `ENDS`,`evt`.`status` AS `STATUS`,if((`evt`.`on_completion` = 'DROP'),'NOT PRESERVE','PRESERVE') AS `ON_COMPLETION`,`evt`.`created` AS `CREATED`,`evt`.`last_altered` AS `LAST_ALTERED`,`evt`.`last_executed` AS `LAST_EXECUTED`,`evt`.`comment` AS `EVENT_COMMENT`,`evt`.`originator` AS `ORIGINATOR`,`cs_client`.`name` AS `CHARACTER_SET_CLIENT`,`coll_conn`.`name` AS `COLLATION_CONNECTION`,`coll_db`.`name` AS `DATABASE_COLLATION` from ((((((`mysql`.`events` `evt` join `mysql`.`schemata` `sch` on((`evt`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `coll_client` on((`coll_client`.`id` = `evt`.`client_collation_id`))) join `mysql`.`character_sets` `cs_client` on((`cs_client`.`id` = `coll_client`.`character_set_id`))) join `mysql`.`collations` `coll_conn` on((`coll_conn`.`id` = `evt`.`connection_collation_id`))) join `mysql`.`collations` `coll_db` on((`coll_db`.`id` = `evt`.`schema_collation_id`))) where (0 <> can_access_event(`sch`.`name`));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.FILES
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`FILES` AS select internal_tablespace_id(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `FILE_ID`,replace(if(((locate(left(`tsf`.`file_name`,1),'./') = 0) and (substr(`tsf`.`file_name`,2,1) <> ':')),concat('./',`tsf`.`file_name`),`tsf`.`file_name`),'\\','/') AS `FILE_NAME`,internal_tablespace_type(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `FILE_TYPE`,`ts`.`name` AS `TABLESIF NOT EXISTS PACE_NAME`,'' AS `TABLE_CATALOG`,NULL AS `TABLE_SCHEMA`,NULL AS `TABLE_NAME`,internal_tablespace_logfile_group_name(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `LOGFILE_GROUP_NAME`,internal_tablespace_logfile_group_number(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `LOGFILE_GROUP_NUMBER`,`ts`.`engine` AS `ENGINE`,NULL AS `FULLTEXT_KEYS`,NULL AS `DELETED_ROWS`,NULL AS `UPDATE_COUNT`,internal_tablespace_free_extents(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `FREE_EXTENTS`,internal_tablespace_total_extents(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `TOTAL_EXTENTS`,internal_tablespace_extent_size(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `EXTENT_SIZE`,internal_tablespace_initial_size(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `INITIAL_SIZE`,internal_tablespace_maximum_size(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `MAXIMUM_SIZE`,internal_tablespace_autoextend_size(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `AUTOEXTEND_SIZE`,NULL AS `CREATION_TIME`,NULL AS `LAST_UPDATE_TIME`,NULL AS `LAST_ACCESS_TIME`,NULL AS `RECOVER_TIME`,NULL AS `TRANSACTION_COUNTER`,internal_tablespace_version(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `VERSION`,internal_tablespace_row_format(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `ROW_FORMAT`,NULL AS `TABLE_ROWS`,NULL AS `AVG_ROW_LENGTH`,NULL AS `DATA_LENGTH`,NULL AS `MAX_DATA_LENGTH`,NULL AS `INDEX_LENGTH`,internal_tablespace_data_free(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `DATA_FREE`,NULL AS `CREATE_TIME`,NULL AS `UPDATE_TIME`,NULL AS `CHECK_TIME`,NULL AS `CHECKSUM`,internal_tablespace_status(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `STATUS`,internal_tablespace_extra(`ts`.`name`,`tsf`.`file_name`,`ts`.`engine`,`ts`.`se_private_data`) AS `EXTRA` from (`mysql`.`tablespaces` `ts` join `mysql`.`tablespace_files` `tsf` on((`ts`.`id` = `tsf`.`tablespace_id`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_BUFFER_PAGE
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_BUFFER_PAGE` (
  `POOL_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `BLOCK_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `SPACE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGE_NUMBER` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGE_TYPE` varchar(64) DEFAULT NULL,
  `FLUSH_TYPE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `FIX_COUNT` bigint(21) unsigned NOT NULL DEFAULT '0',
  `IS_HASHED` varchar(3) DEFAULT NULL,
  `NEWEST_MODIFICATION` bigint(21) unsigned NOT NULL DEFAULT '0',
  `OLDEST_MODIFICATION` bigint(21) unsigned NOT NULL DEFAULT '0',
  `ACCESS_TIME` bigint(21) unsigned NOT NULL DEFAULT '0',
  `TABLE_NAME` varchar(1024) DEFAULT NULL,
  `INDEX_NAME` varchar(1024) DEFAULT NULL,
  `NUMBER_RECORDS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `DATA_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `COMPRESSED_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGE_STATE` varchar(64) DEFAULT NULL,
  `IO_FIX` varchar(64) DEFAULT NULL,
  `IS_OLD` varchar(3) DEFAULT NULL,
  `FREE_PAGE_CLOCK` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_BUFFER_PAGE_LRU
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_BUFFER_PAGE_LRU` (
  `POOL_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `LRU_POSITION` bigint(21) unsigned NOT NULL DEFAULT '0',
  `SPACE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGE_NUMBER` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGE_TYPE` varchar(64) DEFAULT NULL,
  `FLUSH_TYPE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `FIX_COUNT` bigint(21) unsigned NOT NULL DEFAULT '0',
  `IS_HASHED` varchar(3) DEFAULT NULL,
  `NEWEST_MODIFICATION` bigint(21) unsigned NOT NULL DEFAULT '0',
  `OLDEST_MODIFICATION` bigint(21) unsigned NOT NULL DEFAULT '0',
  `ACCESS_TIME` bigint(21) unsigned NOT NULL DEFAULT '0',
  `TABLE_NAME` varchar(1024) DEFAULT NULL,
  `INDEX_NAME` varchar(1024) DEFAULT NULL,
  `NUMBER_RECORDS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `DATA_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `COMPRESSED_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `COMPRESSED` varchar(3) DEFAULT NULL,
  `IO_FIX` varchar(64) DEFAULT NULL,
  `IS_OLD` varchar(3) DEFAULT NULL,
  `FREE_PAGE_CLOCK` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_BUFFER_POOL_STATS
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_BUFFER_POOL_STATS` (
  `POOL_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `POOL_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `FREE_BUFFERS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `DATABASE_PAGES` bigint(21) unsigned NOT NULL DEFAULT '0',
  `OLD_DATABASE_PAGES` bigint(21) unsigned NOT NULL DEFAULT '0',
  `MODIFIED_DATABASE_PAGES` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PENDING_DECOMPRESS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PENDING_READS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PENDING_FLUSH_LRU` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PENDING_FLUSH_LIST` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGES_MADE_YOUNG` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGES_NOT_MADE_YOUNG` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGES_MADE_YOUNG_RATE` double NOT NULL DEFAULT '0',
  `PAGES_MADE_NOT_YOUNG_RATE` double NOT NULL DEFAULT '0',
  `NUMBER_PAGES_READ` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NUMBER_PAGES_CREATED` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NUMBER_PAGES_WRITTEN` bigint(21) unsigned NOT NULL DEFAULT '0',
  `PAGES_READ_RATE` double NOT NULL DEFAULT '0',
  `PAGES_CREATE_RATE` double NOT NULL DEFAULT '0',
  `PAGES_WRITTEN_RATE` double NOT NULL DEFAULT '0',
  `NUMBER_PAGES_GET` bigint(21) unsigned NOT NULL DEFAULT '0',
  `HIT_RATE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `YOUNG_MAKE_PER_THOUSAND_GETS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NOT_YOUNG_MAKE_PER_THOUSAND_GETS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NUMBER_PAGES_READ_AHEAD` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NUMBER_READ_AHEAD_EVICTED` bigint(21) unsigned NOT NULL DEFAULT '0',
  `READ_AHEAD_RATE` double NOT NULL DEFAULT '0',
  `READ_AHEAD_EVICTED_RATE` double NOT NULL DEFAULT '0',
  `LRU_IO_TOTAL` bigint(21) unsigned NOT NULL DEFAULT '0',
  `LRU_IO_CURRENT` bigint(21) unsigned NOT NULL DEFAULT '0',
  `UNCOMPRESS_TOTAL` bigint(21) unsigned NOT NULL DEFAULT '0',
  `UNCOMPRESS_CURRENT` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_CACHED_INDEXES
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_CACHED_INDEXES` (
  `SPACE_ID` int(11) unsigned NOT NULL DEFAULT '0',
  `INDEX_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `N_CACHED_PAGES` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_CMP
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_CMP` (
  `page_size` int(5) NOT NULL DEFAULT '0',
  `compress_ops` int(11) NOT NULL DEFAULT '0',
  `compress_ops_ok` int(11) NOT NULL DEFAULT '0',
  `compress_time` int(11) NOT NULL DEFAULT '0',
  `uncompress_ops` int(11) NOT NULL DEFAULT '0',
  `uncompress_time` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_CMPMEM
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_CMPMEM` (
  `page_size` int(5) NOT NULL DEFAULT '0',
  `buffer_pool_instance` int(11) NOT NULL DEFAULT '0',
  `pages_used` int(11) NOT NULL DEFAULT '0',
  `pages_free` int(11) NOT NULL DEFAULT '0',
  `relocation_ops` bigint(21) NOT NULL DEFAULT '0',
  `relocation_time` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_CMPMEM_RESET
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_CMPMEM_RESET` (
  `page_size` int(5) NOT NULL DEFAULT '0',
  `buffer_pool_instance` int(11) NOT NULL DEFAULT '0',
  `pages_used` int(11) NOT NULL DEFAULT '0',
  `pages_free` int(11) NOT NULL DEFAULT '0',
  `relocation_ops` bigint(21) NOT NULL DEFAULT '0',
  `relocation_time` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_CMP_PER_INDEX
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_CMP_PER_INDEX` (
  `database_name` varchar(192) NOT NULL DEFAULT '',
  `table_name` varchar(192) NOT NULL DEFAULT '',
  `index_name` varchar(192) NOT NULL DEFAULT '',
  `compress_ops` int(11) NOT NULL DEFAULT '0',
  `compress_ops_ok` int(11) NOT NULL DEFAULT '0',
  `compress_time` int(11) NOT NULL DEFAULT '0',
  `uncompress_ops` int(11) NOT NULL DEFAULT '0',
  `uncompress_time` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_CMP_PER_INDEX_RESET
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_CMP_PER_INDEX_RESET` (
  `database_name` varchar(192) NOT NULL DEFAULT '',
  `table_name` varchar(192) NOT NULL DEFAULT '',
  `index_name` varchar(192) NOT NULL DEFAULT '',
  `compress_ops` int(11) NOT NULL DEFAULT '0',
  `compress_ops_ok` int(11) NOT NULL DEFAULT '0',
  `compress_time` int(11) NOT NULL DEFAULT '0',
  `uncompress_ops` int(11) NOT NULL DEFAULT '0',
  `uncompress_time` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_CMP_RESET
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_CMP_RESET` (
  `page_size` int(5) NOT NULL DEFAULT '0',
  `compress_ops` int(11) NOT NULL DEFAULT '0',
  `compress_ops_ok` int(11) NOT NULL DEFAULT '0',
  `compress_time` int(11) NOT NULL DEFAULT '0',
  `uncompress_ops` int(11) NOT NULL DEFAULT '0',
  `uncompress_time` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_COLUMNS
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_COLUMNS` (
  `TABLE_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NAME` varchar(193) NOT NULL DEFAULT '',
  `POS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `MTYPE` int(11) NOT NULL DEFAULT '0',
  `PRTYPE` int(11) NOT NULL DEFAULT '0',
  `LEN` int(11) NOT NULL DEFAULT '0',
  `HAS_DEFAULT` int(1) NOT NULL DEFAULT '0',
  `DEFAULT_VALUE` mediumblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_DATAFILES
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`INNODB_DATAFILES` AS select get_dd_tablespace_private_data(`ts`.`se_private_data`,'id') AS `SPACE`,`ts_files`.`file_name` AS `PATH` from (`mysql`.`tablespace_files` `ts_files` join `mysql`.`tablespaces` `ts` on((`ts`.`id` = `ts_files`.`tablespace_id`))) where ((`ts`.`se_private_data` is not null) and (`ts`.`engine` = 'InnoDB') and (`ts`.`name` <> 'mysql') and (`ts`.`name` <> 'innodb_temporary'));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FIELDS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`INNODB_FIELDS` AS select get_dd_index_private_data(`idx`.`se_private_data`,'id') AS `INDEX_ID`,`col`.`name` AS `NAME`,(`fld`.`ordinal_position` - 1) AS `POS` from (((`mysql`.`index_column_usage` `fld` join `mysql`.`columns` `col` on((`fld`.`column_id` = `col`.`id`))) join `mysql`.`indexes` `idx` on((`fld`.`index_id` = `idx`.`id`))) join `mysql`.`tables` `tbl` on((`tbl`.`id` = `idx`.`table_id`))) where ((`tbl`.`type` <> 'VIEW') and (`tbl`.`hidden` = 'Visible') and (0 = `fld`.`hidden`) and (`tbl`.`se_private_id` is not null) and (`tbl`.`engine` = 'INNODB'));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FOREIGN
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`INNODB_FOREIGN` AS select (concat(`sch`.`name`,'/',`fk`.`name`) collate utf8_tolower_ci) AS `ID`,concat(`sch`.`name`,'/',`tbl`.`name`) AS `FOR_NAME`,concat(`fk`.`referenced_table_schema`,'/',`fk`.`referenced_table_name`) AS `REF_NAME`,count(0) AS `N_COLS`,(((((if((`fk`.`delete_rule` = 'CASCADE'),1,0) | if((`fk`.`delete_rule` = 'SET NULL'),2,0)) | if((`fk`.`update_rule` = 'CASCADE'),4,0)) | if((`fk`.`update_rule` = 'SET NULL'),8,0)) | if((`fk`.`delete_rule` = 'NO ACTION'),16,0)) | if((`fk`.`update_rule` = 'NO ACTION'),32,0)) AS `TYPE` from (((`mysql`.`foreign_keys` `fk` join `mysql`.`tables` `tbl` on((`fk`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`fk`.`schema_id` = `sch`.`id`))) join `mysql`.`foreign_key_column_usage` `col` on((`fk`.`id` = `col`.`foreign_key_id`))) where ((`tbl`.`type` <> 'VIEW') and (`tbl`.`hidden` = 'Visible') and (`tbl`.`se_private_id` is not null) and (`tbl`.`engine` = 'INNODB')) group by `fk`.`id`;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FOREIGN_COLS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`INNODB_FOREIGN_COLS` AS select (concat(`sch`.`name`,'/',`fk`.`name`) collate utf8_tolower_ci) AS `ID`,`col`.`name` AS `FOR_COL_NAME`,`fk_col`.`referenced_column_name` AS `REF_COL_NAME`,`fk_col`.`ordinal_position` AS `POS` from ((((`mysql`.`foreign_key_column_usage` `fk_col` join `mysql`.`foreign_keys` `fk` on((`fk`.`id` = `fk_col`.`foreign_key_id`))) join `mysql`.`tables` `tbl` on((`fk`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`fk`.`schema_id` = `sch`.`id`))) join `mysql`.`columns` `col` on(((`tbl`.`id` = `col`.`table_id`) and (`fk_col`.`column_id` = `col`.`id`)))) where ((`tbl`.`type` <> 'VIEW') and (`tbl`.`hidden` = 'Visible') and (`tbl`.`se_private_id` is not null) and (`tbl`.`engine` = 'INNODB'));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FT_BEING_DELETED
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_FT_BEING_DELETED` (
  `DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FT_CONFIG
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_FT_CONFIG` (
  `KEY` varchar(193) NOT NULL DEFAULT '',
  `VALUE` varchar(193) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FT_DEFAULT_STOPWORD
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_FT_DEFAULT_STOPWORD` (
  `value` varchar(18) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FT_DELETED
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_FT_DELETED` (
  `DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FT_INDEX_CACHE
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_FT_INDEX_CACHE` (
  `WORD` varchar(337) NOT NULL DEFAULT '',
  `FIRST_DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `LAST_DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `DOC_COUNT` bigint(21) unsigned NOT NULL DEFAULT '0',
  `DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `POSITION` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_FT_INDEX_TABLE
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_FT_INDEX_TABLE` (
  `WORD` varchar(337) NOT NULL DEFAULT '',
  `FIRST_DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `LAST_DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `DOC_COUNT` bigint(21) unsigned NOT NULL DEFAULT '0',
  `DOC_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `POSITION` bigint(21) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_INDEXES
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_INDEXES` (
  `INDEX_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NAME` varchar(193) NOT NULL DEFAULT '',
  `TABLE_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `TYPE` int(11) NOT NULL DEFAULT '0',
  `N_FIELDS` int(11) NOT NULL DEFAULT '0',
  `PAGE_NO` int(11) NOT NULL DEFAULT '0',
  `SPACE` int(11) NOT NULL DEFAULT '0',
  `MERGE_THRESHOLD` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_METRICS
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_METRICS` (
  `NAME` varchar(193) NOT NULL DEFAULT '',
  `SUBSYSTEM` varchar(193) NOT NULL DEFAULT '',
  `COUNT` bigint(21) NOT NULL DEFAULT '0',
  `MAX_COUNT` bigint(21) DEFAULT NULL,
  `MIN_COUNT` bigint(21) DEFAULT NULL,
  `AVG_COUNT` double DEFAULT NULL,
  `COUNT_RESET` bigint(21) NOT NULL DEFAULT '0',
  `MAX_COUNT_RESET` bigint(21) DEFAULT NULL,
  `MIN_COUNT_RESET` bigint(21) DEFAULT NULL,
  `AVG_COUNT_RESET` double DEFAULT NULL,
  `TIME_ENABLED` datetime DEFAULT NULL,
  `TIME_DISABLED` datetime DEFAULT NULL,
  `TIME_ELAPSED` bigint(21) DEFAULT NULL,
  `TIME_RESET` datetime DEFAULT NULL,
  `STATUS` varchar(193) NOT NULL DEFAULT '',
  `TYPE` varchar(193) NOT NULL DEFAULT '',
  `COMMENT` varchar(193) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_SESSION_TEMP_TABLESPACES
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_SESSION_TEMP_TABLESPACES` (
  `ID` int(11) unsigned NOT NULL DEFAULT '0',
  `SPACE` int(11) unsigned NOT NULL DEFAULT '0',
  `PATH` varchar(4001) NOT NULL DEFAULT '',
  `SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `STATE` varchar(192) NOT NULL DEFAULT '',
  `PURPOSE` varchar(192) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_TABLES
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_TABLES` (
  `TABLE_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NAME` varchar(655) NOT NULL DEFAULT '',
  `FLAG` int(11) NOT NULL DEFAULT '0',
  `N_COLS` int(11) NOT NULL DEFAULT '0',
  `SPACE` bigint(21) NOT NULL DEFAULT '0',
  `ROW_FORMAT` varchar(12) DEFAULT NULL,
  `ZIP_PAGE_SIZE` int(11) unsigned NOT NULL DEFAULT '0',
  `SPACE_TYPE` varchar(10) DEFAULT NULL,
  `INSTANT_COLS` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_TABLESPACES
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_TABLESPACES` (
  `SPACE` int(11) unsigned NOT NULL DEFAULT '0',
  `NAME` varchar(655) NOT NULL DEFAULT '',
  `FLAG` int(11) unsigned NOT NULL DEFAULT '0',
  `ROW_FORMAT` varchar(22) DEFAULT NULL,
  `PAGE_SIZE` int(11) unsigned NOT NULL DEFAULT '0',
  `ZIP_PAGE_SIZE` int(11) unsigned NOT NULL DEFAULT '0',
  `SPACE_TYPE` varchar(10) DEFAULT NULL,
  `FS_BLOCK_SIZE` int(11) unsigned NOT NULL DEFAULT '0',
  `FILE_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `ALLOCATED_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `SERVER_VERSION` varchar(10) DEFAULT NULL,
  `SPACE_VERSION` int(11) unsigned NOT NULL DEFAULT '0',
  `ENCRYPTION` varchar(1) DEFAULT NULL,
  `STATE` varchar(10) DEFAULT NULL
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_TABLESPACES_BRIEF
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`INNODB_TABLESIF NOT EXISTS PACES_BRIEF` AS select get_dd_tablespace_private_data(`ts`.`se_private_data`,'id') AS `SPACE`,`ts`.`name` AS `NAME`,`ts_files`.`file_name` AS `PATH`,get_dd_tablespace_private_data(`ts`.`se_private_data`,'flags') AS `FLAG`,if((get_dd_tablespace_private_data(`ts`.`se_private_data`,'id') = 0),'System',if((((get_dd_tablespace_private_data(`ts`.`se_private_data`,'flags') & 2048) >> 11) <> 0),'General','Single')) AS `SPACE_TYPE` from (`mysql`.`tablespace_files` `ts_files` join `mysql`.`tablespaces` `ts` on((`ts`.`id` = `ts_files`.`tablespace_id`))) where ((`ts`.`se_private_data` is not null) and (`ts`.`engine` = 'InnoDB') and (`ts`.`name` <> 'mysql') and (`ts`.`name` <> 'innodb_temporary'));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_TABLESTATS
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_TABLESTATS` (
  `TABLE_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NAME` varchar(193) NOT NULL DEFAULT '',
  `STATS_INITIALIZED` varchar(193) NOT NULL DEFAULT '',
  `NUM_ROWS` bigint(21) unsigned NOT NULL DEFAULT '0',
  `CLUST_INDEX_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `OTHER_INDEX_SIZE` bigint(21) unsigned NOT NULL DEFAULT '0',
  `MODIFIED_COUNTER` bigint(21) unsigned NOT NULL DEFAULT '0',
  `AUTOINC` bigint(21) unsigned NOT NULL DEFAULT '0',
  `REF_COUNT` int(11) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_TEMP_TABLE_INFO
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_TEMP_TABLE_INFO` (
  `TABLE_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `NAME` varchar(64) DEFAULT NULL,
  `N_COLS` int(11) unsigned NOT NULL DEFAULT '0',
  `SPACE` int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_TRX
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_TRX` (
  `trx_id` varchar(18) NOT NULL DEFAULT '',
  `trx_state` varchar(13) NOT NULL DEFAULT '',
  `trx_started` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `trx_requested_lock_id` varchar(105) DEFAULT NULL,
  `trx_wait_started` datetime DEFAULT NULL,
  `trx_weight` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_mysql_thread_id` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_query` varchar(1024) DEFAULT NULL,
  `trx_operation_state` varchar(64) DEFAULT NULL,
  `trx_tables_in_use` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_tables_locked` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_lock_structs` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_lock_memory_bytes` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_rows_locked` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_rows_modified` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_concurrency_tickets` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_isolation_level` varchar(16) NOT NULL DEFAULT '',
  `trx_unique_checks` int(1) NOT NULL DEFAULT '0',
  `trx_foreign_key_checks` int(1) NOT NULL DEFAULT '0',
  `trx_last_foreign_key_error` varchar(256) DEFAULT NULL,
  `trx_adaptive_hash_latched` int(1) NOT NULL DEFAULT '0',
  `trx_adaptive_hash_timeout` bigint(21) unsigned NOT NULL DEFAULT '0',
  `trx_is_read_only` int(1) NOT NULL DEFAULT '0',
  `trx_autocommit_non_locking` int(1) NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.INNODB_VIRTUAL
CREATE TEMPORARY TABLE IF NOT EXISTS `INNODB_VIRTUAL` (
  `TABLE_ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `POS` int(11) unsigned NOT NULL DEFAULT '0',
  `BASE_POS` int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.KEYWORDS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`KEYWORDS` AS select `j`.`word` AS `WORD`,`j`.`reserved` AS `RESERVED` from json_table('[["ACCESSIBLE",1],["ACCOUNT",0],["ACTION",0],["ACTIVE",0],["ADD",1],["ADMIN",0],["AFTER",0],["AGAINST",0],["AGGREGATE",0],["ALGORITHM",0],["ALL",1],["ALTER",1],["ALWAYS",0],["ANALYZE",1],["AND",1],["ANY",0],["ARRAY",1],["AS",1],["ASC",1],["ASCII",0],["ASENSITIVE",1],["AT",0],["AUTOEXTEND_SIZE",0],["AUTO_INCREMENT",0],["AVG",0],["AVG_ROW_LENGTH",0],["BACKUP",0],["BEFORE",1],["BEGIN",0],["BETWEEN",1],["BIGINT",1],["BINARY",1],["BINLOG",0],["BIT",0],["BLOB",1],["BLOCK",0],["BOOL",0],["BOOLEAN",0],["BOTH",1],["BTREE",0],["BUCKETS",0],["BY",1],["BYTE",0],["CACHE",0],["CALL",1],["CASCADE",1],["CASCADED",0],["CASE",1],["CATALOG_NAME",0],["CHAIN",0],["CHANGE",1],["CHANGED",0],["CHANNEL",0],["CHAR",1],["CHARACTER",1],["CHARSET",0],["CHECK",1],["CHECKSUM",0],["CIPHER",0],["CLASS_ORIGIN",0],["CLIENT",0],["CLONE",0],["CLOSE",0],["COALESCE",0],["CODE",0],["COLLATE",1],["COLLATION",0],["COLUMN",1],["COLUMNS",0],["COLUMN_FORMAT",0],["COLUMN_NAME",0],["COMMENT",0],["COMMIT",0],["COMMITTED",0],["COMPACT",0],["COMPLETION",0],["COMPONENT",0],["COMPRESSED",0],["COMPRESSION",0],["CONCURRENT",0],["CONDITION",1],["CONNECTION",0],["CONSISTENT",0],["CONSTRAINT",1],["CONSTRAINT_CATALOG",0],["CONSTRAINT_NAME",0],["CONSTRAINT_SCHEMA",0],["CONTAINS",0],["CONTEXT",0],["CONTINUE",1],["CONVERT",1],["CPU",0],["CREATE",1],["CROSS",1],["CUBE",1],["CUME_DIST",1],["CURRENT",0],["CURRENT_DATE",1],["CURRENT_TIME",1],["CURRENT_TIMESTAMP",1],["CURRENT_USER",1],["CURSOR",1],["CURSOR_NAME",0],["DATA",0],["DATABASE",1],["DATABASES",1],["DATAFILE",0],["DATE",0],["DATETIME",0],["DAY",0],["DAY_HOUR",1],["DAY_MICROSECOND",1],["DAY_MINUTE",1],["DAY_SECOND",1],["DEALLOCATE",0],["DEC",1],["DECIMAL",1],["DECLARE",1],["DEFAULT",1],["DEFAULT_AUTH",0],["DEFINER",0],["DEFINITION",0],["DELAYED",1],["DELAY_KEY_WRITE",0],["DELETE",1],["DENSE_RANK",1],["DESC",1],["DESCRIBE",1],["DESCRIPTION",0],["DETERMINISTIC",1],["DIAGNOSTICS",0],["DIRECTORY",0],["DISABLE",0],["DISCARD",0],["DISK",0],["DISTINCT",1],["DISTINCTROW",1],["DIV",1],["DO",0],["DOUBLE",1],["DROP",1],["DUAL",1],["DUMPFILE",0],["DUPLICATE",0],["DYNAMIC",0],["EACH",1],["ELSE",1],["ELSEIF",1],["EMPTY",1],["ENABLE",0],["ENCLOSED",1],["ENCRYPTION",0],["END",0],["ENDS",0],["ENFORCED",0],["ENGINE",0],["ENGINES",0],["ENUM",0],["ERROR",0],["ERRORS",0],["ESCAPE",0],["ESCAPED",1],["EVENT",0],["EVENTS",0],["EVERY",0],["EXCEPT",1],["EXCHANGE",0],["EXCLUDE",0],["EXECUTE",0],["EXISTS",1],["EXIT",1],["EXPANSION",0],["EXPIRE",0],["EXPLAIN",1],["EXPORT",0],["EXTENDED",0],["EXTENT_SIZE",0],["FALSE",1],["FAST",0],["FAULTS",0],["FETCH",1],["FIELDS",0],["FILE",0],["FILE_BLOCK_SIZE",0],["FILTER",0],["FIRST",0],["FIRST_VALUE",1],["FIXED",0],["FLOAT",1],["FLOAT4",1],["FLOAT8",1],["FLUSH",0],["FOLLOWING",0],["FOLLOWS",0],["FOR",1],["FORCE",1],["FOREIGN",1],["FORMAT",0],["FOUND",0],["FROM",1],["FULL",0],["FULLTEXT",1],["FUNCTION",1],["GENERAL",0],["GENERATED",1],["GEOMCOLLECTION",0],["GEOMETRY",0],["GEOMETRYCOLLECTION",0],["GET",1],["GET_FORMAT",0],["GET_MASTER_PUBLIC_KEY",0],["GLOBAL",0],["GRANT",1],["GRANTS",0],["GROUP",1],["GROUPING",1],["GROUPS",1],["GROUP_REPLICATION",0],["HANDLER",0],["HASH",0],["HAVING",1],["HELP",0],["HIGH_PRIORITY",1],["HISTOGRAM",0],["HISTORY",0],["HOST",0],["HOSTS",0],["HOUR",0],["HOUR_MICROSECOND",1],["HOUR_MINUTE",1],["HOUR_SECOND",1],["IDENTIFIED",0],["IF",1],["IGNORE",1],["IGNORE_SERVER_IDS",0],["IMPORT",0],["IN",1],["INACTIVE",0],["INDEX",1],["INDEXES",0],["INFILE",1],["INITIAL_SIZE",0],["INNER",1],["INOUT",1],["INSENSITIVE",1],["INSERT",1],["INSERT_METHOD",0],["INSTALL",0],["INSTANCE",0],["INT",1],["INT1",1],["INT2",1],["INT3",1],["INT4",1],["INT8",1],["INTEGER",1],["INTERVAL",1],["INTO",1],["INVISIBLE",0],["INVOKER",0],["IO",0],["IO_AFTER_GTIDS",1],["IO_BEFORE_GTIDS",1],["IO_THREAD",0],["IPC",0],["IS",1],["ISOLATION",0],["ISSUER",0],["ITERATE",1],["JOIN",1],["JSON",0],["JSON_TABLE"IF NOT EXISTS ,1],["KEY",1],["KEYS",1],["KEY_BLOCK_SIZE",0],["KILL",1],["LAG",1],["LANGUAGE",0],["LAST",0],["LAST_VALUE",1],["LATERAL",1],["LEAD",1],["LEADING",1],["LEAVE",1],["LEAVES",0],["LEFT",1],["LESS",0],["LEVEL",0],["LIKE",1],["LIMIT",1],["LINEAR",1],["LINES",1],["LINESTRING",0],["LIST",0],["LOAD",1],["LOCAL",0],["LOCALTIME",1],["LOCALTIMESTAMP",1],["LOCK",1],["LOCKED",0],["LOCKS",0],["LOGFILE",0],["LOGS",0],["LONG",1],["LONGBLOB",1],["LONGTEXT",1],["LOOP",1],["LOW_PRIORITY",1],["MASTER",0],["MASTER_AUTO_POSITION",0],["MASTER_BIND",1],["MASTER_COMPRESSION_ALGORITHMS",0],["MASTER_CONNECT_RETRY",0],["MASTER_DELAY",0],["MASTER_HEARTBEAT_PERIOD",0],["MASTER_HOST",0],["MASTER_LOG_FILE",0],["MASTER_LOG_POS",0],["MASTER_PASSWORD",0],["MASTER_PORT",0],["MASTER_PUBLIC_KEY_PATH",0],["MASTER_RETRY_COUNT",0],["MASTER_SERVER_ID",0],["MASTER_SSL",0],["MASTER_SSL_CA",0],["MASTER_SSL_CAPATH",0],["MASTER_SSL_CERT",0],["MASTER_SSL_CIPHER",0],["MASTER_SSL_CRL",0],["MASTER_SSL_CRLPATH",0],["MASTER_SSL_KEY",0],["MASTER_SSL_VERIFY_SERVER_CERT",1],["MASTER_TLS_VERSION",0],["MASTER_USER",0],["MASTER_ZSTD_COMPRESSION_LEVEL",0],["MATCH",1],["MAXVALUE",1],["MAX_CONNECTIONS_PER_HOUR",0],["MAX_QUERIES_PER_HOUR",0],["MAX_ROWS",0],["MAX_SIZE",0],["MAX_UPDATES_PER_HOUR",0],["MAX_USER_CONNECTIONS",0],["MEDIUM",0],["MEDIUMBLOB",1],["MEDIUMINT",1],["MEDIUMTEXT",1],["MEMBER",1],["MEMORY",0],["MERGE",0],["MESSAGE_TEXT",0],["MICROSECOND",0],["MIDDLEINT",1],["MIGRATE",0],["MINUTE",0],["MINUTE_MICROSECOND",1],["MINUTE_SECOND",1],["MIN_ROWS",0],["MOD",1],["MODE",0],["MODIFIES",1],["MODIFY",0],["MONTH",0],["MULTILINESTRING",0],["MULTIPOINT",0],["MULTIPOLYGON",0],["MUTEX",0],["MYSQL_ERRNO",0],["NAME",0],["NAMES",0],["NATIONAL",0],["NATURAL",1],["NCHAR",0],["NDB",0],["NDBCLUSTER",0],["NESTED",0],["NETWORK_NAMESPACE",0],["NEVER",0],["NEW",0],["NEXT",0],["NO",0],["NODEGROUP",0],["NONE",0],["NOT",1],["NOWAIT",0],["NO_WAIT",0],["NO_WRITE_TO_BINLOG",1],["NTH_VALUE",1],["NTILE",1],["NULL",1],["NULLS",0],["NUMBER",0],["NUMERIC",1],["NVARCHAR",0],["OF",1],["OFFSET",0],["OJ",0],["OLD",0],["ON",1],["ONE",0],["ONLY",0],["OPEN",0],["OPTIMIZE",1],["OPTIMIZER_COSTS",1],["OPTION",1],["OPTIONAL",0],["OPTIONALLY",1],["OPTIONS",0],["OR",1],["ORDER",1],["ORDINALITY",0],["ORGANIZATION",0],["OTHERS",0],["OUT",1],["OUTER",1],["OUTFILE",1],["OVER",1],["OWNER",0],["PACK_KEYS",0],["PAGE",0],["PARSER",0],["PARTIAL",0],["PARTITION",1],["PARTITIONING",0],["PARTITIONS",0],["PASSWORD",0],["PATH",0],["PERCENT_RANK",1],["PERSIST",0],["PERSIST_ONLY",0],["PHASE",0],["PLUGIN",0],["PLUGINS",0],["PLUGIN_DIR",0],["POINT",0],["POLYGON",0],["PORT",0],["PRECEDES",0],["PRECEDING",0],["PRECISION",1],["PREPARE",0],["PRESERVE",0],["PREV",0],["PRIMARY",1],["PRIVILEGES",0],["PRIVILEGE_CHECKS_USER",0],["PROCEDURE",1],["PROCESS",0],["PROCESSLIST",0],["PROFILE",0],["PROFILES",0],["PROXY",0],["PURGE",1],["QUARTER",0],["QUERY",0],["QUICK",0],["RANDOM",0],["RANGE",1],["RANK",1],["READ",1],["READS",1],["READ_ONLY",0],["READ_WRITE",1],["REAL",1],["REBUILD",0],["RECOVER",0],["RECURSIVE",1],["REDO_BUFFER_SIZE",0],["REDUNDANT",0],["REFERENCE",0],["REFERENCES",1],["REGEXP",1],["RELAY",0],["RELAYLOG",0],["RELAY_LOG_FILE",0],["RELAY_LOG_POS",0],["RELAY_THREAD",0],["RELEASE",1],["RELOAD",0],["REMOVE",0],["RENAME",1],["REORGANIZE",0],["REPAIR",0],["REPEAT",1],["REPEATABLE",0],["REPLACE",1],["REPLICATE_DO_DB",0],["REPLICATE_DO_TABLE",0],["REPLICATE_IGNORE_DB",0],["REPLICATE_IGNORE_TABLE",0],["REPLICATE_REWRITE_DB",0],["REPLICATE_WILD_DO_TABLE",0],["REPLICATE_WILD_IGNORE_TABLE",0],["REPLICATION",0],["REQUIRE",1],["RESET",0],["RESIGNAL",1],["RESOURCE",0],["RESPECT",0],["RESTART",0],["RESTORE",0],["RESTRICT",1],["RESUME",0],["RETAIN",0],["RETURN",1],["RETURNED_SQLSTATE",0],["RETURNS",0],["REUSE",0],["REVERSE",0],["REVOKE",1],["RIGHT",1],["RLIKE",1],["ROLE",0],["ROLLBACK",0],["ROLLUP",0],["ROTATE",0],["ROUTINE",0],["ROW",1],["ROWS",1],["ROW_COUNT",0],["ROW_FORMAT",0],["ROW_NUMBER",1],["RTREE",0],["SAVEPOINT",0],["SCHEDULE",0],["SCHEMA",1],["SCHEMAS",1],["SCHEMA_NAME",0],["SECOND",0],["SECONDARY",0],["SECONDARY_ENGINE",0],["SECONDARY_LOAD",0],["SECONDARY_UNLOAD",0],["SECOND_MICROSECOND",1],["SECURITY",0],["SELECT",1],["SENSITIVE",1],["SEPARATOR",1],["SERIAL",0],["SERIALIZABLE",0],["SERVER",0],["SESSION",0],["SET",1],["SHARE",0],["SHOW",1],["SHUTDOWN",0],["SIGNAL",1],["SIGNED",0],["SIMPLE",0],["SKIP",0],["SLAVE",0],["SLOW",0],["SMALLINT",1],["SNAPSHOT",0],["SOCKET",0],["SOME",0],["SONAME",0],["SOUNDS",0],["SOURCE",0],["SPATIAL",1],["SPECIFIC",1],["SQL",1],["SQLEXCEPTION",1],["SQLSTATE",1],["SQLWARNING",1],["SQL_AFTER_GTIDS",0],["SQL_AFTER_MTS_GAPS",0],["SQL_BEFORE_GTIDS",0],["SQL_BIG_RESULT",1],["SQL_BUFFER_RESULT",0],["SQL_CALC_FOUND_ROWS",1],["SQL_NO_CACHE",0],["SQL_SMALL_RESULT",1],["SQL_THREAD",0],["SQL_TSI_DAY",0],["SQL_TSI_HOUR",0],["SQL_TSI_MINUTE",0],["SQL_TSI_MONTH",0],["SQL_TSI_QUARTER",0],["SQL_TSI_SECOND",0],["SQL_TSI_WEEK",0],["SQL_TSI_YEAR",0],["SRID",0],["SSL",1],["STACKED",0],["START",0],["STARTING",1],["STARTS",0],["STATS_AUTO_RECALC",0],["STATS_PERSISTENT",0],["STATS_SAMPLE_PAGES",0],["STATUS",0],["STOP",0],["STORAGE",0],["STORED",1],["STRAIGHT_JOIN",1],["STRING",0],["SUBCLASS_ORIGIN",0],["SUBJECT",0],["SUBPARTITION",0],["SUBPARTITIONS",0],["SUPER",0],["SUSPEND",0],["SWAPS",0],["SWITCHES",0],["SYSTEM",1],["TABLE",1],["TABLES",0],["TABLESPACE",0],["TABLE_CHECKSUM",0],["TABLE_NAME",0],["TEMPORARY",0],["TEMPTABLE",0],["TERMINATED",1],["TEXT",0],["THAN",0],["THEN",1],["THREAD_PRIORITY",0],["TIES",0],["TIME",0],["TIMESTAMP",0],["TIMESTAMPADD",0],["TIMESTAMPDIFF",0],["TINYBLOB",1],["TINYINT",1],["TINYTEXT",1],["TO",1],["TRAILING",1],["TRANSACTION",0],["TRIGGER",1],["TRIGGERS",0],["TRUE",1],["TRUNCATE",0],["TYPE",0],["TYPES",0],["UNBOUNDED",0],["UNCOMMITTED",0],["UNDEFINED",0],["UNDO",1],["UNDOFILE",0],["UNDO_BUFFER_SIZE",0],["UNICODE",0],["UNINSTALL",0],["UNION",1],["UNIQUE",1],["UNKNOWN",0],["UNLOCK",1],["UNSIGNED",1],["UNTIL",0],["UPDATE",1],["UPGRADE",0],["USAGE",1],["USE",1],["USER",0],["USER_RESOURCES",0],["USE_FRM",0],["USING",1],["UTC_DATE",1],["UTC_TIME",1],["UTC_TIMESTAMP",1],["VALIDATION",0],["VALUE",0],["VALUES",1],["VARBINARY",1],["VARCHAR",1],["VARCHARACTER",1],["VARIABLES",0],["VARYING",1],["VCPU",0],["VIEW",0],["VIRTUAL",1],["VISIBLE",0],["WAIT",0],["WARNINGS",0],["WEEK",0],["WEIGHT_STRING",0],["WHEN",1],["WHERE",1],["WHILE",1],["WINDOW",1],["WITH",1],["WITHOUT",0],["WORK",0],["WRAPPER",0],["WRITE",1],["X509",0],["XA",0],["XID",0],["XML",0],["XOR",1],["YEAR",0],["YEAR_MONTH",1],["ZEROFILL",1]]', '$[*]' columns (word varchar(29) path '$[0]', reserved int path '$[1]')) `j`;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.KEY_COLUMN_USAGE
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`KEY_COLUMN_USAGE` AS select (`cat`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_SCHEMA`,`idx`.`name` AS `CONSTRAINT_NAME`,(`cat`.`name` collate utf8_tolower_ci) AS `TABLE_IF NOT EXISTS CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,(`col`.`name` collate utf8_tolower_ci) AS `COLUMN_NAME`,`icu`.`ordinal_position` AS `ORDINAL_POSITION`,NULL AS `POSITION_IN_UNIQUE_CONSTRAINT`,NULL AS `REFERENCED_TABLE_SCHEMA`,NULL AS `REFERENCED_TABLE_NAME`,NULL AS `REFERENCED_COLUMN_NAME` from (((((`mysql`.`indexes` `idx` join `mysql`.`tables` `tbl` on((`idx`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`index_column_usage` `icu` on((`icu`.`index_id` = `idx`.`id`))) join `mysql`.`columns` `col` on(((`icu`.`column_id` = `col`.`id`) and (`idx`.`type` in ('PRIMARY','UNIQUE'))))) where ((0 <> can_access_column(`sch`.`name`,`tbl`.`name`,`col`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`,((`col`.`hidden` <> 'Visible') or (0 <> `idx`.`hidden`) or (0 <> `icu`.`hidden`))))) union select (`cat`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_SCHEMA`,(`fk`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_NAME`,(`cat`.`name` collate utf8_tolower_ci) AS `TABLE_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,(`col`.`name` collate utf8_tolower_ci) AS `COLUMN_NAME`,`fkcu`.`ordinal_position` AS `ORDINAL_POSITION`,`fkcu`.`ordinal_position` AS `POSITION_IN_UNIQUE_CONSTRAINT`,`fk`.`referenced_table_schema` AS `REFERENCED_TABLE_SCHEMA`,`fk`.`referenced_table_name` AS `REFERENCED_TABLE_NAME`,`fkcu`.`referenced_column_name` AS `REFERENCED_COLUMN_NAME` from (((((`mysql`.`foreign_keys` `fk` join `mysql`.`tables` `tbl` on((`fk`.`table_id` = `tbl`.`id`))) join `mysql`.`foreign_key_column_usage` `fkcu` on((`fkcu`.`foreign_key_id` = `fk`.`id`))) join `mysql`.`schemata` `sch` on((`fk`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`columns` `col` on((`fkcu`.`column_id` = `col`.`id`))) where ((0 <> can_access_column(`sch`.`name`,`tbl`.`name`,`col`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`,(`col`.`hidden` <> 'Visible'))));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.OPTIMIZER_TRACE
CREATE TEMPORARY TABLE IF NOT EXISTS `OPTIMIZER_TRACE` (
  `QUERY` longtext NOT NULL,
  `TRACE` longtext NOT NULL,
  `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` int(20) NOT NULL DEFAULT '0',
  `INSUFFICIENT_PRIVILEGES` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.PARAMETERS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`PARAMETERS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `SPECIFIC_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `SPECIFIC_SCHEMA`,`rtn`.`name` AS `SPECIFIC_NAME`,if((`rtn`.`type` = 'FUNCTION'),(`prm`.`ordinal_position` - 1),`prm`.`ordinal_position`) AS `ORDINAL_POSITION`,if(((`rtn`.`type` = 'FUNCTION') and (`prm`.`ordinal_position` = 1)),NULL,`prm`.`mode`) AS `PARAMETER_MODE`,if(((`rtn`.`type` = 'FUNCTION') and (`prm`.`ordinal_position` = 1)),NULL,`prm`.`name`) AS `PARAMETER_NAME`,substring_index(substring_index(`prm`.`data_type_utf8`,'(',1),' ',1) AS `DATA_TYPE`,internal_dd_char_length(`prm`.`data_type`,`prm`.`char_length`,`col`.`name`,0) AS `CHARACTER_MAXIMUM_LENGTH`,internal_dd_char_length(`prm`.`data_type`,`prm`.`char_length`,`col`.`name`,1) AS `CHARACTER_OCTET_LENGTH`,`prm`.`numeric_precision` AS `NUMERIC_PRECISION`,if((`prm`.`numeric_precision` is null),NULL,ifnull(`prm`.`numeric_scale`,0)) AS `NUMERIC_SCALE`,`prm`.`datetime_precision` AS `DATETIME_PRECISION`,(case `prm`.`data_type` when 'MYSQL_TYPE_STRING' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_VAR_STRING' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_VARCHAR' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_TINY_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_MEDIUM_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_LONG_BLOB' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_ENUM' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) when 'MYSQL_TYPE_SET' then if((`cs`.`name` = 'binary'),NULL,`cs`.`name`) else NULL end) AS `CHARACTER_SET_NAME`,(case `prm`.`data_type` when 'MYSQL_TYPE_STRING' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_VAR_STRING' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_VARCHAR' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_TINY_BLOB' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_MEDIUM_BLOB' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_BLOB' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_LONG_BLOB' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_ENUM' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) when 'MYSQL_TYPE_SET' then if((`cs`.`name` = 'binary'),NULL,`col`.`name`) else NULL end) AS `COLLATION_NAME`,`prm`.`data_type_utf8` AS `DTD_IDENTIFIER`,`rtn`.`type` AS `ROUTINE_TYPE` from (((((`mysql`.`parameters` `prm` join `mysql`.`routines` `rtn` on((`prm`.`routine_id` = `rtn`.`id`))) join `mysql`.`schemata` `sch` on((`rtn`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `col` on((`prm`.`collation_id` = `col`.`id`))) join `mysql`.`character_sets` `cs` on((`col`.`character_set_id` = `cs`.`id`))) where (0 <> can_access_routine(`sch`.`name`,`rtn`.`name`,`rtn`.`type`,`rtn`.`definer`,false));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.PARTITIONS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`PARTITIONS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `TABLE_IF NOT EXISTS CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,`tbl`.`name` AS `TABLE_NAME`,`part`.`name` AS `PARTITION_NAME`,`sub_part`.`name` AS `SUBPARTITION_NAME`,(`part`.`number` + 1) AS `PARTITION_ORDINAL_POSITION`,(`sub_part`.`number` + 1) AS `SUBPARTITION_ORDINAL_POSITION`,(case `tbl`.`partition_type` when 'HASH' then 'HASH' when 'RANGE' then 'RANGE' when 'LIST' then 'LIST' when 'AUTO' then 'AUTO' when 'KEY_51' then 'KEY' when 'KEY_55' then 'KEY' when 'LINEAR_KEY_51' then 'LINEAR KEY' when 'LINEAR_KEY_55' then 'LINEAR KEY' when 'LINEAR_HASH' then 'LINEAR HASH' when 'RANGE_COLUMNS' then 'RANGE COLUMNS' when 'LIST_COLUMNS' then 'LIST COLUMNS' else NULL end) AS `PARTITION_METHOD`,(case `tbl`.`subpartition_type` when 'HASH' then 'HASH' when 'RANGE' then 'RANGE' when 'LIST' then 'LIST' when 'AUTO' then 'AUTO' when 'KEY_51' then 'KEY' when 'KEY_55' then 'KEY' when 'LINEAR_KEY_51' then 'LINEAR KEY' when 'LINEAR_KEY_55' then 'LINEAR KEY' when 'LINEAR_HASH' then 'LINEAR HASH' when 'RANGE_COLUMNS' then 'RANGE COLUMNS' when 'LIST_COLUMNS' then 'LIST COLUMNS' else NULL end) AS `SUBPARTITION_METHOD`,`tbl`.`partition_expression_utf8` AS `PARTITION_EXPRESSION`,`tbl`.`subpartition_expression_utf8` AS `SUBPARTITION_EXPRESSION`,`part`.`description_utf8` AS `PARTITION_DESCRIPTION`,internal_table_rows(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `TABLE_ROWS`,internal_avg_row_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `AVG_ROW_LENGTH`,internal_data_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `DATA_LENGTH`,internal_max_data_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `MAX_DATA_LENGTH`,internal_index_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `INDEX_LENGTH`,internal_data_free(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `DATA_FREE`,`tbl`.`created` AS `CREATE_TIME`,internal_update_time(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `UPDATE_TIME`,internal_check_time(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `CHECK_TIME`,internal_checksum(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),if((`sub_part`.`name` is null),if((`part`.`name` is null),`tbl`.`se_private_data`,`part_ts`.`se_private_data`),`sub_part_ts`.`se_private_data`),0,0,ifnull(`sub_part`.`name`,`part`.`name`)) AS `CHECKSUM`,if((`sub_part`.`name` is null),ifnull(`part`.`comment`,''),ifnull(`sub_part`.`comment`,'')) AS `PARTITION_COMMENT`,if((`part`.`name` is null),'',internal_get_partition_nodegroup(if((`sub_part`.`name` is null),`part`.`options`,`sub_part`.`options`))) AS `NODEGROUP`,ifnull(`sub_part_ts`.`name`,`part_ts`.`name`) AS `TABLESPACE_NAME` from ((((((`mysql`.`tables` `tbl` join `mysql`.`schemata` `sch` on((`sch`.`id` = `tbl`.`schema_id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) left join `mysql`.`table_partitions` `part` on((`part`.`table_id` = `tbl`.`id`))) left join `mysql`.`table_partitions` `sub_part` on((`sub_part`.`parent_partition_id` = `part`.`id`))) left join `mysql`.`tablespaces` `part_ts` on((`part_ts`.`id` = `part`.`tablespace_id`))) left join `mysql`.`tablespaces` `sub_part_ts` on(((`sub_part`.`tablespace_id` is not null) and (`sub_part_ts`.`id` = `sub_part`.`tablespace_id`)))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`)) and (`part`.`parent_partition_id` is null));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.PLUGINS
CREATE TEMPORARY TABLE IF NOT EXISTS `PLUGINS` (
  `PLUGIN_NAME` varchar(64) NOT NULL DEFAULT '',
  `PLUGIN_VERSION` varchar(20) NOT NULL DEFAULT '',
  `PLUGIN_STATUS` varchar(10) NOT NULL DEFAULT '',
  `PLUGIN_TYPE` varchar(80) NOT NULL DEFAULT '',
  `PLUGIN_TYPE_VERSION` varchar(20) NOT NULL DEFAULT '',
  `PLUGIN_LIBRARY` varchar(64) DEFAULT NULL,
  `PLUGIN_LIBRARY_VERSION` varchar(20) DEFAULT NULL,
  `PLUGIN_AUTHOR` varchar(64) DEFAULT NULL,
  `PLUGIN_DESCRIPTION` longtext,
  `PLUGIN_LICENSE` varchar(80) DEFAULT NULL,
  `LOAD_OPTION` varchar(64) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.PROCESSLIST
CREATE TEMPORARY TABLE IF NOT EXISTS `PROCESSLIST` (
  `ID` bigint(21) unsigned NOT NULL DEFAULT '0',
  `USER` varchar(32) NOT NULL DEFAULT '',
  `HOST` varchar(261) NOT NULL DEFAULT '',
  `DB` varchar(64) DEFAULT NULL,
  `COMMAND` varchar(16) NOT NULL DEFAULT '',
  `TIME` int(7) NOT NULL DEFAULT '0',
  `STATE` varchar(64) DEFAULT NULL,
  `INFO` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.PROFILING
CREATE TEMPORARY TABLE IF NOT EXISTS `PROFILING` (
  `QUERY_ID` int(20) NOT NULL DEFAULT '0',
  `SEQ` int(20) NOT NULL DEFAULT '0',
  `STATE` varchar(30) NOT NULL DEFAULT '',
  `DURATION` decimal(9,6) NOT NULL DEFAULT '0.000000',
  `CPU_USER` decimal(9,6) DEFAULT NULL,
  `CPU_SYSTEM` decimal(9,6) DEFAULT NULL,
  `CONTEXT_VOLUNTARY` int(20) DEFAULT NULL,
  `CONTEXT_INVOLUNTARY` int(20) DEFAULT NULL,
  `BLOCK_OPS_IN` int(20) DEFAULT NULL,
  `BLOCK_OPS_OUT` int(20) DEFAULT NULL,
  `MESSAGES_SENT` int(20) DEFAULT NULL,
  `MESSAGES_RECEIVED` int(20) DEFAULT NULL,
  `PAGE_FAULTS_MAJOR` int(20) DEFAULT NULL,
  `PAGE_FAULTS_MINOR` int(20) DEFAULT NULL,
  `SWAPS` int(20) DEFAULT NULL,
  `SOURCE_FUNCTION` varchar(30) DEFAULT NULL,
  `SOURCE_FILE` varchar(20) DEFAULT NULL,
  `SOURCE_LINE` int(20) DEFAULT NULL
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.REFERENTIAL_CONSTRAINTS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`REFERENTIAL_CONSTRAINTS` AS select `cat`.`name` AS `CONSTRAINT_CATALOG`,`sch`.`name` AS `CONSTRAINT_SCHEMA`,(`fk`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_NAME`,`fk`.`referenced_table_catalog` AS `UNIQUE_CONSTRAINT_CATALOG`,`fk`.`referenced_table_schema` AS `UNIQUE_CONSTRAINT_SCHEMA`,`fk`.`unique_constraint_name` AS `UNIQUE_CONSTRAINT_NAME`,`fk`.`match_option` AS `MATCH_OPTION`,`fk`.`update_rule` AS `UPDATE_RULE`,`fk`.`delete_rule` AS `DELETE_RULE`,`tbl`.`name` AS `TABLE_IF NOT EXISTS NAME`,`fk`.`referenced_table_name` AS `REFERENCED_TABLE_NAME` from (((`mysql`.`foreign_keys` `fk` join `mysql`.`tables` `tbl` on((`fk`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`fk`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.RESOURCE_GROUPS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`RESOURCE_GROUPS` AS select `res`.`resource_group_name` AS `RESOURCE_GROUP_NAME`,`res`.`resource_group_type` AS `RESOURCE_GROUP_TYPE`,`res`.`resource_group_enabled` AS `RESOURCE_GROUP_ENABLED`,convert_cpu_id_mask(`res`.`cpu_id_mask`) AS `VCPU_IDS`,`res`.`thread_priority` AS `THREAD_PRIORITY` from `mysql`.`resource_groups` `res` where (0 <> can_access_resource_group(`res`.`resource_group_name`));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.ROUTINES
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`ROUTINES` AS select `rtn`.`name` AS `SPECIFIC_NAME`,(`cat`.`name` collate utf8_tolower_ci) AS `ROUTINE_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `ROUTINE_SCHEMA`,`rtn`.`name` AS `ROUTINE_NAME`,`rtn`.`type` AS `ROUTINE_TYPE`,if((`rtn`.`type` = 'PROCEDURE'),'',substring_index(substring_index(`rtn`.`result_data_type_utf8`,'(',1),' ',1)) AS `DATA_TYPE`,internal_dd_char_length(`rtn`.`result_data_type`,`rtn`.`result_char_length`,`coll_result`.`name`,0) AS `CHARACTER_MAXIMUM_LENGTH`,internal_dd_char_length(`rtn`.`result_data_type`,`rtn`.`result_char_length`,`coll_result`.`name`,1) AS `CHARACTER_OCTET_LENGTH`,`rtn`.`result_numeric_precision` AS `NUMERIC_PRECISION`,`rtn`.`result_numeric_scale` AS `NUMERIC_SCALE`,`rtn`.`result_datetime_precision` AS `DATETIME_PRECISION`,(case `rtn`.`result_data_type` when 'MYSQL_TYPE_STRING' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_VAR_STRING' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_VARCHAR' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_TINY_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_MEDIUM_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_LONG_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_ENUM' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) when 'MYSQL_TYPE_SET' then if((`cs_result`.`name` = 'binary'),NULL,`cs_result`.`name`) else NULL end) AS `CHARACTER_SET_NAME`,(case `rtn`.`result_data_type` when 'MYSQL_TYPE_STRING' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_VAR_STRING' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_VARCHAR' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_TINY_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_MEDIUM_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_LONG_BLOB' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_ENUM' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) when 'MYSQL_TYPE_SET' then if((`cs_result`.`name` = 'binary'),NULL,`coll_result`.`name`) else NULL end) AS `COLLATION_NAME`,if((`rtn`.`type` = 'PROCEDURE'),NULL,`rtn`.`result_data_type_utf8`) AS `DTD_IDENTIFIER`,'SQL' AS `ROUTINE_BODY`,if(can_access_routine(`sch`.`name`,`rtn`.`name`,`rtn`.`type`,`rtn`.`definer`,true),`rtn`.`definition_utf8`,NULL) AS `ROUTINE_DEFINITION`,NULL AS `EXTERNAL_NAME`,`rtn`.`external_language` AS `EXTERNAL_LANGUAGE`,'SQL' AS `PARAMETER_STYLE`,if((`rtn`.`is_deterministic` = 0),'NO','YES') AS `IS_DETERMINISTIC`,`rtn`.`sql_data_access` AS `SQL_DATA_ACCESS`,NULL AS `SQL_PATH`,`rtn`.`security_type` AS `SECURITY_TYPE`,`rtn`.`created` AS `CREATED`,`rtn`.`last_altered` AS `LAST_ALTERED`,`rtn`.`sql_mode` AS `SQL_MODE`,`rtn`.`comment` AS `ROUTINE_COMMENT`,`rtn`.`definer` AS `DEFINER`,`cs_client`.`name` AS `CHARACTER_SET_CLIENT`,`coll_conn`.`name` AS `COLLATION_CONNECTION`,`coll_db`.`name` AS `DATABASE_COLLATION` from ((((((((`mysql`.`routines` `rtn` join `mysql`.`schemata` `sch` on((`rtn`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `coll_client` on((`coll_client`.`id` = `rtn`.`client_collation_id`))) join `mysql`.`character_sets` `cs_client` on((`cs_client`.`id` = `coll_client`.`character_set_id`))) join `mysql`.`collations` `coll_conn` on((`coll_conn`.`id` = `rtn`.`connection_collation_id`))) join `mysql`.`collations` `coll_db` on((`coll_db`.`id` = `rtn`.`schema_collation_id`))) left join `mysql`.`collations` `coll_result` on((`coll_result`.`id` = `rtn`.`result_collation_id`))) left join `mysql`.`character_sets` `cs_result` on((`cs_result`.`id` = `coll_result`.`character_set_id`))) where (0 <> can_access_routine(`sch`.`name`,`rtn`.`name`,`rtn`.`type`,`rtn`.`definer`,false));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.SCHEMATA
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`SCHEMATA` AS select (`cat`.`name` collate utf8_tolower_ci) AS `CATALOG_NAME`,(`sch`.`name` collate utf8_tolower_ci) AS `SCHEMA_NAME`,`cs`.`name` AS `DEFAULT_CHARACTER_SET_NAME`,`col`.`name` AS `DEFAULT_COLLATION_NAME`,NULL AS `SQL_PATH`,`sch`.`default_encryption` AS `DEFAULT_ENCRYPTION` from (((`mysql`.`schemata` `sch` join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `col` on((`sch`.`default_collation_id` = `col`.`id`))) join `mysql`.`character_sets` `cs` on((`col`.`character_set_id` = `cs`.`id`))) where (0 <> can_access_database(`sch`.`name`));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.SCHEMA_PRIVILEGES
CREATE TEMPORARY TABLE IF NOT EXISTS `SCHEMA_PRIVILEGES` (
  `GRANTEE` varchar(292) NOT NULL DEFAULT '',
  `TABLE_CATALOG` varchar(512) NOT NULL DEFAULT '',
  `TABLE_SCHEMA` varchar(64) NOT NULL DEFAULT '',
  `PRIVILEGE_TYPE` varchar(64) NOT NULL DEFAULT '',
  `IS_GRANTABLE` varchar(3) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.STATISTICS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`STATISTICS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `TABLE_IF NOT EXISTS CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,if(((`idx`.`type` = 'PRIMARY') or (`idx`.`type` = 'UNIQUE')),0,1) AS `NON_UNIQUE`,(`sch`.`name` collate utf8_tolower_ci) AS `INDEX_SCHEMA`,(`idx`.`name` collate utf8_tolower_ci) AS `INDEX_NAME`,`icu`.`ordinal_position` AS `SEQ_IN_INDEX`,if((`col`.`hidden` = 'SQL'),NULL,(`col`.`name` collate utf8_tolower_ci)) AS `COLUMN_NAME`,(case when (`icu`.`order` = 'DESC') then 'D' when (`icu`.`order` = 'ASC') then 'A' else NULL end) AS `COLLATION`,internal_index_column_cardinality(`sch`.`name`,`tbl`.`name`,`idx`.`name`,`col`.`name`,`idx`.`ordinal_position`,`icu`.`ordinal_position`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,((`tbl`.`hidden` <> 'Visible') or (0 <> `idx`.`hidden`) or (0 <> `icu`.`hidden`)),coalesce(`stat`.`cardinality`,cast(-(1) as unsigned)),coalesce(cast(`stat`.`cached_time` as unsigned),0)) AS `CARDINALITY`,get_dd_index_sub_part_length(`icu`.`length`,`col`.`type`,`col`.`char_length`,`col`.`collation_id`,`idx`.`type`) AS `SUB_PART`,NULL AS `PACKED`,if((`col`.`is_nullable` = 1),'YES','') AS `NULLABLE`,(case when (`idx`.`type` = 'SPATIAL') then 'SPATIAL' when (`idx`.`algorithm` = 'SE_PRIVATE') then '' else `idx`.`algorithm` end) AS `INDEX_TYPE`,if(((`idx`.`type` = 'PRIMARY') or (`idx`.`type` = 'UNIQUE')),'',if(internal_keys_disabled(`tbl`.`options`),'disabled','')) AS `COMMENT`,`idx`.`comment` AS `INDEX_COMMENT`,if(`idx`.`is_visible`,'YES','NO') AS `IS_VISIBLE`,if((`col`.`hidden` = 'SQL'),`col`.`generation_expression_utf8`,NULL) AS `EXPRESSION` from (((((((`mysql`.`index_column_usage` `icu` join `mysql`.`indexes` `idx` on((`idx`.`id` = `icu`.`index_id`))) join `mysql`.`tables` `tbl` on((`idx`.`table_id` = `tbl`.`id`))) join `mysql`.`columns` `col` on((`icu`.`column_id` = `col`.`id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `coll` on((`tbl`.`collation_id` = `coll`.`id`))) left join `mysql`.`index_stats` `stat` on(((`tbl`.`name` = `stat`.`table_name`) and (`sch`.`name` = `stat`.`schema_name`) and (`idx`.`name` = `stat`.`index_name`) and (`col`.`name` = `stat`.`column_name`)))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`,((0 <> `idx`.`hidden`) or (0 <> `icu`.`hidden`)))));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.ST_GEOMETRY_COLUMNS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`ST_GEOMETRY_COLUMNS` AS select `cols`.`TABLE_IF NOT EXISTS CATALOG` AS `TABLE_CATALOG`,`cols`.`TABLE_SCHEMA` AS `TABLE_SCHEMA`,`cols`.`TABLE_NAME` AS `TABLE_NAME`,`cols`.`COLUMN_NAME` AS `COLUMN_NAME`,`srs`.`SRS_NAME` AS `SRS_NAME`,`cols`.`SRS_ID` AS `SRS_ID`,`cols`.`DATA_TYPE` AS `GEOMETRY_TYPE_NAME` from (`information_schema`.`COLUMNS` `cols` left join `information_schema`.`ST_SPATIAL_REFERENCE_SYSTEMS` `srs` on((`cols`.`SRS_ID` = `srs`.`SRS_ID`))) where (`cols`.`DATA_TYPE` in ('geometry','point','linestring','polygon','multipoint','multilinestring','multipolygon','geomcollection'));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.ST_SPATIAL_REFERENCE_SYSTEMS
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`ST_SPATIAL_REFERENCE_SYSTEMS` AS select `mysql`.`st_spatial_reference_systems`.`name` AS `SRS_NAME`,`mysql`.`st_spatial_reference_systems`.`id` AS `SRS_ID`,`mysql`.`st_spatial_reference_systems`.`organization` AS `ORGANIZATION`,`mysql`.`st_spatial_reference_systems`.`organization_coordsys_id` AS `ORGANIZATION_COORDSYS_ID`,`mysql`.`st_spatial_reference_systems`.`definition` AS `DEFINITION`,`mysql`.`st_spatial_reference_systems`.`description` AS `DESCRIPTION` from `mysql`.`st_spatial_reference_systems`;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.ST_UNITS_OF_MEASURE
CREATIF NOT EXISTS E ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`ST_UNITS_OF_MEASURE` AS select `st_units_of_measure`.`UNIT_NAME` AS `UNIT_NAME`,`st_units_of_measure`.`UNIT_TYPE` AS `UNIT_TYPE`,`st_units_of_measure`.`CONVERSION_FACTOR` AS `CONVERSION_FACTOR`,`st_units_of_measure`.`DESCRIPTION` AS `DESCRIPTION` from json_table('[["metre","LINEAR","",1],["millimetre","LINEAR","",0.001],["centimetre","LINEAR","",0.01],["German legal metre","LINEAR","",1.0000135965],["foot","LINEAR","",0.3048],["US survey foot","LINEAR","",0.30480060960121924],["Clarke\'s yard","LINEAR","",0.9143917962],["Clarke\'s foot","LINEAR","",0.3047972654],["British link (Sears 1922 truncated)","LINEAR","",0.20116756],["nautical mile","LINEAR","",1852],["fathom","LINEAR","",1.8288],["US survey chain","LINEAR","",20.11684023368047],["US survey link","LINEAR","",0.2011684023368047],["US survey mile","LINEAR","",1609.3472186944375],["Indian yard","LINEAR","",0.9143985307444408],["kilometre","LINEAR","",1000],["Clarke\'s chain","LINEAR","",20.1166195164],["Clarke\'s link","LINEAR","",0.201166195164],["British yard (Benoit 1895 A)","LINEAR","",0.9143992],["British yard (Sears 1922)","LINEAR","",0.9143984146160287],["British foot (Sears 1922)","LINEAR","",0.3047994715386762],["Gold Coast foot","LINEAR","",0.3047997101815088],["British chain (Sears 1922)","LINEAR","",20.116765121552632],["yard","LINEAR","",0.9144],["British link (Sears 1922)","LINEAR","",0.2011676512155263],["British foot (Benoit 1895 A)","LINEAR","",0.3047997333333333],["Indian foot (1962)","LINEAR","",0.3047996],["British chain (Benoit 1895 A)","LINEAR","",20.1167824],["chain","LINEAR","",20.1168],["British link (Benoit 1895 A)","LINEAR","",0.201167824],["British yard (Benoit 1895 B)","LINEAR","",0.9143992042898124],["British foot (Benoit 1895 B)","LINEAR","",0.30479973476327077],["British chain (Benoit 1895 B)","LINEAR","",20.116782494375872],["British link (Benoit 1895 B)","LINEAR","",0.2011678249437587],["British foot (1865)","LINEAR","",0.30480083333333335],["Indian foot","LINEAR","",0.30479951024814694],["Indian foot (1937)","LINEAR","",0.30479841],["Indian foot (1975)","LINEAR","",0.3047995],["British foot (1936)","LINEAR","",0.3048007491],["Indian yard (1937)","LINEAR","",0.91439523],["Indian yard (1962)","LINEAR","",0.9143988],["Indian yard (1975)","LINEAR","",0.9143985],["Statute mile","LINEAR","",1609.344],["link","LINEAR","",0.201168],["British yard (Sears 1922 truncated)","LINEAR","",0.914398],["British foot (Sears 1922 truncated)","LINEAR","",0.30479933333333337],["British chain (Sears 1922 truncated)","LINEAR","",20.116756]]', '$[*]' columns (UNIT_NAME varchar(255) path '$[0]', UNIT_TYPE varchar(7) path '$[1]', DESCRIPTION varchar(255) path '$[2]', CONVERSION_FACTOR double path '$[3]')) `st_units_of_measure`;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.TABLES
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`TABLESIF NOT EXISTS ` AS select (`cat`.`name` collate utf8_tolower_ci) AS `TABLE_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,`tbl`.`type` AS `TABLE_TYPE`,if((`tbl`.`type` = 'BASE TABLE'),`tbl`.`engine`,NULL) AS `ENGINE`,if((`tbl`.`type` = 'VIEW'),NULL,10) AS `VERSION`,`tbl`.`row_format` AS `ROW_FORMAT`,if((`tbl`.`type` = 'VIEW'),NULL,internal_table_rows(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`table_rows`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `TABLE_ROWS`,if((`tbl`.`type` = 'VIEW'),NULL,internal_avg_row_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`avg_row_length`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `AVG_ROW_LENGTH`,if((`tbl`.`type` = 'VIEW'),NULL,internal_data_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`data_length`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `DATA_LENGTH`,if((`tbl`.`type` = 'VIEW'),NULL,internal_max_data_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`max_data_length`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `MAX_DATA_LENGTH`,if((`tbl`.`type` = 'VIEW'),NULL,internal_index_length(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`index_length`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `INDEX_LENGTH`,if((`tbl`.`type` = 'VIEW'),NULL,internal_data_free(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`data_free`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `DATA_FREE`,if((`tbl`.`type` = 'VIEW'),NULL,internal_auto_increment(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`auto_increment`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0),`tbl`.`se_private_data`)) AS `AUTO_INCREMENT`,`tbl`.`created` AS `CREATE_TIME`,if((`tbl`.`type` = 'VIEW'),NULL,internal_update_time(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(cast(`stat`.`update_time` as unsigned),0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `UPDATE_TIME`,if((`tbl`.`type` = 'VIEW'),NULL,internal_check_time(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(cast(`stat`.`check_time` as unsigned),0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `CHECK_TIME`,`col`.`name` AS `TABLE_COLLATION`,if((`tbl`.`type` = 'VIEW'),NULL,internal_checksum(`sch`.`name`,`tbl`.`name`,if((`tbl`.`partition_type` is null),`tbl`.`engine`,''),`tbl`.`se_private_id`,(`tbl`.`hidden` <> 'Visible'),`ts`.`se_private_data`,coalesce(`stat`.`checksum`,0),coalesce(cast(`stat`.`cached_time` as unsigned),0))) AS `CHECKSUM`,if((`tbl`.`type` = 'VIEW'),NULL,get_dd_create_options(`tbl`.`options`,if((ifnull(`tbl`.`partition_expression`,'NOT_PART_TBL') = 'NOT_PART_TBL'),0,1),if((`sch`.`default_encryption` = 'YES'),1,0))) AS `CREATE_OPTIONS`,internal_get_comment_or_error(`sch`.`name`,`tbl`.`name`,`tbl`.`type`,`tbl`.`options`,`tbl`.`comment`) AS `TABLE_COMMENT` from (((((`mysql`.`tables` `tbl` join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) left join `mysql`.`collations` `col` on((`tbl`.`collation_id` = `col`.`id`))) left join `mysql`.`tablespaces` `ts` on((`tbl`.`tablespace_id` = `ts`.`id`))) left join `mysql`.`table_stats` `stat` on(((`tbl`.`name` = `stat`.`table_name`) and (`sch`.`name` = `stat`.`schema_name`)))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.TABLESPACES
CREATE TEMPORARY TABLE IF NOT EXISTS `TABLESPACES` (
  `TABLESPACE_NAME` varchar(64) NOT NULL DEFAULT '',
  `ENGINE` varchar(64) NOT NULL DEFAULT '',
  `TABLESPACE_TYPE` varchar(64) DEFAULT NULL,
  `LOGFILE_GROUP_NAME` varchar(64) DEFAULT NULL,
  `EXTENT_SIZE` bigint(21) unsigned DEFAULT NULL,
  `AUTOEXTEND_SIZE` bigint(21) unsigned DEFAULT NULL,
  `MAXIMUM_SIZE` bigint(21) unsigned DEFAULT NULL,
  `NODEGROUP_ID` bigint(21) unsigned DEFAULT NULL,
  `TABLESPACE_COMMENT` varchar(2048) DEFAULT NULL
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.TABLE_CONSTRAINTS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`TABLE_IF NOT EXISTS CONSTRAINTS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_SCHEMA`,`idx`.`name` AS `CONSTRAINT_NAME`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,if((`idx`.`type` = 'PRIMARY'),'PRIMARY KEY',`idx`.`type`) AS `CONSTRAINT_TYPE`,'YES' AS `ENFORCED` from (((`mysql`.`indexes` `idx` join `mysql`.`tables` `tbl` on((`idx`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on(((`cat`.`id` = `sch`.`catalog_id`) and (`idx`.`type` in ('PRIMARY','UNIQUE'))))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`,`idx`.`hidden`))) union select (`cat`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_SCHEMA`,(`fk`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_NAME`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,'FOREIGN KEY' AS `CONSTRAINT_TYPE`,'YES' AS `ENFORCED` from (((`mysql`.`foreign_keys` `fk` join `mysql`.`tables` `tbl` on((`fk`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`))) union select (`cat`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `CONSTRAINT_SCHEMA`,`cc`.`name` AS `CONSTRAINT_NAME`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,'CHECK' AS `CONSTRAINT_TYPE`,`cc`.`enforced` AS `ENFORCED` from (((`mysql`.`check_constraints` `cc` join `mysql`.`tables` `tbl` on((`cc`.`table_id` = `tbl`.`id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) where ((0 <> can_access_table(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.TABLE_PRIVILEGES
CREATE TEMPORARY TABLE IF NOT EXISTS `TABLE_PRIVILEGES` (
  `GRANTEE` varchar(292) NOT NULL DEFAULT '',
  `TABLE_CATALOG` varchar(512) NOT NULL DEFAULT '',
  `TABLE_SCHEMA` varchar(64) NOT NULL DEFAULT '',
  `TABLE_NAME` varchar(64) NOT NULL DEFAULT '',
  `PRIVILEGE_TYPE` varchar(64) NOT NULL DEFAULT '',
  `IS_GRANTABLE` varchar(3) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.TRIGGERS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`TRIGGERS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `TRIGGER_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TRIGGER_SCHEMA`,`trg`.`name` AS `TRIGGER_NAME`,`trg`.`event_type` AS `EVENT_MANIPULATION`,(`cat`.`name` collate utf8_tolower_ci) AS `EVENT_OBJECT_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `EVENT_OBJECT_SCHEMA`,(`tbl`.`name` collate utf8_tolower_ci) AS `EVENT_OBJECT_TABLE`IF NOT EXISTS ,`trg`.`action_order` AS `ACTION_ORDER`,NULL AS `ACTION_CONDITION`,`trg`.`action_statement_utf8` AS `ACTION_STATEMENT`,'ROW' AS `ACTION_ORIENTATION`,`trg`.`action_timing` AS `ACTION_TIMING`,NULL AS `ACTION_REFERENCE_OLD_TABLE`,NULL AS `ACTION_REFERENCE_NEW_TABLE`,'OLD' AS `ACTION_REFERENCE_OLD_ROW`,'NEW' AS `ACTION_REFERENCE_NEW_ROW`,`trg`.`created` AS `CREATED`,`trg`.`sql_mode` AS `SQL_MODE`,`trg`.`definer` AS `DEFINER`,`cs_client`.`name` AS `CHARACTER_SET_CLIENT`,`coll_conn`.`name` AS `COLLATION_CONNECTION`,`coll_db`.`name` AS `DATABASE_COLLATION` from (((((((`mysql`.`triggers` `trg` join `mysql`.`tables` `tbl` on((`tbl`.`id` = `trg`.`table_id`))) join `mysql`.`schemata` `sch` on((`tbl`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `coll_client` on((`coll_client`.`id` = `trg`.`client_collation_id`))) join `mysql`.`character_sets` `cs_client` on((`cs_client`.`id` = `coll_client`.`character_set_id`))) join `mysql`.`collations` `coll_conn` on((`coll_conn`.`id` = `trg`.`connection_collation_id`))) join `mysql`.`collations` `coll_db` on((`coll_db`.`id` = `trg`.`schema_collation_id`))) where ((`tbl`.`type` <> 'VIEW') and (0 <> can_access_trigger(`sch`.`name`,`tbl`.`name`)) and (0 <> is_visible_dd_object(`tbl`.`hidden`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.USER_PRIVILEGES
CREATE TEMPORARY TABLE IF NOT EXISTS `USER_PRIVILEGES` (
  `GRANTEE` varchar(292) NOT NULL DEFAULT '',
  `TABLE_CATALOG` varchar(512) NOT NULL DEFAULT '',
  `PRIVILEGE_TYPE` varchar(64) NOT NULL DEFAULT '',
  `IS_GRANTABLE` varchar(3) NOT NULL DEFAULT ''
) ENGINE=MEMORY DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table information_schema.VIEWS
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`VIEWS` AS select (`cat`.`name` collate utf8_tolower_ci) AS `TABLE_IF NOT EXISTS CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`vw`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,if((can_access_view(`sch`.`name`,`vw`.`name`,`vw`.`view_definer`,`vw`.`options`) = true),`vw`.`view_definition_utf8`,'') AS `VIEW_DEFINITION`,`vw`.`view_check_option` AS `CHECK_OPTION`,`vw`.`view_is_updatable` AS `IS_UPDATABLE`,`vw`.`view_definer` AS `DEFINER`,if((`vw`.`view_security_type` = 'DEFAULT'),'DEFINER',`vw`.`view_security_type`) AS `SECURITY_TYPE`,`cs`.`name` AS `CHARACTER_SET_CLIENT`,`conn_coll`.`name` AS `COLLATION_CONNECTION` from (((((`mysql`.`tables` `vw` join `mysql`.`schemata` `sch` on((`vw`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`collations` `conn_coll` on((`conn_coll`.`id` = `vw`.`view_connection_collation_id`))) join `mysql`.`collations` `client_coll` on((`client_coll`.`id` = `vw`.`view_client_collation_id`))) join `mysql`.`character_sets` `cs` on((`cs`.`id` = `client_coll`.`character_set_id`))) where ((0 <> can_access_table(`sch`.`name`,`vw`.`name`)) and (`vw`.`type` = 'VIEW'));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.VIEW_ROUTINE_USAGE
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`VIEW_ROUTINE_USAGE` AS select (`cat`.`name` collate utf8_tolower_ci) AS `TABLE_IF NOT EXISTS CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`vw`.`name` collate utf8_tolower_ci) AS `TABLE_NAME`,(`vru`.`routine_catalog` collate utf8_tolower_ci) AS `SPECIFIC_CATALOG`,(`vru`.`routine_schema` collate utf8_tolower_ci) AS `SPECIFIC_SCHEMA`,`vru`.`routine_name` AS `SPECIFIC_NAME` from ((((`mysql`.`tables` `vw` join `mysql`.`schemata` `sch` on((`vw`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`view_routine_usage` `vru` on((`vru`.`view_id` = `vw`.`id`))) join `mysql`.`routines` `rtn` on(((`vru`.`routine_catalog` = `cat`.`name`) and (`vru`.`routine_schema` = `sch`.`name`) and (`vru`.`routine_name` = `rtn`.`name`)))) where ((`vw`.`type` = 'VIEW') and (0 <> can_access_routine(`vru`.`routine_schema`,`vru`.`routine_name`,`rtn`.`type`,`rtn`.`definer`,false)) and (0 <> can_access_view(`sch`.`name`,`vw`.`name`,`vw`.`view_definer`,`vw`.`options`)));

-- Data exporting was unselected.

-- Dumping structure for table information_schema.VIEW_TABLE_USAGE
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.infoschema`@`localhost` SQL SECURITY DEFINER VIEW `information_schema`.`VIEW_TABLE_IF NOT EXISTS USAGE` AS select (`cat`.`name` collate utf8_tolower_ci) AS `VIEW_CATALOG`,(`sch`.`name` collate utf8_tolower_ci) AS `VIEW_SCHEMA`,(`vw`.`name` collate utf8_tolower_ci) AS `VIEW_NAME`,(`vtu`.`table_catalog` collate utf8_tolower_ci) AS `TABLE_CATALOG`,(`vtu`.`table_schema` collate utf8_tolower_ci) AS `TABLE_SCHEMA`,(`vtu`.`table_name` collate utf8_tolower_ci) AS `TABLE_NAME` from (((`mysql`.`tables` `vw` join `mysql`.`schemata` `sch` on((`vw`.`schema_id` = `sch`.`id`))) join `mysql`.`catalogs` `cat` on((`cat`.`id` = `sch`.`catalog_id`))) join `mysql`.`view_table_usage` `vtu` on((`vtu`.`view_id` = `vw`.`id`))) where ((0 <> can_access_table(`vtu`.`table_schema`,`vtu`.`table_name`)) and (`vw`.`type` = 'VIEW') and (0 <> can_access_view(`sch`.`name`,`vw`.`name`,`vw`.`view_definer`,`vw`.`options`)));

-- Data exporting was unselected.


-- Dumping database structure for mysql
CREATE DATABASE IF NOT EXISTS `mysql` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mysql`;

-- Dumping structure for table mysql.columns_priv
CREATE TABLE IF NOT EXISTS `columns_priv` (
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `Db` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Table_name` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Column_name` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Column_priv` set('Select','Insert','Update','References') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`Host`,`Db`,`User`,`Table_name`,`Column_name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Column privileges';

-- Data exporting was unselected.

-- Dumping structure for table mysql.component
CREATE TABLE IF NOT EXISTS `component` (
  `component_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `component_group_id` int(10) unsigned NOT NULL,
  `component_urn` text NOT NULL,
  PRIMARY KEY (`component_id`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='Components';

-- Data exporting was unselected.

-- Dumping structure for table mysql.db
CREATE TABLE IF NOT EXISTS `db` (
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `Db` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Select_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Insert_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Update_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Delete_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Drop_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Grant_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `References_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Index_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Alter_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_tmp_table_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Lock_tables_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_view_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Show_view_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_routine_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Alter_routine_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Execute_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Event_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Trigger_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  PRIMARY KEY (`Host`,`Db`,`User`),
  KEY `User` (`User`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Database privileges';

-- Data exporting was unselected.

-- Dumping structure for table mysql.default_roles
CREATE TABLE IF NOT EXISTS `default_roles` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `USER` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `DEFAULT_ROLE_HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '%',
  `DEFAULT_ROLE_USER` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`HOST`,`USER`,`DEFAULT_ROLE_HOST`,`DEFAULT_ROLE_USER`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Default roles';

-- Data exporting was unselected.

-- Dumping structure for table mysql.engine_cost
CREATE TABLE IF NOT EXISTS `engine_cost` (
  `engine_name` varchar(64) NOT NULL,
  `device_type` int(11) NOT NULL,
  `cost_name` varchar(64) NOT NULL,
  `cost_value` float DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comment` varchar(1024) DEFAULT NULL,
  `default_value` float GENERATED ALWAYS AS ((case `cost_name` when _utf8mb3'io_block_read_cost' then 1.0 when _utf8mb3'memory_block_read_cost' then 0.25 else NULL end)) VIRTUAL,
  PRIMARY KEY (`cost_name`,`engine_name`,`device_type`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table mysql.func
CREATE TABLE IF NOT EXISTS `func` (
  `name` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `ret` tinyint(1) NOT NULL DEFAULT '0',
  `dl` char(128) COLLATE utf8_bin NOT NULL DEFAULT '',
  `type` enum('function','aggregate') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='User defined functions';

-- Data exporting was unselected.

-- Dumping structure for table mysql.general_log
CREATE TABLE IF NOT EXISTS `general_log` (
  `event_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_host` mediumtext NOT NULL,
  `thread_id` bigint(21) unsigned NOT NULL,
  `server_id` int(10) unsigned NOT NULL,
  `command_type` varchar(64) NOT NULL,
  `argument` mediumblob NOT NULL
) ENGINE=CSV DEFAULT CHARSET=utf8 COMMENT='General log';

-- Data exporting was unselected.

-- Dumping structure for table mysql.global_grants
CREATE TABLE IF NOT EXISTS `global_grants` (
  `USER` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `PRIV` char(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `WITH_GRANT_OPTION` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  PRIMARY KEY (`USER`,`HOST`,`PRIV`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Extended global grants';

-- Data exporting was unselected.

-- Dumping structure for table mysql.gtid_executed
CREATE TABLE IF NOT EXISTS `gtid_executed` (
  `source_uuid` char(36) NOT NULL COMMENT 'uuid of the source where the transaction was originally executed.',
  `interval_start` bigint(20) NOT NULL COMMENT 'First number of interval.',
  `interval_end` bigint(20) NOT NULL COMMENT 'Last number of interval.',
  PRIMARY KEY (`source_uuid`,`interval_start`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table mysql.help_category
CREATE TABLE IF NOT EXISTS `help_category` (
  `help_category_id` smallint(5) unsigned NOT NULL,
  `name` char(64) NOT NULL,
  `parent_category_id` smallint(5) unsigned DEFAULT NULL,
  `url` text NOT NULL,
  PRIMARY KEY (`help_category_id`),
  UNIQUE KEY `name` (`name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='help categories';

-- Data exporting was unselected.

-- Dumping structure for table mysql.help_keyword
CREATE TABLE IF NOT EXISTS `help_keyword` (
  `help_keyword_id` int(10) unsigned NOT NULL,
  `name` char(64) NOT NULL,
  PRIMARY KEY (`help_keyword_id`),
  UNIQUE KEY `name` (`name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='help keywords';

-- Data exporting was unselected.

-- Dumping structure for table mysql.help_relation
CREATE TABLE IF NOT EXISTS `help_relation` (
  `help_topic_id` int(10) unsigned NOT NULL,
  `help_keyword_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`help_keyword_id`,`help_topic_id`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='keyword-topic relation';

-- Data exporting was unselected.

-- Dumping structure for table mysql.help_topic
CREATE TABLE IF NOT EXISTS `help_topic` (
  `help_topic_id` int(10) unsigned NOT NULL,
  `name` char(64) NOT NULL,
  `help_category_id` smallint(5) unsigned NOT NULL,
  `description` text NOT NULL,
  `example` text NOT NULL,
  `url` text NOT NULL,
  PRIMARY KEY (`help_topic_id`),
  UNIQUE KEY `name` (`name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='help topics';

-- Data exporting was unselected.

-- Dumping structure for table mysql.innodb_index_stats
CREATE TABLE IF NOT EXISTS `innodb_index_stats` (
  `database_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `table_name` varchar(199) COLLATE utf8_bin NOT NULL,
  `index_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `stat_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `stat_value` bigint(20) unsigned NOT NULL,
  `sample_size` bigint(20) unsigned DEFAULT NULL,
  `stat_description` varchar(1024) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`database_name`,`table_name`,`index_name`,`stat_name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table mysql.innodb_table_stats
CREATE TABLE IF NOT EXISTS `innodb_table_stats` (
  `database_name` varchar(64) COLLATE utf8_bin NOT NULL,
  `table_name` varchar(199) COLLATE utf8_bin NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `n_rows` bigint(20) unsigned NOT NULL,
  `clustered_index_size` bigint(20) unsigned NOT NULL,
  `sum_of_other_index_sizes` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`database_name`,`table_name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table mysql.password_history
CREATE TABLE IF NOT EXISTS `password_history` (
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Password_timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `Password` text COLLATE utf8_bin,
  PRIMARY KEY (`Host`,`User`,`Password_timestamp` DESC)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Password history for user accounts';

-- Data exporting was unselected.

-- Dumping structure for table mysql.plugin
CREATE TABLE IF NOT EXISTS `plugin` (
  `name` varchar(64) NOT NULL DEFAULT '',
  `dl` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='MySQL plugins';

-- Data exporting was unselected.

-- Dumping structure for table mysql.procs_priv
CREATE TABLE IF NOT EXISTS `procs_priv` (
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `Db` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Routine_name` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `Routine_type` enum('FUNCTION','PROCEDURE') COLLATE utf8_bin NOT NULL,
  `Grantor` varchar(288) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Proc_priv` set('Execute','Alter Routine','Grant') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Host`,`Db`,`User`,`Routine_name`,`Routine_type`),
  KEY `Grantor` (`Grantor`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Procedure privileges';

-- Data exporting was unselected.

-- Dumping structure for table mysql.proxies_priv
CREATE TABLE IF NOT EXISTS `proxies_priv` (
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Proxied_host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `Proxied_user` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `With_grant` tinyint(1) NOT NULL DEFAULT '0',
  `Grantor` varchar(288) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Host`,`User`,`Proxied_host`,`Proxied_user`),
  KEY `Grantor` (`Grantor`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='User proxy privileges';

-- Data exporting was unselected.

-- Dumping structure for table mysql.role_edges
CREATE TABLE IF NOT EXISTS `role_edges` (
  `FROM_HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `FROM_USER` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `TO_HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `TO_USER` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `WITH_ADMIN_OPTION` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  PRIMARY KEY (`FROM_HOST`,`FROM_USER`,`TO_HOST`,`TO_USER`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Role hierarchy and role grants';

-- Data exporting was unselected.

-- Dumping structure for table mysql.servers
CREATE TABLE IF NOT EXISTS `servers` (
  `Server_name` char(64) NOT NULL DEFAULT '',
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `Db` char(64) NOT NULL DEFAULT '',
  `Username` char(64) NOT NULL DEFAULT '',
  `Password` char(64) NOT NULL DEFAULT '',
  `Port` int(4) NOT NULL DEFAULT '0',
  `Socket` char(64) NOT NULL DEFAULT '',
  `Wrapper` char(64) NOT NULL DEFAULT '',
  `Owner` char(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`Server_name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='MySQL Foreign Servers table';

-- Data exporting was unselected.

-- Dumping structure for table mysql.server_cost
CREATE TABLE IF NOT EXISTS `server_cost` (
  `cost_name` varchar(64) NOT NULL,
  `cost_value` float DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comment` varchar(1024) DEFAULT NULL,
  `default_value` float GENERATED ALWAYS AS ((case `cost_name` when _utf8mb3'disk_temptable_create_cost' then 20.0 when _utf8mb3'disk_temptable_row_cost' then 0.5 when _utf8mb3'key_compare_cost' then 0.05 when _utf8mb3'memory_temptable_create_cost' then 1.0 when _utf8mb3'memory_temptable_row_cost' then 0.1 when _utf8mb3'row_evaluate_cost' then 0.1 else NULL end)) VIRTUAL,
  PRIMARY KEY (`cost_name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC;

-- Data exporting was unselected.

-- Dumping structure for table mysql.slave_master_info
CREATE TABLE IF NOT EXISTS `slave_master_info` (
  `Number_of_lines` int(10) unsigned NOT NULL COMMENT 'Number of lines in the file.',
  `Master_log_name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'The name of the master binary log currently being read from the master.',
  `Master_log_pos` bigint(20) unsigned NOT NULL COMMENT 'The master log position of the last read event.',
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL COMMENT 'The host name of the master.',
  `User_name` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The user name used to connect to the master.',
  `User_password` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The password used to connect to the master.',
  `Port` int(10) unsigned NOT NULL COMMENT 'The network port used to connect to the master.',
  `Connect_retry` int(10) unsigned NOT NULL COMMENT 'The period (in seconds) that the slave will wait before trying to reconnect to the master.',
  `Enabled_ssl` tinyint(1) NOT NULL COMMENT 'Indicates whether the server supports SSL connections.',
  `Ssl_ca` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The file used for the Certificate Authority (CA) certificate.',
  `Ssl_capath` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The path to the Certificate Authority (CA) certificates.',
  `Ssl_cert` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The name of the SSL certificate file.',
  `Ssl_cipher` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The name of the cipher in use for the SSL connection.',
  `Ssl_key` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The name of the SSL key file.',
  `Ssl_verify_server_cert` tinyint(1) NOT NULL COMMENT 'Whether to verify the server certificate.',
  `Heartbeat` float NOT NULL,
  `Bind` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'Displays which interface is employed when connecting to the MySQL server',
  `Ignored_server_ids` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The number of server IDs to be ignored, followed by the actual server IDs',
  `Uuid` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The master server uuid.',
  `Retry_count` bigint(20) unsigned NOT NULL COMMENT 'Number of reconnect attempts, to the master, before giving up.',
  `Ssl_crl` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The file used for the Certificate Revocation List (CRL)',
  `Ssl_crlpath` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The path used for Certificate Revocation List (CRL) files',
  `Enabled_auto_position` tinyint(1) NOT NULL COMMENT 'Indicates whether GTIDs will be used to retrieve events from the master.',
  `Channel_name` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'The channel on which the slave is connected to a source. Used in Multisource Replication',
  `Tls_version` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'Tls version',
  `Public_key_path` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'The file containing public key of master server.',
  `Get_public_key` tinyint(1) NOT NULL COMMENT 'Preference to get public key from master.',
  `Network_namespace` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'Network namespace used for communication with the master server.',
  `Master_compression_algorithm` char(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'Compression algorithm supported for data transfer between master and slave.',
  `Master_zstd_compression_level` int(10) unsigned NOT NULL COMMENT 'Compression level associated with zstd compression algorithm.',
  PRIMARY KEY (`Channel_name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Master Information';

-- Data exporting was unselected.

-- Dumping structure for table mysql.slave_relay_log_info
CREATE TABLE IF NOT EXISTS `slave_relay_log_info` (
  `Number_of_lines` int(10) unsigned NOT NULL COMMENT 'Number of lines in the file or rows in the table. Used to version table definitions.',
  `Relay_log_name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'The name of the current relay log file.',
  `Relay_log_pos` bigint(20) unsigned NOT NULL COMMENT 'The relay log position of the last executed event.',
  `Master_log_name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT 'The name of the master binary log file from which the events in the relay log file were read.',
  `Master_log_pos` bigint(20) unsigned NOT NULL COMMENT 'The master log position of the last executed event.',
  `Sql_delay` int(11) NOT NULL COMMENT 'The number of seconds that the slave must lag behind the master.',
  `Number_of_workers` int(10) unsigned NOT NULL,
  `Id` int(10) unsigned NOT NULL COMMENT 'Internal Id that uniquely identifies this record.',
  `Channel_name` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'The channel on which the slave is connected to a source. Used in Multisource Replication',
  `Privilege_checks_username` char(32) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT 'Username part of PRIVILEGE_CHECKS_USER.',
  `Privilege_checks_hostname` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL COMMENT 'Hostname part of PRIVILEGE_CHECKS_USER.',
  PRIMARY KEY (`Channel_name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Relay Log Information';

-- Data exporting was unselected.

-- Dumping structure for table mysql.slave_worker_info
CREATE TABLE IF NOT EXISTS `slave_worker_info` (
  `Id` int(10) unsigned NOT NULL,
  `Relay_log_name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Relay_log_pos` bigint(20) unsigned NOT NULL,
  `Master_log_name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Master_log_pos` bigint(20) unsigned NOT NULL,
  `Checkpoint_relay_log_name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Checkpoint_relay_log_pos` bigint(20) unsigned NOT NULL,
  `Checkpoint_master_log_name` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `Checkpoint_master_log_pos` bigint(20) unsigned NOT NULL,
  `Checkpoint_seqno` int(10) unsigned NOT NULL,
  `Checkpoint_group_size` int(10) unsigned NOT NULL,
  `Checkpoint_group_bitmap` blob NOT NULL,
  `Channel_name` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'The channel on which the slave is connected to a source. Used in Multisource Replication',
  PRIMARY KEY (`Channel_name`,`Id`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Worker Information';

-- Data exporting was unselected.

-- Dumping structure for table mysql.slow_log
CREATE TABLE IF NOT EXISTS `slow_log` (
  `start_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `user_host` mediumtext NOT NULL,
  `query_time` time(6) NOT NULL,
  `lock_time` time(6) NOT NULL,
  `rows_sent` int(11) NOT NULL,
  `rows_examined` int(11) NOT NULL,
  `db` varchar(512) NOT NULL,
  `last_insert_id` int(11) NOT NULL,
  `insert_id` int(11) NOT NULL,
  `server_id` int(10) unsigned NOT NULL,
  `sql_text` mediumblob NOT NULL,
  `thread_id` bigint(21) unsigned NOT NULL
) ENGINE=CSV DEFAULT CHARSET=utf8 COMMENT='Slow log';

-- Data exporting was unselected.

-- Dumping structure for table mysql.tables_priv
CREATE TABLE IF NOT EXISTS `tables_priv` (
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `Db` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Table_name` char(64) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Grantor` varchar(288) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Table_priv` set('Select','Insert','Update','Delete','Create','Drop','Grant','References','Index','Alter','Create View','Show view','Trigger') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `Column_priv` set('Select','Insert','Update','References') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`Host`,`Db`,`User`,`Table_name`),
  KEY `Grantor` (`Grantor`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Table privileges';

-- Data exporting was unselected.

-- Dumping structure for table mysql.time_zone
CREATE TABLE IF NOT EXISTS `time_zone` (
  `Time_zone_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Use_leap_seconds` enum('Y','N') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  PRIMARY KEY (`Time_zone_id`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Time zones';

-- Data exporting was unselected.

-- Dumping structure for table mysql.time_zone_leap_second
CREATE TABLE IF NOT EXISTS `time_zone_leap_second` (
  `Transition_time` bigint(20) NOT NULL,
  `Correction` int(11) NOT NULL,
  PRIMARY KEY (`Transition_time`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Leap seconds information for time zones';

-- Data exporting was unselected.

-- Dumping structure for table mysql.time_zone_name
CREATE TABLE IF NOT EXISTS `time_zone_name` (
  `Name` char(64) NOT NULL,
  `Time_zone_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`Name`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Time zone names';

-- Data exporting was unselected.

-- Dumping structure for table mysql.time_zone_transition
CREATE TABLE IF NOT EXISTS `time_zone_transition` (
  `Time_zone_id` int(10) unsigned NOT NULL,
  `Transition_time` bigint(20) NOT NULL,
  `Transition_type_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`Time_zone_id`,`Transition_time`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Time zone transitions';

-- Data exporting was unselected.

-- Dumping structure for table mysql.time_zone_transition_type
CREATE TABLE IF NOT EXISTS `time_zone_transition_type` (
  `Time_zone_id` int(10) unsigned NOT NULL,
  `Transition_type_id` int(10) unsigned NOT NULL,
  `Offset` int(11) NOT NULL DEFAULT '0',
  `Is_DST` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `Abbreviation` char(8) NOT NULL DEFAULT '',
  PRIMARY KEY (`Time_zone_id`,`Transition_type_id`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Time zone transition types';

-- Data exporting was unselected.

-- Dumping structure for table mysql.user
CREATE TABLE IF NOT EXISTS `user` (
  `Host` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '',
  `User` char(32) COLLATE utf8_bin NOT NULL DEFAULT '',
  `Select_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Insert_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Update_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Delete_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Drop_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Reload_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Shutdown_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Process_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `File_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Grant_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `References_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Index_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Alter_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Show_db_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Super_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_tmp_table_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Lock_tables_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Execute_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Repl_slave_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Repl_client_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_view_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Show_view_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_routine_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Alter_routine_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_user_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Event_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Trigger_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_tablespace_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `ssl_type` enum('','ANY','X509','SPECIFIED') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `ssl_cipher` blob NOT NULL,
  `x509_issuer` blob NOT NULL,
  `x509_subject` blob NOT NULL,
  `max_questions` int(11) unsigned NOT NULL DEFAULT '0',
  `max_updates` int(11) unsigned NOT NULL DEFAULT '0',
  `max_connections` int(11) unsigned NOT NULL DEFAULT '0',
  `max_user_connections` int(11) unsigned NOT NULL DEFAULT '0',
  `plugin` char(64) COLLATE utf8_bin NOT NULL DEFAULT 'caching_sha2_password',
  `authentication_string` text COLLATE utf8_bin,
  `password_expired` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `password_last_changed` timestamp NULL DEFAULT NULL,
  `password_lifetime` smallint(5) unsigned DEFAULT NULL,
  `account_locked` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Create_role_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Drop_role_priv` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `Password_reuse_history` smallint(5) unsigned DEFAULT NULL,
  `Password_reuse_time` smallint(5) unsigned DEFAULT NULL,
  `Password_require_current` enum('N','Y') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `User_attributes` json DEFAULT NULL,
  PRIMARY KEY (`Host`,`User`)
) /*!50100 TABLESPACE `mysql` */ ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin STATS_PERSISTENT=0 ROW_FORMAT=DYNAMIC COMMENT='Users and global privileges';

-- Data exporting was unselected.


-- Dumping database structure for notifies
CREATE DATABASE IF NOT EXISTS `notifies` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `notifies`;

-- Dumping structure for table notifies.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL DEFAULT '',
  `twitch_token` varchar(100) DEFAULT NULL,
  `youtube_token` varchar(250) DEFAULT NULL,
  `profile_img` longtext,
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for procedure notifies.Account_Login
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Account_Login`(
	IN `usernameD` VARCHAR(50)


)
    READS SQL DATA
    DETERMINISTIC
BEGIN
	-- VARIABLE usernameD VARCHAR(30);
	-- VARIABLE ASDF VARCHAR(30);
	-- EXEC :usernameD := 'usernameD_bind1';
	
	SELECT username, email, profile_img, password, twitch_token, youtube_token FROM accounts where username = usernameD;
	-- SELECT * FROM accounts where username = usernameD AND password = passwordD;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.add_channel
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_channel`(
	IN `channelName` VARCHAR(50)



)
    COMMENT 'Adds a channel to get vods from.'
BEGIN
	INSERT into followed_vods(name) values(channelName);
	SELECT * FROM followed_vods;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.Create_Account
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Create_Account`(
	IN `username` VARCHAR(50),
	IN `email` VARCHAR(50),
	IN `password` VARCHAR(100)


)
BEGIN
	INSERT into accounts(username, email, password) values(username, email, password);
END//
DELIMITER ;

-- Dumping structure for table notifies.followed_vods
CREATE TABLE IF NOT EXISTS `followed_vods` (
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Twitch channels to show vods from.';

-- Data exporting was unselected.

-- Dumping structure for procedure notifies.remove_channel
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `remove_channel`(
	IN `channelName` VARCHAR(50)

)
    COMMENT 'Removes a channel to not get vods from anymore.'
BEGIN
	DELETE from followed_vods where name = channelName;
	SELECT * FROM followed_vods;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.show_vod_channels
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_vod_channels`()
    COMMENT 'Show all channels for vods.'
BEGIN
	SELECT * FROM followed_vods;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.Update_ProfileImg
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Update_ProfileImg`(
	IN `img` LONGTEXT,
	IN `p_username` VARCHAR(50),
	IN `p_email` VARCHAR(50)


)
BEGIN
	UPDATE accounts SET profile_img = img WHERE username = p_username AND email = p_email;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.Update_TwitchToken
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Update_TwitchToken`(
	IN `p_username` VARCHAR(50),
	IN `p_email` VARCHAR(50),
	IN `p_twitchToken` VARCHAR(100)


)
    DETERMINISTIC
BEGIN
	UPDATE accounts SET twitch_token = p_twitchToken WHERE username = p_username AND email = p_email;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.Update_YoutubeToken
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Update_YoutubeToken`(
	IN `p_username` VARCHAR(50),
	IN `p_email` VARCHAR(50),
	IN `p_youtubeToken` VARCHAR(250)

)
    DETERMINISTIC
BEGIN
	UPDATE accounts SET youtube_token = p_youtubeToken WHERE username = p_username AND email = p_email;
END//
DELIMITER ;


-- Dumping database structure for performance_schema
CREATE DATABASE IF NOT EXISTS `performance_schema` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `performance_schema`;

-- Dumping structure for table performance_schema.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `CURRENT_CONNECTIONS` bigint(20) NOT NULL,
  `TOTAL_CONNECTIONS` bigint(20) NOT NULL,
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.cond_instances
CREATE TABLE IF NOT EXISTS `cond_instances` (
  `NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `NAME` (`NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.data_locks
CREATE TABLE IF NOT EXISTS `data_locks` (
  `ENGINE` varchar(32) NOT NULL,
  `ENGINE_LOCK_ID` varchar(128) NOT NULL,
  `ENGINE_TRANSACTION_ID` bigint(20) unsigned DEFAULT NULL,
  `THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `PARTITION_NAME` varchar(64) DEFAULT NULL,
  `SUBPARTITION_NAME` varchar(64) DEFAULT NULL,
  `INDEX_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `LOCK_TYPE` varchar(32) NOT NULL,
  `LOCK_MODE` varchar(32) NOT NULL,
  `LOCK_STATUS` varchar(32) NOT NULL,
  `LOCK_DATA` varchar(8192) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`ENGINE_LOCK_ID`,`ENGINE`),
  KEY `ENGINE_TRANSACTION_ID` (`ENGINE_TRANSACTION_ID`,`ENGINE`),
  KEY `THREAD_ID` (`THREAD_ID`,`EVENT_ID`),
  KEY `OBJECT_SCHEMA` (`OBJECT_SCHEMA`,`OBJECT_NAME`,`PARTITION_NAME`,`SUBPARTITION_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.data_lock_waits
CREATE TABLE IF NOT EXISTS `data_lock_waits` (
  `ENGINE` varchar(32) NOT NULL,
  `REQUESTING_ENGINE_LOCK_ID` varchar(128) NOT NULL,
  `REQUESTING_ENGINE_TRANSACTION_ID` bigint(20) unsigned DEFAULT NULL,
  `REQUESTING_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `REQUESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `REQUESTING_OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `BLOCKING_ENGINE_LOCK_ID` varchar(128) NOT NULL,
  `BLOCKING_ENGINE_TRANSACTION_ID` bigint(20) unsigned DEFAULT NULL,
  `BLOCKING_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `BLOCKING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `BLOCKING_OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  KEY `REQUESTING_ENGINE_LOCK_ID` (`REQUESTING_ENGINE_LOCK_ID`,`ENGINE`),
  KEY `BLOCKING_ENGINE_LOCK_ID` (`BLOCKING_ENGINE_LOCK_ID`,`ENGINE`),
  KEY `REQUESTING_ENGINE_TRANSACTION_ID` (`REQUESTING_ENGINE_TRANSACTION_ID`,`ENGINE`),
  KEY `BLOCKING_ENGINE_TRANSACTION_ID` (`BLOCKING_ENGINE_TRANSACTION_ID`,`ENGINE`),
  KEY `REQUESTING_THREAD_ID` (`REQUESTING_THREAD_ID`,`REQUESTING_EVENT_ID`),
  KEY `BLOCKING_THREAD_ID` (`BLOCKING_THREAD_ID`,`BLOCKING_EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_errors_summary_by_account_by_error
CREATE TABLE IF NOT EXISTS `events_errors_summary_by_account_by_error` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `ERROR_NUMBER` int(11) DEFAULT NULL,
  `ERROR_NAME` varchar(64) DEFAULT NULL,
  `SQL_STATE` varchar(5) DEFAULT NULL,
  `SUM_ERROR_RAISED` bigint(20) unsigned NOT NULL,
  `SUM_ERROR_HANDLED` bigint(20) unsigned NOT NULL,
  `FIRST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `LAST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`,`ERROR_NUMBER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_errors_summary_by_host_by_error
CREATE TABLE IF NOT EXISTS `events_errors_summary_by_host_by_error` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `ERROR_NUMBER` int(11) DEFAULT NULL,
  `ERROR_NAME` varchar(64) DEFAULT NULL,
  `SQL_STATE` varchar(5) DEFAULT NULL,
  `SUM_ERROR_RAISED` bigint(20) unsigned NOT NULL,
  `SUM_ERROR_HANDLED` bigint(20) unsigned NOT NULL,
  `FIRST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `LAST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE KEY `HOST` (`HOST`,`ERROR_NUMBER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_errors_summary_by_thread_by_error
CREATE TABLE IF NOT EXISTS `events_errors_summary_by_thread_by_error` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `ERROR_NUMBER` int(11) DEFAULT NULL,
  `ERROR_NAME` varchar(64) DEFAULT NULL,
  `SQL_STATE` varchar(5) DEFAULT NULL,
  `SUM_ERROR_RAISED` bigint(20) unsigned NOT NULL,
  `SUM_ERROR_HANDLED` bigint(20) unsigned NOT NULL,
  `FIRST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `LAST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE KEY `THREAD_ID` (`THREAD_ID`,`ERROR_NUMBER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_errors_summary_by_user_by_error
CREATE TABLE IF NOT EXISTS `events_errors_summary_by_user_by_error` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ERROR_NUMBER` int(11) DEFAULT NULL,
  `ERROR_NAME` varchar(64) DEFAULT NULL,
  `SQL_STATE` varchar(5) DEFAULT NULL,
  `SUM_ERROR_RAISED` bigint(20) unsigned NOT NULL,
  `SUM_ERROR_HANDLED` bigint(20) unsigned NOT NULL,
  `FIRST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `LAST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE KEY `USER` (`USER`,`ERROR_NUMBER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_errors_summary_global_by_error
CREATE TABLE IF NOT EXISTS `events_errors_summary_global_by_error` (
  `ERROR_NUMBER` int(11) DEFAULT NULL,
  `ERROR_NAME` varchar(64) DEFAULT NULL,
  `SQL_STATE` varchar(5) DEFAULT NULL,
  `SUM_ERROR_RAISED` bigint(20) unsigned NOT NULL,
  `SUM_ERROR_HANDLED` bigint(20) unsigned NOT NULL,
  `FIRST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `LAST_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  UNIQUE KEY `ERROR_NUMBER` (`ERROR_NUMBER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_current
CREATE TABLE IF NOT EXISTS `events_stages_current` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `WORK_COMPLETED` bigint(20) unsigned DEFAULT NULL,
  `WORK_ESTIMATED` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_history
CREATE TABLE IF NOT EXISTS `events_stages_history` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `WORK_COMPLETED` bigint(20) unsigned DEFAULT NULL,
  `WORK_ESTIMATED` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_history_long
CREATE TABLE IF NOT EXISTS `events_stages_history_long` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `WORK_COMPLETED` bigint(20) unsigned DEFAULT NULL,
  `WORK_ESTIMATED` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_summary_by_account_by_event_name
CREATE TABLE IF NOT EXISTS `events_stages_summary_by_account_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_summary_by_host_by_event_name
CREATE TABLE IF NOT EXISTS `events_stages_summary_by_host_by_event_name` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `HOST` (`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_summary_by_thread_by_event_name
CREATE TABLE IF NOT EXISTS `events_stages_summary_by_thread_by_event_name` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_summary_by_user_by_event_name
CREATE TABLE IF NOT EXISTS `events_stages_summary_by_user_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `USER` (`USER`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_stages_summary_global_by_event_name
CREATE TABLE IF NOT EXISTS `events_stages_summary_global_by_event_name` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_current
CREATE TABLE IF NOT EXISTS `events_statements_current` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SQL_TEXT` longtext,
  `DIGEST` varchar(64) DEFAULT NULL,
  `DIGEST_TEXT` longtext,
  `CURRENT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned DEFAULT NULL,
  `MYSQL_ERRNO` int(11) DEFAULT NULL,
  `RETURNED_SQLSTATE` varchar(5) DEFAULT NULL,
  `MESSAGE_TEXT` varchar(128) DEFAULT NULL,
  `ERRORS` bigint(20) unsigned NOT NULL,
  `WARNINGS` bigint(20) unsigned NOT NULL,
  `ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `ROWS_SENT` bigint(20) unsigned NOT NULL,
  `ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SORT_SCAN` bigint(20) unsigned NOT NULL,
  `NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  `NESTING_EVENT_LEVEL` int(11) DEFAULT NULL,
  `STATEMENT_ID` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_histogram_by_digest
CREATE TABLE IF NOT EXISTS `events_statements_histogram_by_digest` (
  `SCHEMA_NAME` varchar(64) DEFAULT NULL,
  `DIGEST` varchar(64) DEFAULT NULL,
  `BUCKET_NUMBER` int(10) unsigned NOT NULL,
  `BUCKET_TIMER_LOW` bigint(20) unsigned NOT NULL,
  `BUCKET_TIMER_HIGH` bigint(20) unsigned NOT NULL,
  `COUNT_BUCKET` bigint(20) unsigned NOT NULL,
  `COUNT_BUCKET_AND_LOWER` bigint(20) unsigned NOT NULL,
  `BUCKET_QUANTILE` double(7,6) NOT NULL,
  UNIQUE KEY `SCHEMA_NAME` (`SCHEMA_NAME`,`DIGEST`,`BUCKET_NUMBER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_histogram_global
CREATE TABLE IF NOT EXISTS `events_statements_histogram_global` (
  `BUCKET_NUMBER` int(10) unsigned NOT NULL,
  `BUCKET_TIMER_LOW` bigint(20) unsigned NOT NULL,
  `BUCKET_TIMER_HIGH` bigint(20) unsigned NOT NULL,
  `COUNT_BUCKET` bigint(20) unsigned NOT NULL,
  `COUNT_BUCKET_AND_LOWER` bigint(20) unsigned NOT NULL,
  `BUCKET_QUANTILE` double(7,6) NOT NULL,
  PRIMARY KEY (`BUCKET_NUMBER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_history
CREATE TABLE IF NOT EXISTS `events_statements_history` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SQL_TEXT` longtext,
  `DIGEST` varchar(64) DEFAULT NULL,
  `DIGEST_TEXT` longtext,
  `CURRENT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned DEFAULT NULL,
  `MYSQL_ERRNO` int(11) DEFAULT NULL,
  `RETURNED_SQLSTATE` varchar(5) DEFAULT NULL,
  `MESSAGE_TEXT` varchar(128) DEFAULT NULL,
  `ERRORS` bigint(20) unsigned NOT NULL,
  `WARNINGS` bigint(20) unsigned NOT NULL,
  `ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `ROWS_SENT` bigint(20) unsigned NOT NULL,
  `ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SORT_SCAN` bigint(20) unsigned NOT NULL,
  `NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  `NESTING_EVENT_LEVEL` int(11) DEFAULT NULL,
  `STATEMENT_ID` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_history_long
CREATE TABLE IF NOT EXISTS `events_statements_history_long` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SQL_TEXT` longtext,
  `DIGEST` varchar(64) DEFAULT NULL,
  `DIGEST_TEXT` longtext,
  `CURRENT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned DEFAULT NULL,
  `MYSQL_ERRNO` int(11) DEFAULT NULL,
  `RETURNED_SQLSTATE` varchar(5) DEFAULT NULL,
  `MESSAGE_TEXT` varchar(128) DEFAULT NULL,
  `ERRORS` bigint(20) unsigned NOT NULL,
  `WARNINGS` bigint(20) unsigned NOT NULL,
  `ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `ROWS_SENT` bigint(20) unsigned NOT NULL,
  `ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SORT_SCAN` bigint(20) unsigned NOT NULL,
  `NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  `NESTING_EVENT_LEVEL` int(11) DEFAULT NULL,
  `STATEMENT_ID` bigint(20) unsigned DEFAULT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_summary_by_account_by_event_name
CREATE TABLE IF NOT EXISTS `events_statements_summary_by_account_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_summary_by_digest
CREATE TABLE IF NOT EXISTS `events_statements_summary_by_digest` (
  `SCHEMA_NAME` varchar(64) DEFAULT NULL,
  `DIGEST` varchar(64) DEFAULT NULL,
  `DIGEST_TEXT` longtext,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  `FIRST_SEEN` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `LAST_SEEN` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `QUANTILE_95` bigint(20) unsigned NOT NULL,
  `QUANTILE_99` bigint(20) unsigned NOT NULL,
  `QUANTILE_999` bigint(20) unsigned NOT NULL,
  `QUERY_SAMPLE_TEXT` longtext,
  `QUERY_SAMPLE_SEEN` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `QUERY_SAMPLE_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `SCHEMA_NAME` (`SCHEMA_NAME`,`DIGEST`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_summary_by_host_by_event_name
CREATE TABLE IF NOT EXISTS `events_statements_summary_by_host_by_event_name` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `HOST` (`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_summary_by_program
CREATE TABLE IF NOT EXISTS `events_statements_summary_by_program` (
  `OBJECT_TYPE` enum('EVENT','FUNCTION','PROCEDURE','TABLE','TRIGGER') NOT NULL,
  `OBJECT_SCHEMA` varchar(64) NOT NULL,
  `OBJECT_NAME` varchar(64) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_STATEMENTS` bigint(20) unsigned NOT NULL,
  `SUM_STATEMENTS_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_STATEMENTS_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_STATEMENTS_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_STATEMENTS_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_summary_by_thread_by_event_name
CREATE TABLE IF NOT EXISTS `events_statements_summary_by_thread_by_event_name` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_summary_by_user_by_event_name
CREATE TABLE IF NOT EXISTS `events_statements_summary_by_user_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `USER` (`USER`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_statements_summary_global_by_event_name
CREATE TABLE IF NOT EXISTS `events_statements_summary_global_by_event_name` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_current
CREATE TABLE IF NOT EXISTS `events_transactions_current` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `STATE` enum('ACTIVE','COMMITTED','ROLLED BACK') DEFAULT NULL,
  `TRX_ID` bigint(20) unsigned DEFAULT NULL,
  `GTID` varchar(64) DEFAULT NULL,
  `XID_FORMAT_ID` int(11) DEFAULT NULL,
  `XID_GTRID` varchar(130) DEFAULT NULL,
  `XID_BQUAL` varchar(130) DEFAULT NULL,
  `XA_STATE` varchar(64) DEFAULT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `ACCESS_MODE` enum('READ ONLY','READ WRITE') DEFAULT NULL,
  `ISOLATION_LEVEL` varchar(64) DEFAULT NULL,
  `AUTOCOMMIT` enum('YES','NO') NOT NULL,
  `NUMBER_OF_SAVEPOINTS` bigint(20) unsigned DEFAULT NULL,
  `NUMBER_OF_ROLLBACK_TO_SAVEPOINT` bigint(20) unsigned DEFAULT NULL,
  `NUMBER_OF_RELEASE_SAVEPOINT` bigint(20) unsigned DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_history
CREATE TABLE IF NOT EXISTS `events_transactions_history` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `STATE` enum('ACTIVE','COMMITTED','ROLLED BACK') DEFAULT NULL,
  `TRX_ID` bigint(20) unsigned DEFAULT NULL,
  `GTID` varchar(64) DEFAULT NULL,
  `XID_FORMAT_ID` int(11) DEFAULT NULL,
  `XID_GTRID` varchar(130) DEFAULT NULL,
  `XID_BQUAL` varchar(130) DEFAULT NULL,
  `XA_STATE` varchar(64) DEFAULT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `ACCESS_MODE` enum('READ ONLY','READ WRITE') DEFAULT NULL,
  `ISOLATION_LEVEL` varchar(64) DEFAULT NULL,
  `AUTOCOMMIT` enum('YES','NO') NOT NULL,
  `NUMBER_OF_SAVEPOINTS` bigint(20) unsigned DEFAULT NULL,
  `NUMBER_OF_ROLLBACK_TO_SAVEPOINT` bigint(20) unsigned DEFAULT NULL,
  `NUMBER_OF_RELEASE_SAVEPOINT` bigint(20) unsigned DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_history_long
CREATE TABLE IF NOT EXISTS `events_transactions_history_long` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `STATE` enum('ACTIVE','COMMITTED','ROLLED BACK') DEFAULT NULL,
  `TRX_ID` bigint(20) unsigned DEFAULT NULL,
  `GTID` varchar(64) DEFAULT NULL,
  `XID_FORMAT_ID` int(11) DEFAULT NULL,
  `XID_GTRID` varchar(130) DEFAULT NULL,
  `XID_BQUAL` varchar(130) DEFAULT NULL,
  `XA_STATE` varchar(64) DEFAULT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `ACCESS_MODE` enum('READ ONLY','READ WRITE') DEFAULT NULL,
  `ISOLATION_LEVEL` varchar(64) DEFAULT NULL,
  `AUTOCOMMIT` enum('YES','NO') NOT NULL,
  `NUMBER_OF_SAVEPOINTS` bigint(20) unsigned DEFAULT NULL,
  `NUMBER_OF_ROLLBACK_TO_SAVEPOINT` bigint(20) unsigned DEFAULT NULL,
  `NUMBER_OF_RELEASE_SAVEPOINT` bigint(20) unsigned DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_summary_by_account_by_event_name
CREATE TABLE IF NOT EXISTS `events_transactions_summary_by_account_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_READ_ONLY` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_summary_by_host_by_event_name
CREATE TABLE IF NOT EXISTS `events_transactions_summary_by_host_by_event_name` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_READ_ONLY` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `HOST` (`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_summary_by_thread_by_event_name
CREATE TABLE IF NOT EXISTS `events_transactions_summary_by_thread_by_event_name` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_READ_ONLY` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_summary_by_user_by_event_name
CREATE TABLE IF NOT EXISTS `events_transactions_summary_by_user_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_READ_ONLY` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `USER` (`USER`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_transactions_summary_global_by_event_name
CREATE TABLE IF NOT EXISTS `events_transactions_summary_global_by_event_name` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_READ_ONLY` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_ONLY` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_current
CREATE TABLE IF NOT EXISTS `events_waits_current` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `SPINS` int(10) unsigned DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(512) DEFAULT NULL,
  `INDEX_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  `OPERATION` varchar(32) NOT NULL,
  `NUMBER_OF_BYTES` bigint(20) DEFAULT NULL,
  `FLAGS` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_history
CREATE TABLE IF NOT EXISTS `events_waits_history` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `SPINS` int(10) unsigned DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(512) DEFAULT NULL,
  `INDEX_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  `OPERATION` varchar(32) NOT NULL,
  `NUMBER_OF_BYTES` bigint(20) DEFAULT NULL,
  `FLAGS` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_history_long
CREATE TABLE IF NOT EXISTS `events_waits_history_long` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_ID` bigint(20) unsigned NOT NULL,
  `END_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `TIMER_START` bigint(20) unsigned DEFAULT NULL,
  `TIMER_END` bigint(20) unsigned DEFAULT NULL,
  `TIMER_WAIT` bigint(20) unsigned DEFAULT NULL,
  `SPINS` int(10) unsigned DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(512) DEFAULT NULL,
  `INDEX_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `NESTING_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `NESTING_EVENT_TYPE` enum('TRANSACTION','STATEMENT','STAGE','WAIT') DEFAULT NULL,
  `OPERATION` varchar(32) NOT NULL,
  `NUMBER_OF_BYTES` bigint(20) DEFAULT NULL,
  `FLAGS` int(10) unsigned DEFAULT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_summary_by_account_by_event_name
CREATE TABLE IF NOT EXISTS `events_waits_summary_by_account_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_summary_by_host_by_event_name
CREATE TABLE IF NOT EXISTS `events_waits_summary_by_host_by_event_name` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `HOST` (`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_summary_by_instance
CREATE TABLE IF NOT EXISTS `events_waits_summary_by_instance` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `EVENT_NAME` (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_summary_by_thread_by_event_name
CREATE TABLE IF NOT EXISTS `events_waits_summary_by_thread_by_event_name` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_summary_by_user_by_event_name
CREATE TABLE IF NOT EXISTS `events_waits_summary_by_user_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `USER` (`USER`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.events_waits_summary_global_by_event_name
CREATE TABLE IF NOT EXISTS `events_waits_summary_global_by_event_name` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.file_instances
CREATE TABLE IF NOT EXISTS `file_instances` (
  `FILE_NAME` varchar(512) NOT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `OPEN_COUNT` int(10) unsigned NOT NULL,
  PRIMARY KEY (`FILE_NAME`),
  KEY `EVENT_NAME` (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.file_summary_by_event_name
CREATE TABLE IF NOT EXISTS `file_summary_by_event_name` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_READ` bigint(20) NOT NULL,
  `COUNT_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_WRITE` bigint(20) NOT NULL,
  `COUNT_MISC` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_MISC` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.file_summary_by_instance
CREATE TABLE IF NOT EXISTS `file_summary_by_instance` (
  `FILE_NAME` varchar(512) NOT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_READ` bigint(20) NOT NULL,
  `COUNT_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_WRITE` bigint(20) NOT NULL,
  `COUNT_MISC` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_MISC` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `FILE_NAME` (`FILE_NAME`),
  KEY `EVENT_NAME` (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.global_status
CREATE TABLE IF NOT EXISTS `global_status` (
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.global_variables
CREATE TABLE IF NOT EXISTS `global_variables` (
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.hosts
CREATE TABLE IF NOT EXISTS `hosts` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `CURRENT_CONNECTIONS` bigint(20) NOT NULL,
  `TOTAL_CONNECTIONS` bigint(20) NOT NULL,
  UNIQUE KEY `HOST` (`HOST`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.host_cache
CREATE TABLE IF NOT EXISTS `host_cache` (
  `IP` varchar(64) NOT NULL,
  `HOST` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `HOST_VALIDATED` enum('YES','NO') NOT NULL,
  `SUM_CONNECT_ERRORS` bigint(20) NOT NULL,
  `COUNT_HOST_BLOCKED_ERRORS` bigint(20) NOT NULL,
  `COUNT_NAMEINFO_TRANSIENT_ERRORS` bigint(20) NOT NULL,
  `COUNT_NAMEINFO_PERMANENT_ERRORS` bigint(20) NOT NULL,
  `COUNT_FORMAT_ERRORS` bigint(20) NOT NULL,
  `COUNT_ADDRINFO_TRANSIENT_ERRORS` bigint(20) NOT NULL,
  `COUNT_ADDRINFO_PERMANENT_ERRORS` bigint(20) NOT NULL,
  `COUNT_FCRDNS_ERRORS` bigint(20) NOT NULL,
  `COUNT_HOST_ACL_ERRORS` bigint(20) NOT NULL,
  `COUNT_NO_AUTH_PLUGIN_ERRORS` bigint(20) NOT NULL,
  `COUNT_AUTH_PLUGIN_ERRORS` bigint(20) NOT NULL,
  `COUNT_HANDSHAKE_ERRORS` bigint(20) NOT NULL,
  `COUNT_PROXY_USER_ERRORS` bigint(20) NOT NULL,
  `COUNT_PROXY_USER_ACL_ERRORS` bigint(20) NOT NULL,
  `COUNT_AUTHENTICATION_ERRORS` bigint(20) NOT NULL,
  `COUNT_SSL_ERRORS` bigint(20) NOT NULL,
  `COUNT_MAX_USER_CONNECTIONS_ERRORS` bigint(20) NOT NULL,
  `COUNT_MAX_USER_CONNECTIONS_PER_HOUR_ERRORS` bigint(20) NOT NULL,
  `COUNT_DEFAULT_DATABASE_ERRORS` bigint(20) NOT NULL,
  `COUNT_INIT_CONNECT_ERRORS` bigint(20) NOT NULL,
  `COUNT_LOCAL_ERRORS` bigint(20) NOT NULL,
  `COUNT_UNKNOWN_ERRORS` bigint(20) NOT NULL,
  `FIRST_SEEN` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `LAST_SEEN` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `FIRST_ERROR_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  `LAST_ERROR_SEEN` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`IP`),
  KEY `HOST` (`HOST`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.keyring_keys
CREATE TABLE IF NOT EXISTS `keyring_keys` (
  `KEY_ID` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `KEY_OWNER` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `BACKEND_KEY_ID` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.log_status
CREATE TABLE IF NOT EXISTS `log_status` (
  `SERVER_UUID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `LOCAL` json NOT NULL,
  `REPLICATION` json NOT NULL,
  `STORAGE_ENGINES` json NOT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.memory_summary_by_account_by_event_name
CREATE TABLE IF NOT EXISTS `memory_summary_by_account_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_ALLOC` bigint(20) unsigned NOT NULL,
  `COUNT_FREE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_ALLOC` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_FREE` bigint(20) unsigned NOT NULL,
  `LOW_COUNT_USED` bigint(20) NOT NULL,
  `CURRENT_COUNT_USED` bigint(20) NOT NULL,
  `HIGH_COUNT_USED` bigint(20) NOT NULL,
  `LOW_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `CURRENT_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `HIGH_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.memory_summary_by_host_by_event_name
CREATE TABLE IF NOT EXISTS `memory_summary_by_host_by_event_name` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_ALLOC` bigint(20) unsigned NOT NULL,
  `COUNT_FREE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_ALLOC` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_FREE` bigint(20) unsigned NOT NULL,
  `LOW_COUNT_USED` bigint(20) NOT NULL,
  `CURRENT_COUNT_USED` bigint(20) NOT NULL,
  `HIGH_COUNT_USED` bigint(20) NOT NULL,
  `LOW_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `CURRENT_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `HIGH_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  UNIQUE KEY `HOST` (`HOST`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.memory_summary_by_thread_by_event_name
CREATE TABLE IF NOT EXISTS `memory_summary_by_thread_by_event_name` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_ALLOC` bigint(20) unsigned NOT NULL,
  `COUNT_FREE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_ALLOC` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_FREE` bigint(20) unsigned NOT NULL,
  `LOW_COUNT_USED` bigint(20) NOT NULL,
  `CURRENT_COUNT_USED` bigint(20) NOT NULL,
  `HIGH_COUNT_USED` bigint(20) NOT NULL,
  `LOW_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `CURRENT_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `HIGH_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  PRIMARY KEY (`THREAD_ID`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.memory_summary_by_user_by_event_name
CREATE TABLE IF NOT EXISTS `memory_summary_by_user_by_event_name` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_ALLOC` bigint(20) unsigned NOT NULL,
  `COUNT_FREE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_ALLOC` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_FREE` bigint(20) unsigned NOT NULL,
  `LOW_COUNT_USED` bigint(20) NOT NULL,
  `CURRENT_COUNT_USED` bigint(20) NOT NULL,
  `HIGH_COUNT_USED` bigint(20) NOT NULL,
  `LOW_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `CURRENT_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `HIGH_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  UNIQUE KEY `USER` (`USER`,`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.memory_summary_global_by_event_name
CREATE TABLE IF NOT EXISTS `memory_summary_global_by_event_name` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_ALLOC` bigint(20) unsigned NOT NULL,
  `COUNT_FREE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_ALLOC` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_FREE` bigint(20) unsigned NOT NULL,
  `LOW_COUNT_USED` bigint(20) NOT NULL,
  `CURRENT_COUNT_USED` bigint(20) NOT NULL,
  `HIGH_COUNT_USED` bigint(20) NOT NULL,
  `LOW_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `CURRENT_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  `HIGH_NUMBER_OF_BYTES_USED` bigint(20) NOT NULL,
  PRIMARY KEY (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.metadata_locks
CREATE TABLE IF NOT EXISTS `metadata_locks` (
  `OBJECT_TYPE` varchar(64) NOT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `COLUMN_NAME` varchar(64) DEFAULT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `LOCK_TYPE` varchar(32) NOT NULL,
  `LOCK_DURATION` varchar(32) NOT NULL,
  `LOCK_STATUS` varchar(32) NOT NULL,
  `SOURCE` varchar(64) DEFAULT NULL,
  `OWNER_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `OWNER_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `OBJECT_TYPE` (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`,`COLUMN_NAME`),
  KEY `OWNER_THREAD_ID` (`OWNER_THREAD_ID`,`OWNER_EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.mutex_instances
CREATE TABLE IF NOT EXISTS `mutex_instances` (
  `NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `LOCKED_BY_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `NAME` (`NAME`),
  KEY `LOCKED_BY_THREAD_ID` (`LOCKED_BY_THREAD_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.objects_summary_global_by_type
CREATE TABLE IF NOT EXISTS `objects_summary_global_by_type` (
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `OBJECT` (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.performance_timers
CREATE TABLE IF NOT EXISTS `performance_timers` (
  `TIMER_NAME` enum('CYCLE','NANOSECOND','MICROSECOND','MILLISECOND') NOT NULL,
  `TIMER_FREQUENCY` bigint(20) DEFAULT NULL,
  `TIMER_RESOLUTION` bigint(20) DEFAULT NULL,
  `TIMER_OVERHEAD` bigint(20) DEFAULT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.persisted_variables
CREATE TABLE IF NOT EXISTS `persisted_variables` (
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.prepared_statements_instances
CREATE TABLE IF NOT EXISTS `prepared_statements_instances` (
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `STATEMENT_ID` bigint(20) unsigned NOT NULL,
  `STATEMENT_NAME` varchar(64) DEFAULT NULL,
  `SQL_TEXT` longtext NOT NULL,
  `OWNER_THREAD_ID` bigint(20) unsigned NOT NULL,
  `OWNER_EVENT_ID` bigint(20) unsigned NOT NULL,
  `OWNER_OBJECT_TYPE` enum('EVENT','FUNCTION','PROCEDURE','TABLE','TRIGGER') DEFAULT NULL,
  `OWNER_OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OWNER_OBJECT_NAME` varchar(64) DEFAULT NULL,
  `TIMER_PREPARE` bigint(20) unsigned NOT NULL,
  `COUNT_REPREPARE` bigint(20) unsigned NOT NULL,
  `COUNT_EXECUTE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_EXECUTE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_EXECUTE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_EXECUTE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_EXECUTE` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  UNIQUE KEY `OWNER_THREAD_ID` (`OWNER_THREAD_ID`,`OWNER_EVENT_ID`),
  KEY `STATEMENT_ID` (`STATEMENT_ID`),
  KEY `STATEMENT_NAME` (`STATEMENT_NAME`),
  KEY `OWNER_OBJECT_TYPE` (`OWNER_OBJECT_TYPE`,`OWNER_OBJECT_SCHEMA`,`OWNER_OBJECT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_applier_configuration
CREATE TABLE IF NOT EXISTS `replication_applier_configuration` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `DESIRED_DELAY` int(11) NOT NULL,
  `PRIVILEGE_CHECKS_USER` text CHARACTER SET utf8 COLLATE utf8_bin COMMENT 'User name for the security context of the applier.',
  PRIMARY KEY (`CHANNEL_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_applier_filters
CREATE TABLE IF NOT EXISTS `replication_applier_filters` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `FILTER_NAME` char(64) NOT NULL,
  `FILTER_RULE` longtext NOT NULL,
  `CONFIGURED_BY` enum('STARTUP_OPTIONS','CHANGE_REPLICATION_FILTER','STARTUP_OPTIONS_FOR_CHANNEL','CHANGE_REPLICATION_FILTER_FOR_CHANNEL') NOT NULL,
  `ACTIVE_SINCE` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `COUNTER` bigint(20) unsigned NOT NULL DEFAULT '0'
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_applier_global_filters
CREATE TABLE IF NOT EXISTS `replication_applier_global_filters` (
  `FILTER_NAME` char(64) NOT NULL,
  `FILTER_RULE` longtext NOT NULL,
  `CONFIGURED_BY` enum('STARTUP_OPTIONS','CHANGE_REPLICATION_FILTER') NOT NULL,
  `ACTIVE_SINCE` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000'
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_applier_status
CREATE TABLE IF NOT EXISTS `replication_applier_status` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `SERVICE_STATE` enum('ON','OFF') NOT NULL,
  `REMAINING_DELAY` int(10) unsigned DEFAULT NULL,
  `COUNT_TRANSACTIONS_RETRIES` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`CHANNEL_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_applier_status_by_coordinator
CREATE TABLE IF NOT EXISTS `replication_applier_status_by_coordinator` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `SERVICE_STATE` enum('ON','OFF') NOT NULL,
  `LAST_ERROR_NUMBER` int(11) NOT NULL,
  `LAST_ERROR_MESSAGE` varchar(1024) NOT NULL,
  `LAST_ERROR_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_PROCESSED_TRANSACTION` char(57) DEFAULT NULL,
  `LAST_PROCESSED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_PROCESSED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_PROCESSED_TRANSACTION_START_BUFFER_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_PROCESSED_TRANSACTION_END_BUFFER_TIMESTAMP` timestamp(6) NOT NULL,
  `PROCESSING_TRANSACTION` char(57) DEFAULT NULL,
  `PROCESSING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `PROCESSING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `PROCESSING_TRANSACTION_START_BUFFER_TIMESTAMP` timestamp(6) NOT NULL,
  PRIMARY KEY (`CHANNEL_NAME`),
  KEY `THREAD_ID` (`THREAD_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_applier_status_by_worker
CREATE TABLE IF NOT EXISTS `replication_applier_status_by_worker` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `WORKER_ID` bigint(20) unsigned NOT NULL,
  `THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `SERVICE_STATE` enum('ON','OFF') NOT NULL,
  `LAST_ERROR_NUMBER` int(11) NOT NULL,
  `LAST_ERROR_MESSAGE` varchar(1024) NOT NULL,
  `LAST_ERROR_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_APPLIED_TRANSACTION` char(57) DEFAULT NULL,
  `LAST_APPLIED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_APPLIED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_APPLIED_TRANSACTION_START_APPLY_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_APPLIED_TRANSACTION_END_APPLY_TIMESTAMP` timestamp(6) NOT NULL,
  `APPLYING_TRANSACTION` char(57) DEFAULT NULL,
  `APPLYING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `APPLYING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `APPLYING_TRANSACTION_START_APPLY_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_APPLIED_TRANSACTION_RETRIES_COUNT` bigint(20) unsigned NOT NULL,
  `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER` int(11) NOT NULL,
  `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE` varchar(1024) DEFAULT NULL,
  `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP` timestamp(6) NOT NULL,
  `APPLYING_TRANSACTION_RETRIES_COUNT` bigint(20) unsigned NOT NULL,
  `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER` int(11) NOT NULL,
  `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE` varchar(1024) DEFAULT NULL,
  `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP` timestamp(6) NOT NULL,
  PRIMARY KEY (`CHANNEL_NAME`,`WORKER_ID`),
  KEY `THREAD_ID` (`THREAD_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_connection_configuration
CREATE TABLE IF NOT EXISTS `replication_connection_configuration` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `PORT` int(11) NOT NULL,
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `NETWORK_INTERFACE` char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `AUTO_POSITION` enum('1','0') NOT NULL,
  `SSL_ALLOWED` enum('YES','NO','IGNORED') NOT NULL,
  `SSL_CA_FILE` varchar(512) NOT NULL,
  `SSL_CA_PATH` varchar(512) NOT NULL,
  `SSL_CERTIFICATE` varchar(512) NOT NULL,
  `SSL_CIPHER` varchar(512) NOT NULL,
  `SSL_KEY` varchar(512) NOT NULL,
  `SSL_VERIFY_SERVER_CERTIFICATE` enum('YES','NO') NOT NULL,
  `SSL_CRL_FILE` varchar(255) NOT NULL,
  `SSL_CRL_PATH` varchar(255) NOT NULL,
  `CONNECTION_RETRY_INTERVAL` int(11) NOT NULL,
  `CONNECTION_RETRY_COUNT` bigint(20) unsigned NOT NULL,
  `HEARTBEAT_INTERVAL` double(10,3) unsigned NOT NULL COMMENT 'Number of seconds after which a heartbeat will be sent .',
  `TLS_VERSION` varchar(255) NOT NULL,
  `PUBLIC_KEY_PATH` varchar(512) NOT NULL,
  `GET_PUBLIC_KEY` enum('YES','NO') NOT NULL,
  `NETWORK_NAMESPACE` varchar(64) NOT NULL,
  `COMPRESSION_ALGORITHM` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Compression algorithm used for data transfer between master and slave.',
  `ZSTD_COMPRESSION_LEVEL` int(11) NOT NULL COMMENT 'Compression level associated with zstd compression algorithm.',
  PRIMARY KEY (`CHANNEL_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_connection_status
CREATE TABLE IF NOT EXISTS `replication_connection_status` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `GROUP_NAME` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `SOURCE_UUID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `SERVICE_STATE` enum('ON','OFF','CONNECTING') NOT NULL,
  `COUNT_RECEIVED_HEARTBEATS` bigint(20) unsigned NOT NULL DEFAULT '0',
  `LAST_HEARTBEAT_TIMESTAMP` timestamp(6) NOT NULL COMMENT 'Shows when the most recent heartbeat signal was received.',
  `RECEIVED_TRANSACTION_SET` longtext NOT NULL,
  `LAST_ERROR_NUMBER` int(11) NOT NULL,
  `LAST_ERROR_MESSAGE` varchar(1024) NOT NULL,
  `LAST_ERROR_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_QUEUED_TRANSACTION` char(57) DEFAULT NULL,
  `LAST_QUEUED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_QUEUED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_QUEUED_TRANSACTION_START_QUEUE_TIMESTAMP` timestamp(6) NOT NULL,
  `LAST_QUEUED_TRANSACTION_END_QUEUE_TIMESTAMP` timestamp(6) NOT NULL,
  `QUEUEING_TRANSACTION` char(57) DEFAULT NULL,
  `QUEUEING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `QUEUEING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP` timestamp(6) NOT NULL,
  `QUEUEING_TRANSACTION_START_QUEUE_TIMESTAMP` timestamp(6) NOT NULL,
  PRIMARY KEY (`CHANNEL_NAME`),
  KEY `THREAD_ID` (`THREAD_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_group_members
CREATE TABLE IF NOT EXISTS `replication_group_members` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `MEMBER_ID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `MEMBER_HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `MEMBER_PORT` int(11) DEFAULT NULL,
  `MEMBER_STATE` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `MEMBER_ROLE` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `MEMBER_VERSION` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.replication_group_member_stats
CREATE TABLE IF NOT EXISTS `replication_group_member_stats` (
  `CHANNEL_NAME` char(64) NOT NULL,
  `VIEW_ID` char(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `MEMBER_ID` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `COUNT_TRANSACTIONS_IN_QUEUE` bigint(20) unsigned NOT NULL,
  `COUNT_TRANSACTIONS_CHECKED` bigint(20) unsigned NOT NULL,
  `COUNT_CONFLICTS_DETECTED` bigint(20) unsigned NOT NULL,
  `COUNT_TRANSACTIONS_ROWS_VALIDATING` bigint(20) unsigned NOT NULL,
  `TRANSACTIONS_COMMITTED_ALL_MEMBERS` longtext NOT NULL,
  `LAST_CONFLICT_FREE_TRANSACTION` text NOT NULL,
  `COUNT_TRANSACTIONS_REMOTE_IN_APPLIER_QUEUE` bigint(20) unsigned NOT NULL,
  `COUNT_TRANSACTIONS_REMOTE_APPLIED` bigint(20) unsigned NOT NULL,
  `COUNT_TRANSACTIONS_LOCAL_PROPOSED` bigint(20) unsigned NOT NULL,
  `COUNT_TRANSACTIONS_LOCAL_ROLLBACK` bigint(20) unsigned NOT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.rwlock_instances
CREATE TABLE IF NOT EXISTS `rwlock_instances` (
  `NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `WRITE_LOCKED_BY_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `READ_LOCKED_BY_COUNT` int(10) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `NAME` (`NAME`),
  KEY `WRITE_LOCKED_BY_THREAD_ID` (`WRITE_LOCKED_BY_THREAD_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.session_account_connect_attrs
CREATE TABLE IF NOT EXISTS `session_account_connect_attrs` (
  `PROCESSLIST_ID` bigint(20) unsigned NOT NULL,
  `ATTR_NAME` varchar(32) COLLATE utf8mb4_bin NOT NULL,
  `ATTR_VALUE` varchar(1024) COLLATE utf8mb4_bin DEFAULT NULL,
  `ORDINAL_POSITION` int(11) DEFAULT NULL,
  PRIMARY KEY (`PROCESSLIST_ID`,`ATTR_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.session_connect_attrs
CREATE TABLE IF NOT EXISTS `session_connect_attrs` (
  `PROCESSLIST_ID` bigint(20) unsigned NOT NULL,
  `ATTR_NAME` varchar(32) COLLATE utf8mb4_bin NOT NULL,
  `ATTR_VALUE` varchar(1024) COLLATE utf8mb4_bin DEFAULT NULL,
  `ORDINAL_POSITION` int(11) DEFAULT NULL,
  PRIMARY KEY (`PROCESSLIST_ID`,`ATTR_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.session_status
CREATE TABLE IF NOT EXISTS `session_status` (
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.session_variables
CREATE TABLE IF NOT EXISTS `session_variables` (
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.setup_actors
CREATE TABLE IF NOT EXISTS `setup_actors` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '%',
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '%',
  `ROLE` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '%',
  `ENABLED` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `HISTORY` enum('YES','NO') NOT NULL DEFAULT 'YES',
  PRIMARY KEY (`HOST`,`USER`,`ROLE`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.setup_consumers
CREATE TABLE IF NOT EXISTS `setup_consumers` (
  `NAME` varchar(64) NOT NULL,
  `ENABLED` enum('YES','NO') NOT NULL,
  PRIMARY KEY (`NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.setup_instruments
CREATE TABLE IF NOT EXISTS `setup_instruments` (
  `NAME` varchar(128) NOT NULL,
  `ENABLED` enum('YES','NO') NOT NULL,
  `TIMED` enum('YES','NO') DEFAULT NULL,
  `PROPERTIES` set('singleton','progress','user','global_statistics','mutable') NOT NULL,
  `VOLATILITY` int(11) NOT NULL,
  `DOCUMENTATION` longtext,
  PRIMARY KEY (`NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.setup_objects
CREATE TABLE IF NOT EXISTS `setup_objects` (
  `OBJECT_TYPE` enum('EVENT','FUNCTION','PROCEDURE','TABLE','TRIGGER') NOT NULL DEFAULT 'TABLE',
  `OBJECT_SCHEMA` varchar(64) DEFAULT '%',
  `OBJECT_NAME` varchar(64) NOT NULL DEFAULT '%',
  `ENABLED` enum('YES','NO') NOT NULL DEFAULT 'YES',
  `TIMED` enum('YES','NO') NOT NULL DEFAULT 'YES',
  UNIQUE KEY `OBJECT` (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.setup_threads
CREATE TABLE IF NOT EXISTS `setup_threads` (
  `NAME` varchar(128) NOT NULL,
  `ENABLED` enum('YES','NO') NOT NULL,
  `HISTORY` enum('YES','NO') NOT NULL,
  `PROPERTIES` set('singleton','user') NOT NULL,
  `VOLATILITY` int(11) NOT NULL,
  `DOCUMENTATION` longtext,
  PRIMARY KEY (`NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.socket_instances
CREATE TABLE IF NOT EXISTS `socket_instances` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `SOCKET_ID` int(11) NOT NULL,
  `IP` varchar(64) NOT NULL,
  `PORT` int(11) NOT NULL,
  `STATE` enum('IDLE','ACTIVE') NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `THREAD_ID` (`THREAD_ID`),
  KEY `SOCKET_ID` (`SOCKET_ID`),
  KEY `IP` (`IP`,`PORT`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.socket_summary_by_event_name
CREATE TABLE IF NOT EXISTS `socket_summary_by_event_name` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_READ` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_MISC` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_MISC` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.socket_summary_by_instance
CREATE TABLE IF NOT EXISTS `socket_summary_by_instance` (
  `EVENT_NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_READ` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_NUMBER_OF_BYTES_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_MISC` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_MISC` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_MISC` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `EVENT_NAME` (`EVENT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.status_by_account
CREATE TABLE IF NOT EXISTS `status_by_account` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  UNIQUE KEY `ACCOUNT` (`USER`,`HOST`,`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.status_by_host
CREATE TABLE IF NOT EXISTS `status_by_host` (
  `HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  UNIQUE KEY `HOST` (`HOST`,`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.status_by_thread
CREATE TABLE IF NOT EXISTS `status_by_thread` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.status_by_user
CREATE TABLE IF NOT EXISTS `status_by_user` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  UNIQUE KEY `USER` (`USER`,`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.table_handles
CREATE TABLE IF NOT EXISTS `table_handles` (
  `OBJECT_TYPE` varchar(64) NOT NULL,
  `OBJECT_SCHEMA` varchar(64) NOT NULL,
  `OBJECT_NAME` varchar(64) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `OWNER_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `OWNER_EVENT_ID` bigint(20) unsigned DEFAULT NULL,
  `INTERNAL_LOCK` varchar(64) DEFAULT NULL,
  `EXTERNAL_LOCK` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `OBJECT_TYPE` (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`),
  KEY `OWNER_THREAD_ID` (`OWNER_THREAD_ID`,`OWNER_EVENT_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.table_io_waits_summary_by_index_usage
CREATE TABLE IF NOT EXISTS `table_io_waits_summary_by_index_usage` (
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `INDEX_NAME` varchar(64) DEFAULT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_FETCH` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `COUNT_INSERT` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `COUNT_UPDATE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `COUNT_DELETE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `OBJECT` (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`,`INDEX_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.table_io_waits_summary_by_table
CREATE TABLE IF NOT EXISTS `table_io_waits_summary_by_table` (
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_FETCH` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_FETCH` bigint(20) unsigned NOT NULL,
  `COUNT_INSERT` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_INSERT` bigint(20) unsigned NOT NULL,
  `COUNT_UPDATE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_UPDATE` bigint(20) unsigned NOT NULL,
  `COUNT_DELETE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_DELETE` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `OBJECT` (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.table_lock_waits_summary_by_table
CREATE TABLE IF NOT EXISTS `table_lock_waits_summary_by_table` (
  `OBJECT_TYPE` varchar(64) DEFAULT NULL,
  `OBJECT_SCHEMA` varchar(64) DEFAULT NULL,
  `OBJECT_NAME` varchar(64) DEFAULT NULL,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `COUNT_READ` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_READ_NORMAL` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_NORMAL` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_NORMAL` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_NORMAL` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_NORMAL` bigint(20) unsigned NOT NULL,
  `COUNT_READ_WITH_SHARED_LOCKS` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_WITH_SHARED_LOCKS` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_WITH_SHARED_LOCKS` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_WITH_SHARED_LOCKS` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_WITH_SHARED_LOCKS` bigint(20) unsigned NOT NULL,
  `COUNT_READ_HIGH_PRIORITY` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_HIGH_PRIORITY` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_HIGH_PRIORITY` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_HIGH_PRIORITY` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_HIGH_PRIORITY` bigint(20) unsigned NOT NULL,
  `COUNT_READ_NO_INSERT` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_NO_INSERT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_NO_INSERT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_NO_INSERT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_NO_INSERT` bigint(20) unsigned NOT NULL,
  `COUNT_READ_EXTERNAL` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_READ_EXTERNAL` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_READ_EXTERNAL` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_READ_EXTERNAL` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_READ_EXTERNAL` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE_ALLOW_WRITE` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE_ALLOW_WRITE` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE_ALLOW_WRITE` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE_ALLOW_WRITE` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE_ALLOW_WRITE` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE_CONCURRENT_INSERT` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE_CONCURRENT_INSERT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE_CONCURRENT_INSERT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE_CONCURRENT_INSERT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE_CONCURRENT_INSERT` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE_LOW_PRIORITY` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE_LOW_PRIORITY` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE_LOW_PRIORITY` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE_LOW_PRIORITY` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE_LOW_PRIORITY` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE_NORMAL` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE_NORMAL` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE_NORMAL` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE_NORMAL` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE_NORMAL` bigint(20) unsigned NOT NULL,
  `COUNT_WRITE_EXTERNAL` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WRITE_EXTERNAL` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WRITE_EXTERNAL` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WRITE_EXTERNAL` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WRITE_EXTERNAL` bigint(20) unsigned NOT NULL,
  UNIQUE KEY `OBJECT` (`OBJECT_TYPE`,`OBJECT_SCHEMA`,`OBJECT_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.threads
CREATE TABLE IF NOT EXISTS `threads` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `NAME` varchar(128) NOT NULL,
  `TYPE` varchar(10) NOT NULL,
  `PROCESSLIST_ID` bigint(20) unsigned DEFAULT NULL,
  `PROCESSLIST_USER` varchar(32) DEFAULT NULL,
  `PROCESSLIST_HOST` varchar(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `PROCESSLIST_DB` varchar(64) DEFAULT NULL,
  `PROCESSLIST_COMMAND` varchar(16) DEFAULT NULL,
  `PROCESSLIST_TIME` bigint(20) DEFAULT NULL,
  `PROCESSLIST_STATE` varchar(64) DEFAULT NULL,
  `PROCESSLIST_INFO` longtext,
  `PARENT_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `ROLE` varchar(64) DEFAULT NULL,
  `INSTRUMENTED` enum('YES','NO') NOT NULL,
  `HISTORY` enum('YES','NO') NOT NULL,
  `CONNECTION_TYPE` varchar(16) DEFAULT NULL,
  `THREAD_OS_ID` bigint(20) unsigned DEFAULT NULL,
  `RESOURCE_GROUP` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`),
  KEY `PROCESSLIST_ID` (`PROCESSLIST_ID`),
  KEY `THREAD_OS_ID` (`THREAD_OS_ID`),
  KEY `NAME` (`NAME`),
  KEY `PROCESSLIST_ACCOUNT` (`PROCESSLIST_USER`,`PROCESSLIST_HOST`),
  KEY `PROCESSLIST_HOST` (`PROCESSLIST_HOST`),
  KEY `RESOURCE_GROUP` (`RESOURCE_GROUP`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.users
CREATE TABLE IF NOT EXISTS `users` (
  `USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `CURRENT_CONNECTIONS` bigint(20) NOT NULL,
  `TOTAL_CONNECTIONS` bigint(20) NOT NULL,
  UNIQUE KEY `USER` (`USER`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.user_defined_functions
CREATE TABLE IF NOT EXISTS `user_defined_functions` (
  `UDF_NAME` varchar(64) NOT NULL,
  `UDF_RETURN_TYPE` varchar(20) NOT NULL,
  `UDF_TYPE` varchar(20) NOT NULL,
  `UDF_LIBRARY` varchar(1024) DEFAULT NULL,
  `UDF_USAGE_COUNT` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`UDF_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.user_variables_by_thread
CREATE TABLE IF NOT EXISTS `user_variables_by_thread` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` longblob,
  PRIMARY KEY (`THREAD_ID`,`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.variables_by_thread
CREATE TABLE IF NOT EXISTS `variables_by_thread` (
  `THREAD_ID` bigint(20) unsigned NOT NULL,
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_VALUE` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`THREAD_ID`,`VARIABLE_NAME`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table performance_schema.variables_info
CREATE TABLE IF NOT EXISTS `variables_info` (
  `VARIABLE_NAME` varchar(64) NOT NULL,
  `VARIABLE_SOURCE` enum('COMPILED','GLOBAL','SERVER','EXPLICIT','EXTRA','USER','LOGIN','COMMAND_LINE','PERSISTED','DYNAMIC') DEFAULT 'COMPILED',
  `VARIABLE_PATH` varchar(1024) DEFAULT NULL,
  `MIN_VALUE` varchar(64) DEFAULT NULL,
  `MAX_VALUE` varchar(64) DEFAULT NULL,
  `SET_TIME` timestamp(6) NULL DEFAULT NULL,
  `SET_USER` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `SET_HOST` char(255) CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.


-- Dumping database structure for sys
CREATE DATABASE IF NOT EXISTS `sys` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sys`;

-- Dumping structure for procedure sys.create_synonym_db
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `create_synonym_db`(
        IN in_db_name VARCHAR(64), 
        IN in_synonym VARCHAR(64)
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a source database name and synonym name, and then creates the \nsynonym database with views that point to all of the tables within\nthe source database.\n\nUseful for creating a "ps" synonym for "performance_schema",\nor "is" instead of "information_schema", for example.\n\nParameters\n-----------\n\nin_db_name (VARCHAR(64)):\n  The database name that you would like to create a synonym for.\nin_synonym (VARCHAR(64)):\n  The database synonym name.\n\nExample\n-----------\n\nmysql> SHOW DATABASES;\n+--------------------+\n| Database           |\n+--------------------+\n| information_schema |\n| mysql              |\n| performance_schema |\n| sys                |\n| test               |\n+--------------------+\n5 rows in set (0.00 sec)\n\nmysql> CALL sys.create_synonym_db(''performance_schema'', ''ps'');\n+---------------------------------------+\n| summary                               |\n+---------------------------------------+\n| Created 74 views in the `ps` database |\n+---------------------------------------+\n1 row in set (8.57 sec)\n\nQuery OK, 0 rows affected (8.57 sec)\n\nmysql> SHOW DATABASES;\n+--------------------+\n| Database           |\n+--------------------+\n| information_schema |\n| mysql              |\n| performance_schema |\n| ps                 |\n| sys                |\n| test               |\n+--------------------+\n6 rows in set (0.00 sec)\n\nmysql> SHOW FULL TABLES FROM ps;\n+------------------------------------------------------+------------+\n| Tables_in_ps                                         | Table_type |\n+------------------------------------------------------+------------+\n| accounts                                             | VIEW       |\n| cond_instances                                       | VIEW       |\n| events_stages_current                                | VIEW       |\n| events_stages_history                                | VIEW       |\n...\n'
BEGIN
    DECLARE v_done bool DEFAULT FALSE;
    DECLARE v_db_name_check VARCHAR(64);
    DECLARE v_db_err_msg TEXT;
    DECLARE v_table VARCHAR(64);
    DECLARE v_views_created INT DEFAULT 0;
    DECLARE db_doesnt_exist CONDITION FOR SQLSTATE '42000';
    DECLARE db_name_exists CONDITION FOR SQLSTATE 'HY000';
    DECLARE c_table_names CURSOR FOR 
        SELECT TABLE_NAME 
          FROM INFORMATION_SCHEMA.TABLES 
         WHERE TABLE_SCHEMA = in_db_name;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    -- Check if the source database exists
    SELECT SCHEMA_NAME INTO v_db_name_check
      FROM INFORMATION_SCHEMA.SCHEMATA
     WHERE SCHEMA_NAME = in_db_name;
    IF v_db_name_check IS NULL THEN
        SET v_db_err_msg = CONCAT('Unknown database ', in_db_name);
        SIGNAL SQLSTATE 'HY000'
            SET MESSAGE_TEXT = v_db_err_msg;
    END IF;
    -- Check if a database of the synonym name already exists
    SELECT SCHEMA_NAME INTO v_db_name_check
      FROM INFORMATION_SCHEMA.SCHEMATA
     WHERE SCHEMA_NAME = in_synonym;
    IF v_db_name_check = in_synonym THEN
        SET v_db_err_msg = CONCAT('Can\'t create database ', in_synonym, '; database exists');
        SIGNAL SQLSTATE 'HY000'
            SET MESSAGE_TEXT = v_db_err_msg;
    END IF;
    -- All good, create the database and views
    SET @create_db_stmt := CONCAT('CREATE DATABASE ', sys.quote_identifier(in_synonym));
    PREPARE create_db_stmt FROM @create_db_stmt;
    EXECUTE create_db_stmt;
    DEALLOCATE PREPARE create_db_stmt;
    SET v_done = FALSE;
    OPEN c_table_names;
    c_table_names: LOOP
        FETCH c_table_names INTO v_table;
        IF v_done THEN
            LEAVE c_table_names;
        END IF;
        SET @create_view_stmt = CONCAT(
            'CREATE SQL SECURITY INVOKER VIEW ',
            sys.quote_identifier(in_synonym),
            '.',
            sys.quote_identifier(v_table),
            ' AS SELECT * FROM ',
            sys.quote_identifier(in_db_name),
            '.',
            sys.quote_identifier(v_table)
        );
        PREPARE create_view_stmt FROM @create_view_stmt;
        EXECUTE create_view_stmt;
        DEALLOCATE PREPARE create_view_stmt;
        SET v_views_created = v_views_created + 1;
    END LOOP;
    CLOSE c_table_names;
    SELECT CONCAT(
        'Created ', v_views_created, ' view',
        IF(v_views_created != 1, 's', ''), ' in the ',
        sys.quote_identifier(in_synonym), ' database'
    ) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.diagnostics
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `diagnostics`(
        IN in_max_runtime int unsigned, IN in_interval int unsigned,
        IN in_auto_config enum ('current', 'medium', 'full')
    )
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nCreate a report of the current status of the server for diagnostics purposes. Data collected includes (some items depends on versions and settings):\n\n   * The GLOBAL VARIABLES\n   * Several sys schema views including metrics or equivalent (depending on version and settings)\n   * Queries in the 95th percentile\n   * Several ndbinfo views for MySQL Cluster\n   * Replication (both master and slave) information.\n\nSome of the sys schema views are calculated as initial (optional), overall, delta:\n\n   * The initial view is the content of the view at the start of this procedure.\n     This output will be the same as the the start values used for the delta view.\n     The initial view is included if @sys.diagnostics.include_raw = ''ON''.\n   * The overall view is the content of the view at the end of this procedure.\n     This output is the same as the end values used for the delta view.\n     The overall view is always included.\n   * The delta view is the difference from the beginning to the end. Note that for min and max values\n     they are simply the min or max value from the end view respectively, so does not necessarily reflect\n     the minimum/maximum value in the monitored period.\n     Note: except for the metrics views the delta is only calculation between the first and last outputs.\n\nRequires the SUPER privilege for "SET sql_log_bin = 0;".\n\nVersions supported:\n   * MySQL 5.6: 5.6.10 and later\n   * MySQL 5.7: 5.7.9 and later\n\nParameters\n-----------\n\nin_max_runtime (INT UNSIGNED):\n  The maximum time to keep collecting data.\n  Use NULL to get the default which is 60 seconds, otherwise enter a value greater than 0.\nin_interval (INT UNSIGNED):\n  How long to sleep between data collections.\n  Use NULL to get the default which is 30 seconds, otherwise enter a value greater than 0.\nin_auto_config (ENUM(''current'', ''medium'', ''full''))\n  Automatically enable Performance Schema instruments and consumers.\n  NOTE: The more that are enabled, the more impact on the performance.\n  Supported values are:\n     * current - use the current settings.\n     * medium - enable some settings. This requires the SUPER privilege.\n     * full - enables all settings. This will have a big impact on the\n              performance - be careful using this option. This requires\n              the SUPER privilege.\n  If another setting the ''current'' is chosen, the current settings\n  are restored at the end of the procedure.\n\n\nConfiguration Options\n----------------------\n\nsys.diagnostics.allow_i_s_tables\n  Specifies whether it is allowed to do table scan queries on information_schema.TABLES. This can be expensive if there\n  are many tables. Set to ''ON'' to allow, ''OFF'' to not allow.\n  Default is ''OFF''.\n\nsys.diagnostics.include_raw\n  Set to ''ON'' to include the raw data (e.g. the original output of "SELECT * FROM sys.metrics").\n  Use this to get the initial values of the various views.\n  Default is ''OFF''.\n\nsys.statement_truncate_len\n  How much of queries in the process list output to include.\n  Default is 64.\n\nsys.debug\n  Whether to provide debugging output.\n  Default is ''OFF''. Set to ''ON'' to include.\n\n\nExample\n--------\n\nTo create a report and append it to the file diag.out:\n\nmysql> TEE diag.out;\nmysql> CALL sys.diagnostics(120, 30, ''current'');\n...\nmysql> NOTEE;\n'
BEGIN
    DECLARE v_start, v_runtime, v_iter_start, v_sleep DECIMAL(20,2) DEFAULT 0.0;
    DECLARE v_has_innodb, v_has_ndb, v_has_ps, v_has_replication, v_has_ps_replication VARCHAR(8) CHARSET utf8mb4 DEFAULT 'NO';
    DECLARE v_this_thread_enabled, v_has_metrics ENUM('YES', 'NO');
    DECLARE v_table_name, v_banner VARCHAR(64) CHARSET utf8mb4;
    DECLARE v_sql_status_summary_select, v_sql_status_summary_delta, v_sql_status_summary_from, v_no_delta_names TEXT;
    DECLARE v_output_time, v_output_time_prev DECIMAL(20,3) UNSIGNED;
    DECLARE v_output_count, v_count, v_old_group_concat_max_len INT UNSIGNED DEFAULT 0;
    -- The width of each of the status outputs in the summery
    DECLARE v_status_summary_width TINYINT UNSIGNED DEFAULT 50;
    DECLARE v_done BOOLEAN DEFAULT FALSE;
    -- Do not include the following ndbinfo views:
    --    'blocks'                    Static
    --    'config_params'             Static
    --    'dict_obj_types'            Static
    --    'disk_write_speed_base'     Can generate lots of output - only include aggregate views here
    --    'memory_per_fragment'       Can generate lots of output
    --    'memoryusage'               Handled separately
    --    'operations_per_fragment'   Can generate lots of output
    --    'threadblocks'              Only needed once
    DECLARE c_ndbinfo CURSOR FOR
        SELECT TABLE_NAME
          FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = 'ndbinfo'
               AND TABLE_NAME NOT IN (
                  'blocks',
                  'config_params',
                  'dict_obj_types',
                  'disk_write_speed_base',
                  'memory_per_fragment',
                  'memoryusage',
                  'operations_per_fragment',
                  'threadblocks'
               );
    DECLARE c_sysviews_w_delta CURSOR FOR
        SELECT table_name
          FROM tmp_sys_views_delta
         ORDER BY table_name;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    -- Do not track the current thread - no reason to clutter the output
    SELECT INSTRUMENTED INTO v_this_thread_enabled FROM performance_schema.threads WHERE PROCESSLIST_ID = CONNECTION_ID();
    IF (v_this_thread_enabled = 'YES') THEN
        CALL sys.ps_setup_disable_thread(CONNECTION_ID());
    END IF;
    -- Check options are sane
    IF (in_max_runtime < in_interval) THEN
        SIGNAL SQLSTATE '45000'
           SET MESSAGE_TEXT = 'in_max_runtime must be greater than or equal to in_interval';
    END IF;
    IF (in_max_runtime = 0) THEN
        SIGNAL SQLSTATE '45000'
           SET MESSAGE_TEXT = 'in_max_runtime must be greater than 0';
    END IF;
    IF (in_interval = 0) THEN
        SIGNAL SQLSTATE '45000'
           SET MESSAGE_TEXT = 'in_interval must be greater than 0';
    END IF;
    -- Set configuration options
    IF (@sys.diagnostics.allow_i_s_tables IS NULL) THEN
        SET @sys.diagnostics.allow_i_s_tables = sys.sys_get_config('diagnostics.allow_i_s_tables', 'OFF');
    END IF;
    IF (@sys.diagnostics.include_raw IS NULL) THEN
        SET @sys.diagnostics.include_raw      = sys.sys_get_config('diagnostics.include_raw'     , 'OFF');
    END IF;
    IF (@sys.debug IS NULL) THEN
        SET @sys.debug                        = sys.sys_get_config('debug'                       , 'OFF');
    END IF;
    IF (@sys.statement_truncate_len IS NULL) THEN
        SET @sys.statement_truncate_len       = sys.sys_get_config('statement_truncate_len'      , '64' );
    END IF;
    -- Temporary table are used - disable sql_log_bin if necessary to prevent them replicating
    SET @log_bin := @@sql_log_bin;
    IF (@log_bin = 1) THEN
        SET sql_log_bin = 0;
    END IF;
    -- Some metrics variables doesn't make sense in delta and rate calculations even if they are numeric
    -- as they really are more like settings or "current" status.
    SET v_no_delta_names = CONCAT('s%{COUNT}.Variable_name NOT IN (',
        '''innodb_buffer_pool_pages_total'', ',
        '''innodb_page_size'', ',
        '''last_query_cost'', ',
        '''last_query_partial_plans'', ',
        '''qcache_total_blocks'', ',
        '''slave_last_heartbeat'', ',
        '''ssl_ctx_verify_depth'', ',
        '''ssl_ctx_verify_mode'', ',
        '''ssl_session_cache_size'', ',
        '''ssl_verify_depth'', ',
        '''ssl_verify_mode'', ',
        '''ssl_version'', ',
        '''buffer_flush_lsn_avg_rate'', ',
        '''buffer_flush_pct_for_dirty'', ',
        '''buffer_flush_pct_for_lsn'', ',
        '''buffer_pool_pages_total'', ',
        '''lock_row_lock_time_avg'', ',
        '''lock_row_lock_time_max'', ',
        '''innodb_page_size''',
    ')');
    IF (in_auto_config <> 'current') THEN
        IF (@sys.debug = 'ON') THEN
            SELECT CONCAT('Updating Performance Schema configuration to ', in_auto_config) AS 'Debug';
        END IF;
        CALL sys.ps_setup_save(0);
        IF (in_auto_config = 'medium') THEN
            -- Enable all consumers except %history and %history_long
            UPDATE performance_schema.setup_consumers
                SET ENABLED = 'YES'
            WHERE NAME NOT LIKE '%\_history%';
            -- Enable all instruments except wait/synch/%
            UPDATE performance_schema.setup_instruments
                SET ENABLED = 'YES',
                    TIMED   = 'YES'
            WHERE NAME NOT LIKE 'wait/synch/%';
        ELSEIF (in_auto_config = 'full') THEN
            UPDATE performance_schema.setup_consumers
                SET ENABLED = 'YES';
            UPDATE performance_schema.setup_instruments
                SET ENABLED = 'YES',
                    TIMED   = 'YES';
        END IF;
        -- Enable all threads except this one
        UPDATE performance_schema.threads
           SET INSTRUMENTED = 'YES'
         WHERE PROCESSLIST_ID <> CONNECTION_ID();
    END IF;
    SET v_start        = UNIX_TIMESTAMP(NOW(2)),
        in_interval    = IFNULL(in_interval, 30),
        in_max_runtime = IFNULL(in_max_runtime, 60);
    -- Get a quick ref with hostname, server UUID, and the time for the report.
    SET v_banner = REPEAT(
                      '-',
                      LEAST(
                         GREATEST(
                            36,
                            CHAR_LENGTH(VERSION()),
                            CHAR_LENGTH(@@global.version_comment),
                            CHAR_LENGTH(@@global.version_compile_os),
                            CHAR_LENGTH(@@global.version_compile_machine),
                            CHAR_LENGTH(@@global.socket),
                            CHAR_LENGTH(@@global.datadir)
                         ),
                         64
                      )
                   );
    SELECT 'Hostname' AS 'Name', @@global.hostname AS 'Value'
    UNION ALL
    SELECT 'Port' AS 'Name', @@global.port AS 'Value'
    UNION ALL
    SELECT 'Socket' AS 'Name', @@global.socket AS 'Value'
    UNION ALL
    SELECT 'Datadir' AS 'Name', @@global.datadir AS 'Value'
    UNION ALL
    SELECT 'Server UUID' AS 'Name', @@global.server_uuid AS 'Value'
    UNION ALL
    SELECT REPEAT('-', 23) AS 'Name', v_banner AS 'Value'
    UNION ALL
    SELECT 'MySQL Version' AS 'Name', VERSION() AS 'Value'
    UNION ALL
    SELECT 'Sys Schema Version' AS 'Name', (SELECT sys_version FROM sys.version) AS 'Value'
    UNION ALL
    SELECT 'Version Comment' AS 'Name', @@global.version_comment AS 'Value'
    UNION ALL
    SELECT 'Version Compile OS' AS 'Name', @@global.version_compile_os AS 'Value'
    UNION ALL
    SELECT 'Version Compile Machine' AS 'Name', @@global.version_compile_machine AS 'Value'
    UNION ALL
    SELECT REPEAT('-', 23) AS 'Name', v_banner AS 'Value'
    UNION ALL
    SELECT 'UTC Time' AS 'Name', UTC_TIMESTAMP() AS 'Value'
    UNION ALL
    SELECT 'Local Time' AS 'Name', NOW() AS 'Value'
    UNION ALL
    SELECT 'Time Zone' AS 'Name', @@global.time_zone AS 'Value'
    UNION ALL
    SELECT 'System Time Zone' AS 'Name', @@global.system_time_zone AS 'Value'
    UNION ALL
    SELECT 'Time Zone Offset' AS 'Name', TIMEDIFF(NOW(), UTC_TIMESTAMP()) AS 'Value';
    -- Are the InnoDB, NDBCluster, and Performance Schema storage engines present?
    SET v_has_innodb         = IFNULL((SELECT SUPPORT FROM information_schema.ENGINES WHERE ENGINE = 'InnoDB'), 'NO'),
        v_has_ndb            = IFNULL((SELECT SUPPORT FROM information_schema.ENGINES WHERE ENGINE = 'NDBCluster'), 'NO'),
        v_has_ps             = IFNULL((SELECT SUPPORT FROM information_schema.ENGINES WHERE ENGINE = 'PERFORMANCE_SCHEMA'), 'NO'),
        v_has_ps_replication = IF(v_has_ps = 'YES'
                                   AND EXISTS(SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'performance_schema' AND TABLE_NAME = 'replication_applier_status'),
                                   'YES',
                                   'NO'
                               ),
        v_has_replication    =  IF(v_has_ps_replication = 'YES', IF((SELECT COUNT(*) FROM performance_schema.replication_connection_status) > 0, 'YES', 'NO'),
                                  IF(@@master_info_repository = 'TABLE', IF((SELECT COUNT(*) FROM mysql.slave_master_info) > 0, 'YES', 'NO'),
                                     IF(@@relay_log_info_repository = 'TABLE', IF((SELECT COUNT(*) FROM mysql.slave_relay_log_info) > 0, 'YES', 'NO'),
                                        'MAYBE')) ) ,
        v_has_metrics        = IF(v_has_ps = 'YES' OR (sys.version_major() = 5 AND sys.version_minor() = 6), 'YES', 'NO');
    IF (@sys.debug = 'ON') THEN
       SELECT v_has_innodb AS 'Has_InnoDB', v_has_ndb AS 'Has_NDBCluster',
              v_has_ps AS 'Has_Performance_Schema',
              v_has_metrics AS 'Has_metrics',
              v_has_ps_replication 'AS Has_P_S_Replication', v_has_replication AS 'Has_Replication';
    END IF;
    IF (v_has_innodb IN ('DEFAULT', 'YES')) THEN
        -- Need to use prepared statement as just having the query as a plain command
        -- will generate an error if the InnoDB storage engine is not present
        SET @sys.diagnostics.sql = 'SHOW ENGINE InnoDB STATUS';
        PREPARE stmt_innodb_status FROM @sys.diagnostics.sql;
    END IF;
    IF (v_has_ps = 'YES') THEN
        -- Need to use prepared statement as just having the query as a plain command
        -- will generate an error if the InnoDB storage engine is not present
        SET @sys.diagnostics.sql = 'SHOW ENGINE PERFORMANCE_SCHEMA STATUS';
        PREPARE stmt_ps_status FROM @sys.diagnostics.sql;
    END IF;
    IF (v_has_ndb IN ('DEFAULT', 'YES')) THEN
        -- Need to use prepared statement as just having the query as a plain command
        -- will generate an error if the NDBCluster storage engine is not present
        SET @sys.diagnostics.sql = 'SHOW ENGINE NDBCLUSTER STATUS';
        PREPARE stmt_ndbcluster_status FROM @sys.diagnostics.sql;
    END IF;
    SET @sys.diagnostics.sql_gen_query_template = 'SELECT CONCAT(
           ''SELECT '',
           GROUP_CONCAT(
               CASE WHEN (SUBSTRING(TABLE_NAME, 3), COLUMN_NAME) IN (
                                (''io_global_by_file_by_bytes'', ''total''),
                                (''io_global_by_wait_by_bytes'', ''total_requested'')
                         )
                         THEN CONCAT(''sys.format_bytes('', COLUMN_NAME, '') AS '', COLUMN_NAME)
                    WHEN COLUMN_NAME LIKE ''%latency''
                         THEN CONCAT(''sys.format_time('', COLUMN_NAME, '') AS '', COLUMN_NAME)
                    WHEN SUBSTRING(COLUMN_NAME, -7) = ''_memory'' OR SUBSTRING(COLUMN_NAME, -17) = ''_memory_allocated''
                         OR ((SUBSTRING(COLUMN_NAME, -5) = ''_read'' OR SUBSTRING(COLUMN_NAME, -8) = ''_written'' OR SUBSTRING(COLUMN_NAME, -6) = ''_write'') AND SUBSTRING(COLUMN_NAME, 1, 6) <> ''COUNT_'')
                         THEN CONCAT(''sys.format_bytes('', COLUMN_NAME, '') AS '', COLUMN_NAME)
                    ELSE COLUMN_NAME
               END
               ORDER BY ORDINAL_POSITION
               SEPARATOR '',\n       ''
           ),
           ''\n  FROM tmp_'', SUBSTRING(TABLE_NAME FROM 3), ''_%{OUTPUT}''
       ) AS Query INTO @sys.diagnostics.sql_select
  FROM information_schema.COLUMNS
 WHERE TABLE_SCHEMA = ''sys'' AND TABLE_NAME = ?
 GROUP BY TABLE_NAME';
    SET @sys.diagnostics.sql_gen_query_delta = 'SELECT CONCAT(
           ''SELECT '',
           GROUP_CONCAT(
               CASE WHEN FIND_IN_SET(COLUMN_NAME COLLATE utf8_general_ci, diag.pk)
                         THEN COLUMN_NAME
                    WHEN diag.TABLE_NAME = ''io_global_by_file_by_bytes'' AND COLUMN_NAME COLLATE utf8_general_ci = ''write_pct''
                         THEN CONCAT(''IFNULL(ROUND(100-(((e.total_read-IFNULL(s.total_read, 0))'',
                                     ''/NULLIF(((e.total_read-IFNULL(s.total_read, 0))+(e.total_written-IFNULL(s.total_written, 0))), 0))*100), 2), 0.00) AS '',
                                     COLUMN_NAME)
                    WHEN (diag.TABLE_NAME, COLUMN_NAME) IN (
                                (''io_global_by_file_by_bytes'', ''total''),
                                (''io_global_by_wait_by_bytes'', ''total_requested'')
                         )
                         THEN CONCAT(''sys.format_bytes(e.'', COLUMN_NAME, ''-IFNULL(s.'', COLUMN_NAME, '', 0)) AS '', COLUMN_NAME)
                    WHEN SUBSTRING(COLUMN_NAME, 1, 4) IN (''max_'', ''min_'') AND SUBSTRING(COLUMN_NAME, -8) = ''_latency''
                         THEN CONCAT(''sys.format_time(e.'', COLUMN_NAME, '') AS '', COLUMN_NAME)
                    WHEN COLUMN_NAME COLLATE utf8_general_ci = ''avg_latency''
                         THEN CONCAT(''sys.format_time((e.total_latency - IFNULL(s.total_latency, 0))'',
                                     ''/NULLIF(e.total - IFNULL(s.total, 0), 0)) AS '', COLUMN_NAME)
                    WHEN SUBSTRING(COLUMN_NAME, -12) = ''_avg_latency''
                         THEN CONCAT(''sys.format_time((e.'', SUBSTRING(COLUMN_NAME FROM 1 FOR CHAR_LENGTH(COLUMN_NAME)-12), ''_latency - IFNULL(s.'', SUBSTRING(COLUMN_NAME FROM 1 FOR CHAR_LENGTH(COLUMN_NAME)-12), ''_latency, 0))'',
                                     ''/NULLIF(e.'', SUBSTRING(COLUMN_NAME FROM 1 FOR CHAR_LENGTH(COLUMN_NAME)-12), ''s - IFNULL(s.'', SUBSTRING(COLUMN_NAME FROM 1 FOR CHAR_LENGTH(COLUMN_NAME)-12), ''s, 0), 0)) AS '', COLUMN_NAME)
                    WHEN COLUMN_NAME LIKE ''%latency''
                         THEN CONCAT(''sys.format_time(e.'', COLUMN_NAME, '' - IFNULL(s.'', COLUMN_NAME, '', 0)) AS '', COLUMN_NAME)
                    WHEN COLUMN_NAME IN (''avg_read'', ''avg_write'', ''avg_written'')
                         THEN CONCAT(''sys.format_bytes(IFNULL((e.total_'', IF(COLUMN_NAME = ''avg_read'', ''read'', ''written''), ''-IFNULL(s.total_'', IF(COLUMN_NAME = ''avg_read'', ''read'', ''written''), '', 0))'',
                                     ''/NULLIF(e.count_'', IF(COLUMN_NAME = ''avg_read'', ''read'', ''write''), ''-IFNULL(s.count_'', IF(COLUMN_NAME = ''avg_read'', ''read'', ''write''), '', 0), 0), 0)) AS '',
                                     COLUMN_NAME)
                    WHEN SUBSTRING(COLUMN_NAME, -7) = ''_memory'' OR SUBSTRING(COLUMN_NAME, -17) = ''_memory_allocated''
                         OR ((SUBSTRING(COLUMN_NAME, -5) = ''_read'' OR SUBSTRING(COLUMN_NAME, -8) = ''_written'' OR SUBSTRING(COLUMN_NAME, -6) = ''_write'') AND SUBSTRING(COLUMN_NAME, 1, 6) <> ''COUNT_'')
                         THEN CONCAT(''sys.format_bytes(e.'', COLUMN_NAME, '' - IFNULL(s.'', COLUMN_NAME, '', 0)) AS '', COLUMN_NAME)
                    ELSE CONCAT(''(e.'', COLUMN_NAME, '' - IFNULL(s.'', COLUMN_NAME, '', 0)) AS '', COLUMN_NAME)
               END
               ORDER BY ORDINAL_POSITION
               SEPARATOR '',\n       ''
           ),
           ''\n  FROM tmp_'', diag.TABLE_NAME, ''_end e
       LEFT OUTER JOIN tmp_'', diag.TABLE_NAME, ''_start s USING ('', diag.pk, '')''
       ) AS Query INTO @sys.diagnostics.sql_select
  FROM tmp_sys_views_delta diag
       INNER JOIN information_schema.COLUMNS c ON c.TABLE_NAME COLLATE utf8_general_ci = CONCAT(''x$'', diag.TABLE_NAME)
 WHERE c.TABLE_SCHEMA = ''sys'' AND diag.TABLE_NAME = ?
 GROUP BY diag.TABLE_NAME';
    IF (v_has_ps = 'YES') THEN
        -- Create temporary table with the ORDER BY clauses. Will be required both for the initial (if included) and end queries
        DROP TEMPORARY TABLE IF EXISTS tmp_sys_views_delta;
        CREATE TEMPORARY TABLE tmp_sys_views_delta (
            TABLE_NAME varchar(64) NOT NULL,
            order_by text COMMENT 'ORDER BY clause for the initial and overall views',
            order_by_delta text COMMENT 'ORDER BY clause for the delta views',
            where_delta text COMMENT 'WHERE clause to use for delta views to only include rows with a "count" > 0',
            limit_rows int unsigned COMMENT 'The maximum number of rows to include for the view',
            pk varchar(128) COMMENT 'Used with the FIND_IN_SET() function so use comma separated list without whitespace',
            PRIMARY KEY (TABLE_NAME)
        );
        -- %{OUTPUT} will be replace by the suffix used for the output.
        IF (@sys.debug = 'ON') THEN
            SELECT 'Populating tmp_sys_views_delta' AS 'Debug';
        END IF;
        INSERT INTO tmp_sys_views_delta
        VALUES ('host_summary'                       , '%{TABLE}.statement_latency DESC',
                                                       '(e.statement_latency-IFNULL(s.statement_latency, 0)) DESC',
                                                       '(e.statements - IFNULL(s.statements, 0)) > 0', NULL, 'host'),
               ('host_summary_by_file_io'            , '%{TABLE}.io_latency DESC',
                                                       '(e.io_latency-IFNULL(s.io_latency, 0)) DESC',
                                                       '(e.ios - IFNULL(s.ios, 0)) > 0', NULL, 'host'),
               ('host_summary_by_file_io_type'       , '%{TABLE}.host, %{TABLE}.total_latency DESC',
                                                       'e.host, (e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'host,event_name'),
               ('host_summary_by_stages'             , '%{TABLE}.host, %{TABLE}.total_latency DESC',
                                                       'e.host, (e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'host,event_name'),
               ('host_summary_by_statement_latency'  , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'host'),
               ('host_summary_by_statement_type'     , '%{TABLE}.host, %{TABLE}.total_latency DESC',
                                                       'e.host, (e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'host,statement'),
               ('io_by_thread_by_latency'            , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'user,thread_id,processlist_id'),
               ('io_global_by_file_by_bytes'         , '%{TABLE}.total DESC',
                                                       '(e.total-IFNULL(s.total, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', 100, 'file'),
               ('io_global_by_file_by_latency'       , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', 100, 'file'),
               ('io_global_by_wait_by_bytes'         , '%{TABLE}.total_requested DESC',
                                                       '(e.total_requested-IFNULL(s.total_requested, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'event_name'),
               ('io_global_by_wait_by_latency'       , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'event_name'),
               ('schema_index_statistics'            , '(%{TABLE}.select_latency+%{TABLE}.insert_latency+%{TABLE}.update_latency+%{TABLE}.delete_latency) DESC',
                                                       '((e.select_latency+e.insert_latency+e.update_latency+e.delete_latency)-IFNULL(s.select_latency+s.insert_latency+s.update_latency+s.delete_latency, 0)) DESC',
                                                       '((e.rows_selected+e.insert_latency+e.rows_updated+e.rows_deleted)-IFNULL(s.rows_selected+s.rows_inserted+s.rows_updated+s.rows_deleted, 0)) > 0',
                                                       100, 'table_schema,table_name,index_name'),
               ('schema_table_statistics'            , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) > 0', 100, 'table_schema,table_name'),
               ('schema_tables_with_full_table_scans', '%{TABLE}.rows_full_scanned DESC',
                                                       '(e.rows_full_scanned-IFNULL(s.rows_full_scanned, 0)) DESC',
                                                       '(e.rows_full_scanned-IFNULL(s.rows_full_scanned, 0)) > 0', 100, 'object_schema,object_name'),
               ('user_summary'                       , '%{TABLE}.statement_latency DESC',
                                                       '(e.statement_latency-IFNULL(s.statement_latency, 0)) DESC',
                                                       '(e.statements - IFNULL(s.statements, 0)) > 0', NULL, 'user'),
               ('user_summary_by_file_io'            , '%{TABLE}.io_latency DESC',
                                                       '(e.io_latency-IFNULL(s.io_latency, 0)) DESC',
                                                       '(e.ios - IFNULL(s.ios, 0)) > 0', NULL, 'user'),
               ('user_summary_by_file_io_type'       , '%{TABLE}.user, %{TABLE}.latency DESC',
                                                       'e.user, (e.latency-IFNULL(s.latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'user,event_name'),
               ('user_summary_by_stages'             , '%{TABLE}.user, %{TABLE}.total_latency DESC',
                                                       'e.user, (e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'user,event_name'),
               ('user_summary_by_statement_latency'  , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'user'),
               ('user_summary_by_statement_type'     , '%{TABLE}.user, %{TABLE}.total_latency DESC',
                                                       'e.user, (e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'user,statement'),
               ('wait_classes_global_by_avg_latency' , 'IFNULL(%{TABLE}.total_latency / NULLIF(%{TABLE}.total, 0), 0) DESC',
                                                       'IFNULL((e.total_latency-IFNULL(s.total_latency, 0)) / NULLIF((e.total - IFNULL(s.total, 0)), 0), 0) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'event_class'),
               ('wait_classes_global_by_latency'     , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'event_class'),
               ('waits_by_host_by_latency'           , '%{TABLE}.host, %{TABLE}.total_latency DESC',
                                                       'e.host, (e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'host,event'),
               ('waits_by_user_by_latency'           , '%{TABLE}.user, %{TABLE}.total_latency DESC',
                                                       'e.user, (e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'user,event'),
               ('waits_global_by_latency'            , '%{TABLE}.total_latency DESC',
                                                       '(e.total_latency-IFNULL(s.total_latency, 0)) DESC',
                                                       '(e.total - IFNULL(s.total, 0)) > 0', NULL, 'events')
        ;
    END IF;
    SELECT '

=======================

     Configuration

=======================

' AS '';
    -- Get the configuration.
    SELECT 'GLOBAL VARIABLES' AS 'The following output is:';
    SELECT LOWER(VARIABLE_NAME) AS Variable_name, VARIABLE_VALUE AS Variable_value FROM performance_schema.global_variables ORDER BY VARIABLE_NAME;
    IF (v_has_ps = 'YES') THEN
        -- Overview of the Performance Schema dynamic settings used for this report.
        SELECT 'Performance Schema Setup - Actors' AS 'The following output is:';
        SELECT * FROM performance_schema.setup_actors;
        SELECT 'Performance Schema Setup - Consumers' AS 'The following output is:';
        SELECT NAME AS Consumer, ENABLED, sys.ps_is_consumer_enabled(NAME) AS COLLECTS
          FROM performance_schema.setup_consumers;
        SELECT 'Performance Schema Setup - Instruments' AS 'The following output is:';
        SELECT SUBSTRING_INDEX(NAME, '/', 2) AS 'InstrumentClass',
               ROUND(100*SUM(IF(ENABLED = 'YES', 1, 0))/COUNT(*), 2) AS 'EnabledPct',
               ROUND(100*SUM(IF(TIMED = 'YES', 1, 0))/COUNT(*), 2) AS 'TimedPct'
          FROM performance_schema.setup_instruments
         GROUP BY SUBSTRING_INDEX(NAME, '/', 2)
         ORDER BY SUBSTRING_INDEX(NAME, '/', 2);
        SELECT 'Performance Schema Setup - Objects' AS 'The following output is:';
        SELECT * FROM performance_schema.setup_objects;
        SELECT 'Performance Schema Setup - Threads' AS 'The following output is:';
        SELECT `TYPE` AS ThreadType, COUNT(*) AS 'Total', ROUND(100*SUM(IF(INSTRUMENTED = 'YES', 1, 0))/COUNT(*), 2) AS 'InstrumentedPct'
          FROM performance_schema.threads
        GROUP BY TYPE;
    END IF;
    IF (v_has_replication = 'NO') THEN
        SELECT 'No Replication Configured' AS 'Replication Status';
    ELSE
        -- No guarantee that replication is actually configured, but we can't really know
        SELECT CONCAT('Replication Configured: ', v_has_replication, ' - Performance Schema Replication Tables: ', v_has_ps_replication) AS 'Replication Status';
        IF (v_has_ps_replication = 'YES') THEN
            SELECT 'Replication - Connection Configuration' AS 'The following output is:';
            SELECT * FROM performance_schema.replication_connection_configuration ORDER BY CHANNEL_NAME ;
        END IF;
        IF (v_has_ps_replication = 'YES') THEN
            SELECT 'Replication - Applier Configuration' AS 'The following output is:';
            SELECT * FROM performance_schema.replication_applier_configuration ORDER BY CHANNEL_NAME;
        END IF;
        IF (@@master_info_repository = 'TABLE') THEN
            SELECT 'Replication - Master Info Repository Configuration' AS 'The following output is:';
            -- Can't just do SELECT *  as the password may be present in plain text
            -- Don't include binary log file and position as that will be determined in each iteration as well
            SELECT  Channel_name, Host, User_name, Port, Connect_retry,
                   Enabled_ssl, Ssl_ca, Ssl_capath, Ssl_cert, Ssl_cipher, Ssl_key, Ssl_verify_server_cert,
                   Heartbeat, Bind, Ignored_server_ids, Uuid, Retry_count, Ssl_crl, Ssl_crlpath,
                   Tls_version, Enabled_auto_position
              FROM mysql.slave_master_info ORDER BY Channel_name ;
        END IF;
        IF (@@relay_log_info_repository = 'TABLE') THEN
            SELECT 'Replication - Relay Log Repository Configuration' AS 'The following output is:';
            SELECT  Channel_name, Sql_delay, Number_of_workers, Id
              FROM mysql.slave_relay_log_info ORDER BY Channel_name ;
        END IF;
    END IF;
    IF (v_has_ndb IN ('DEFAULT', 'YES')) THEN
       SELECT 'Cluster Thread Blocks' AS 'The following output is:';
       SELECT * FROM ndbinfo.threadblocks;
    END IF;
    -- For a number of sys views as well as events_statements_summary_by_digest,
    -- just get the start data and then at the end output the overall and delta values
    IF (v_has_ps = 'YES') THEN
        IF (@sys.diagnostics.include_raw = 'ON') THEN
            SELECT '

========================

     Initial Status

========================

' AS '';
        END IF;
        DROP TEMPORARY TABLE IF EXISTS tmp_digests_start;
        CALL sys.statement_performance_analyzer('create_tmp', 'tmp_digests_start', NULL);
        CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
        CALL sys.statement_performance_analyzer('save', 'tmp_digests_start', NULL);
        -- Loop over the sys views where deltas should be calculated.
        IF (@sys.diagnostics.include_raw = 'ON') THEN
            SET @sys.diagnostics.sql = REPLACE(@sys.diagnostics.sql_gen_query_template, '%{OUTPUT}', 'start');
            IF (@sys.debug = 'ON') THEN
                SELECT 'The following query will be used to generate the query for each sys view' AS 'Debug';
                SELECT @sys.diagnostics.sql AS 'Debug';
            END IF;
            PREPARE stmt_gen_query FROM @sys.diagnostics.sql;
        END IF;
        SET v_done = FALSE;
        OPEN c_sysviews_w_delta;
        c_sysviews_w_delta_loop: LOOP
            FETCH c_sysviews_w_delta INTO v_table_name;
            IF v_done THEN
                LEAVE c_sysviews_w_delta_loop;
            END IF;
            IF (@sys.debug = 'ON') THEN
                SELECT CONCAT('The following queries are for storing the initial content of ', v_table_name) AS 'Debug';
            END IF;
            CALL sys.execute_prepared_stmt(CONCAT('DROP TEMPORARY TABLE IF EXISTS `tmp_', v_table_name, '_start`'));
            CALL sys.execute_prepared_stmt(CONCAT('CREATE TEMPORARY TABLE `tmp_', v_table_name, '_start` SELECT * FROM `sys`.`x$', v_table_name, '`'));
            IF (@sys.diagnostics.include_raw = 'ON') THEN
                SET @sys.diagnostics.table_name = CONCAT('x$', v_table_name);
                EXECUTE stmt_gen_query USING @sys.diagnostics.table_name;
                -- If necessary add ORDER BY and LIMIT
                SELECT CONCAT(@sys.diagnostics.sql_select,
                              IF(order_by IS NOT NULL, CONCAT('\n ORDER BY ', REPLACE(order_by, '%{TABLE}', CONCAT('tmp_', v_table_name, '_start'))), ''),
                              IF(limit_rows IS NOT NULL, CONCAT('\n LIMIT ', limit_rows), '')
                       )
                  INTO @sys.diagnostics.sql_select
                  FROM tmp_sys_views_delta
                 WHERE TABLE_NAME COLLATE utf8mb4_0900_as_ci = v_table_name;
                SELECT CONCAT('Initial ', v_table_name) AS 'The following output is:';
                CALL sys.execute_prepared_stmt(@sys.diagnostics.sql_select);
            END IF;
        END LOOP;
        CLOSE c_sysviews_w_delta;
        IF (@sys.diagnostics.include_raw = 'ON') THEN
            DEALLOCATE PREPARE stmt_gen_query;
        END IF;
    END IF;
    -- If in_include_status_summary is TRUE then a temporary table is required to store the data
    SET v_sql_status_summary_select = 'SELECT Variable_name',
        v_sql_status_summary_delta  = '',
        v_sql_status_summary_from   = '';
    -- Start the loop
    REPEAT
        SET v_output_count = v_output_count + 1;
        IF (v_output_count > 1) THEN
            -- Don't sleep on the first execution
            SET v_sleep = in_interval-(UNIX_TIMESTAMP(NOW(2))-v_iter_start);
            SELECT NOW() AS 'Time', CONCAT('Going to sleep for ', v_sleep, ' seconds. Please do not interrupt') AS 'The following output is:';
            DO SLEEP(in_interval);
        END IF;
        SET v_iter_start = UNIX_TIMESTAMP(NOW(2));
        SELECT NOW(), CONCAT('Iteration Number ', IFNULL(v_output_count, 'NULL')) AS 'The following output is:';
        -- Even in 5.7 there is no way to get all the info from SHOW MASTER|SLAVE STATUS using the Performance Schema or
        -- other tables, so include them even though they are no longer optimal solutions and if present get the additional
        -- information from the other tables available.
        IF (@@log_bin = 1) THEN
            SELECT 'SHOW MASTER STATUS' AS 'The following output is:';
            SHOW MASTER STATUS;
        END IF;
        IF (v_has_replication <> 'NO') THEN
            SELECT 'SHOW SLAVE STATUS' AS 'The following output is:';
            SHOW SLAVE STATUS;
            IF (v_has_ps_replication = 'YES') THEN
                SELECT 'Replication Connection Status' AS 'The following output is:';
                SELECT * FROM performance_schema.replication_connection_status;
                SELECT 'Replication Applier Status' AS 'The following output is:';
                SELECT * FROM performance_schema.replication_applier_status ORDER BY CHANNEL_NAME;
                SELECT 'Replication Applier Status - Coordinator' AS 'The following output is:';
                SELECT * FROM performance_schema.replication_applier_status_by_coordinator ORDER BY CHANNEL_NAME;
                SELECT 'Replication Applier Status - Worker' AS 'The following output is:';
                SELECT * FROM performance_schema.replication_applier_status_by_worker ORDER BY CHANNEL_NAME, WORKER_ID;
            END IF;
            IF (@@master_info_repository = 'TABLE') THEN
                SELECT 'Replication - Master Log Status' AS 'The following output is:';
                SELECT Master_log_name, Master_log_pos FROM mysql.slave_master_info;
            END IF;
            IF (@@relay_log_info_repository = 'TABLE') THEN
                SELECT 'Replication - Relay Log Status' AS 'The following output is:';
                SELECT sys.format_path(Relay_log_name) AS Relay_log_name, Relay_log_pos, Master_log_name, Master_log_pos FROM mysql.slave_relay_log_info;
                SELECT 'Replication - Worker Status' AS 'The following output is:';
                SELECT Id, sys.format_path(Relay_log_name) AS Relay_log_name, Relay_log_pos, Master_log_name, Master_log_pos,
                       sys.format_path(Checkpoint_relay_log_name) AS Checkpoint_relay_log_name, Checkpoint_relay_log_pos,
                       Checkpoint_master_log_name, Checkpoint_master_log_pos, Checkpoint_seqno, Checkpoint_group_size,
                       HEX(Checkpoint_group_bitmap) AS Checkpoint_group_bitmap , Channel_name
                  FROM mysql.slave_worker_info
              ORDER BY  Channel_name, Id;
            END IF;
        END IF;
        -- We need one table per output as a temporary table cannot be opened twice in the same query, and we need to
        -- join the outputs in the summary at the end.
        SET v_table_name = CONCAT('tmp_metrics_', v_output_count);
        CALL sys.execute_prepared_stmt(CONCAT('DROP TEMPORARY TABLE IF EXISTS ', v_table_name));
        -- Currently information_schema.GLOBAL_STATUS has VARIABLE_VALUE as varchar(1024)
        CALL sys.execute_prepared_stmt(CONCAT('CREATE TEMPORARY TABLE ', v_table_name, ' (
  Variable_name VARCHAR(193) NOT NULL,
  Variable_value VARCHAR(1024),
  Type VARCHAR(225) NOT NULL,
  Enabled ENUM(''YES'', ''NO'', ''PARTIAL'') NOT NULL,
  PRIMARY KEY (Type, Variable_name)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4'));
        IF (v_has_metrics) THEN
            SET @sys.diagnostics.sql = CONCAT(
                'INSERT INTO ', v_table_name,
                ' SELECT Variable_name, REPLACE(Variable_value, ''\n'', ''\\\\n'') AS Variable_value, Type, Enabled FROM sys.metrics'
            );
        ELSE
            -- 5.7+ and the Performance Schema disabled. Use information_schema.GLOBAL_STATUS instead like in 5.6.
            SET @sys.diagnostics.sql = CONCAT(
                'INSERT INTO ', v_table_name,
                '(SELECT LOWER(VARIABLE_NAME) AS Variable_name, REPLACE(VARIABLE_VALUE, ''\n'', ''\\\\n'') AS Variable_value,
                         ''Global Status'' AS Type, ''YES'' AS Enabled
  FROM performance_schema.global_status
) UNION ALL (
SELECT NAME AS Variable_name, COUNT AS Variable_value,
       CONCAT(''InnoDB Metrics - '', SUBSYSTEM) AS Type,
       IF(STATUS = ''enabled'', ''YES'', ''NO'') AS Enabled
  FROM information_schema.INNODB_METRICS
  -- Deduplication - some variables exists both in GLOBAL_STATUS and INNODB_METRICS
  -- Keep the one from GLOBAL_STATUS as it is always enabled and it''s more likely to be used for existing tools.
 WHERE NAME NOT IN (
     ''lock_row_lock_time'', ''lock_row_lock_time_avg'', ''lock_row_lock_time_max'', ''lock_row_lock_waits'',
     ''buffer_pool_reads'', ''buffer_pool_read_requests'', ''buffer_pool_write_requests'', ''buffer_pool_wait_free'',
     ''buffer_pool_read_ahead'', ''buffer_pool_read_ahead_evicted'', ''buffer_pool_pages_total'', ''buffer_pool_pages_misc'',
     ''buffer_pool_pages_data'', ''buffer_pool_bytes_data'', ''buffer_pool_pages_dirty'', ''buffer_pool_bytes_dirty'',
     ''buffer_pool_pages_free'', ''buffer_pages_created'', ''buffer_pages_written'', ''buffer_pages_read'',
     ''buffer_data_reads'', ''buffer_data_written'', ''file_num_open_files'',
     ''os_log_bytes_written'', ''os_log_fsyncs'', ''os_log_pending_fsyncs'', ''os_log_pending_writes'',
     ''log_waits'', ''log_write_requests'', ''log_writes'', ''innodb_dblwr_writes'', ''innodb_dblwr_pages_written'', ''innodb_page_size'')
) UNION ALL (
SELECT ''NOW()'' AS Variable_name, NOW(3) AS Variable_value, ''System Time'' AS Type, ''YES'' AS Enabled
) UNION ALL (
SELECT ''UNIX_TIMESTAMP()'' AS Variable_name, ROUND(UNIX_TIMESTAMP(NOW(3)), 3) AS Variable_value, ''System Time'' AS Type, ''YES'' AS Enabled
)
 ORDER BY Type, Variable_name;'
            );
        END IF;
        CALL sys.execute_prepared_stmt(@sys.diagnostics.sql);
        -- Prepare the query to retrieve the summary
        CALL sys.execute_prepared_stmt(
            CONCAT('(SELECT Variable_value INTO @sys.diagnostics.output_time FROM ', v_table_name, ' WHERE Type = ''System Time'' AND Variable_name = ''UNIX_TIMESTAMP()'')')
        );
        SET v_output_time = @sys.diagnostics.output_time;
        -- Limit each value to v_status_summary_width chars (when v_has_ndb = TRUE the values can be very wide - refer to the output here for the full values)
        -- v_sql_status_summary_select, v_sql_status_summary_delta, v_sql_status_summary_from
        SET v_sql_status_summary_select = CONCAT(v_sql_status_summary_select, ',
       CONCAT(
           LEFT(s', v_output_count, '.Variable_value, ', v_status_summary_width, '),
           IF(', REPLACE(v_no_delta_names, '%{COUNT}', v_output_count), ' AND s', v_output_count, '.Variable_value REGEXP ''^[0-9]+(\\\\.[0-9]+)?$'', CONCAT('' ('', ROUND(s', v_output_count, '.Variable_value/', v_output_time, ', 2), ''/sec)''), '''')
       ) AS ''Output ', v_output_count, ''''),
            v_sql_status_summary_from   = CONCAT(v_sql_status_summary_from, '
',
                                                    IF(v_output_count = 1, '  FROM ', '       INNER JOIN '),
                                                    v_table_name, ' s', v_output_count,
                                                    IF (v_output_count = 1, '', ' USING (Type, Variable_name)'));
        IF (v_output_count > 1) THEN
            SET v_sql_status_summary_delta  = CONCAT(v_sql_status_summary_delta, ',
       IF(', REPLACE(v_no_delta_names, '%{COUNT}', v_output_count), ' AND s', (v_output_count-1), '.Variable_value REGEXP ''^[0-9]+(\\\\.[0-9]+)?$'' AND s', v_output_count, '.Variable_value REGEXP ''^[0-9]+(\\\\.[0-9]+)?$'',
          CONCAT(IF(s', (v_output_count-1), '.Variable_value REGEXP ''^[0-9]+\\\\.[0-9]+$'' OR s', v_output_count, '.Variable_value REGEXP ''^[0-9]+\\\\.[0-9]+$'',
                    ROUND((s', v_output_count, '.Variable_value-s', (v_output_count-1), '.Variable_value), 2),
                    (s', v_output_count, '.Variable_value-s', (v_output_count-1), '.Variable_value)
                   ),
                 '' ('', ROUND((s', v_output_count, '.Variable_value-s', (v_output_count-1), '.Variable_value)/(', v_output_time, '-', v_output_time_prev, '), 2), ''/sec)''
          ),
          ''''
       ) AS ''Delta (', (v_output_count-1), ' -> ', v_output_count, ')''');
        END IF;
        SET v_output_time_prev = v_output_time;
        IF (@sys.diagnostics.include_raw = 'ON') THEN
            IF (v_has_metrics) THEN
                SELECT 'SELECT * FROM sys.metrics' AS 'The following output is:';
            ELSE
                SELECT 'sys.metrics equivalent' AS 'The following output is:';
            END IF;
            -- Ensures that the output here is the same as the one used in the status summary at the end
            CALL sys.execute_prepared_stmt(CONCAT('SELECT Type, Variable_name, Enabled, Variable_value FROM ', v_table_name, ' ORDER BY Type, Variable_name'));
        END IF;
        -- InnoDB
        IF (v_has_innodb IN ('DEFAULT', 'YES')) THEN
            SELECT 'SHOW ENGINE INNODB STATUS' AS 'The following output is:';
            EXECUTE stmt_innodb_status;
            SELECT 'InnoDB - Transactions' AS 'The following output is:';
            SELECT * FROM information_schema.INNODB_TRX;
        END IF;
        -- NDBCluster
        IF (v_has_ndb IN ('DEFAULT', 'YES')) THEN
            SELECT 'SHOW ENGINE NDBCLUSTER STATUS' AS 'The following output is:';
            EXECUTE stmt_ndbcluster_status;
            SELECT 'ndbinfo.memoryusage' AS 'The following output is:';
            SELECT node_id, memory_type, sys.format_bytes(used) AS used, used_pages, sys.format_bytes(total) AS total, total_pages,
                   ROUND(100*(used/total), 2) AS 'Used %'
            FROM ndbinfo.memoryusage;
            -- Loop over the ndbinfo tables (except memoryusage which was handled separately above).
            -- The exact tables available are version dependent, so get the list from the Information Schema.
            SET v_done = FALSE;
            OPEN c_ndbinfo;
            c_ndbinfo_loop: LOOP
                FETCH c_ndbinfo INTO v_table_name;
                IF v_done THEN
                LEAVE c_ndbinfo_loop;
                END IF;
                SELECT CONCAT('SELECT * FROM ndbinfo.', v_table_name) AS 'The following output is:';
                CALL sys.execute_prepared_stmt(CONCAT('SELECT * FROM `ndbinfo`.`', v_table_name, '`'));
            END LOOP;
            CLOSE c_ndbinfo;
            SELECT * FROM information_schema.FILES;
        END IF;
        SELECT 'SELECT * FROM sys.processlist' AS 'The following output is:';
        SELECT processlist.* FROM sys.processlist;
        IF (v_has_ps = 'YES') THEN
            -- latest_file_io
            IF (sys.ps_is_consumer_enabled('events_waits_history_long') = 'YES') THEN
                SELECT 'SELECT * FROM sys.latest_file_io' AS 'The following output is:';
                SELECT * FROM sys.latest_file_io;
            END IF;
            -- current memory usage
            IF (EXISTS(SELECT 1 FROM performance_schema.setup_instruments WHERE NAME LIKE 'memory/%' AND ENABLED = 'YES')) THEN
                SELECT 'SELECT * FROM sys.memory_by_host_by_current_bytes' AS 'The following output is:';
                SELECT * FROM sys.memory_by_host_by_current_bytes;
                SELECT 'SELECT * FROM sys.memory_by_thread_by_current_bytes' AS 'The following output is:';
                SELECT * FROM sys.memory_by_thread_by_current_bytes;
                SELECT 'SELECT * FROM sys.memory_by_user_by_current_bytes' AS 'The following output is:';
                SELECT * FROM sys.memory_by_user_by_current_bytes;
                SELECT 'SELECT * FROM sys.memory_global_by_current_bytes' AS 'The following output is:';
                SELECT * FROM sys.memory_global_by_current_bytes;
            END IF;
        END IF;
        SET v_runtime = (UNIX_TIMESTAMP(NOW(2)) - v_start);
    UNTIL (v_runtime + in_interval >= in_max_runtime) END REPEAT;
    -- Get Performance Schema status
    IF (v_has_ps = 'YES') THEN
        SELECT 'SHOW ENGINE PERFORMANCE_SCHEMA STATUS' AS 'The following output is:';
        EXECUTE stmt_ps_status;
    END IF;
    -- Deallocate prepared statements
    IF (v_has_innodb IN ('DEFAULT', 'YES')) THEN
        DEALLOCATE PREPARE stmt_innodb_status;
    END IF;
    IF (v_has_ps = 'YES') THEN
        DEALLOCATE PREPARE stmt_ps_status;
    END IF;
    IF (v_has_ndb IN ('DEFAULT', 'YES')) THEN
        DEALLOCATE PREPARE stmt_ndbcluster_status;
    END IF;
    SELECT '

============================

     Schema Information

============================

' AS '';
    SELECT COUNT(*) AS 'Total Number of Tables' FROM information_schema.TABLES;
    -- The cost of information_schema.TABLES.DATA_LENGTH depends mostly on the number of tables
    IF (@sys.diagnostics.allow_i_s_tables = 'ON') THEN
        SELECT 'Storage Engine Usage' AS 'The following output is:';
        SELECT ENGINE, COUNT(*) AS NUM_TABLES,
                sys.format_bytes(SUM(DATA_LENGTH)) AS DATA_LENGTH,
                sys.format_bytes(SUM(INDEX_LENGTH)) AS INDEX_LENGTH,
                sys.format_bytes(SUM(DATA_LENGTH+INDEX_LENGTH)) AS TOTAL
            FROM information_schema.TABLES
            GROUP BY ENGINE;
        SELECT 'Schema Object Overview' AS 'The following output is:';
        SELECT * FROM sys.schema_object_overview;
        SELECT 'Tables without a PRIMARY KEY' AS 'The following output is:';
        SELECT TABLES.TABLE_SCHEMA, ENGINE, COUNT(*) AS NumTables
          FROM information_schema.TABLES
               LEFT OUTER JOIN information_schema.STATISTICS ON STATISTICS.TABLE_SCHEMA = TABLES.TABLE_SCHEMA
                                                                AND STATISTICS.TABLE_NAME = TABLES.TABLE_NAME
                                                                AND STATISTICS.INDEX_NAME = 'PRIMARY'
         WHERE STATISTICS.TABLE_NAME IS NULL
               AND TABLES.TABLE_SCHEMA NOT IN ('mysql', 'information_schema', 'performance_schema', 'sys')
               AND TABLES.TABLE_TYPE = 'BASE TABLE'
         GROUP BY TABLES.TABLE_SCHEMA, ENGINE;
    END IF;
    IF (v_has_ps = 'YES') THEN
        SELECT 'Unused Indexes' AS 'The following output is:';
        SELECT object_schema, COUNT(*) AS NumUnusedIndexes
          FROM performance_schema.table_io_waits_summary_by_index_usage
         WHERE index_name IS NOT NULL
               AND count_star = 0
               AND object_schema NOT IN ('mysql', 'sys')
               AND index_name != 'PRIMARY'
         GROUP BY object_schema;
    END IF;
    IF (v_has_ps = 'YES') THEN
        SELECT '

=========================

     Overall Status

=========================

' AS '';
        SELECT 'CALL sys.ps_statement_avg_latency_histogram()' AS 'The following output is:';
        CALL sys.ps_statement_avg_latency_histogram();
        CALL sys.statement_performance_analyzer('snapshot', NULL, NULL);
        CALL sys.statement_performance_analyzer('overall', NULL, 'with_runtimes_in_95th_percentile');
        SET @sys.diagnostics.sql = REPLACE(@sys.diagnostics.sql_gen_query_template, '%{OUTPUT}', 'end');
        IF (@sys.debug = 'ON') THEN
            SELECT 'The following query will be used to generate the query for each sys view' AS 'Debug';
            SELECT @sys.diagnostics.sql AS 'Debug';
        END IF;
        PREPARE stmt_gen_query FROM @sys.diagnostics.sql;
        SET v_done = FALSE;
        OPEN c_sysviews_w_delta;
        c_sysviews_w_delta_loop: LOOP
            FETCH c_sysviews_w_delta INTO v_table_name;
            IF v_done THEN
                LEAVE c_sysviews_w_delta_loop;
            END IF;
            IF (@sys.debug = 'ON') THEN
                SELECT CONCAT('The following queries are for storing the final content of ', v_table_name) AS 'Debug';
            END IF;
            CALL sys.execute_prepared_stmt(CONCAT('DROP TEMPORARY TABLE IF EXISTS `tmp_', v_table_name, '_end`'));
            CALL sys.execute_prepared_stmt(CONCAT('CREATE TEMPORARY TABLE `tmp_', v_table_name, '_end` SELECT * FROM `sys`.`x$', v_table_name, '`'));
            SET @sys.diagnostics.table_name = CONCAT('x$', v_table_name);
            EXECUTE stmt_gen_query USING @sys.diagnostics.table_name;
            -- If necessary add ORDER BY and LIMIT
            SELECT CONCAT(@sys.diagnostics.sql_select,
                            IF(order_by IS NOT NULL, CONCAT('\n ORDER BY ', REPLACE(order_by, '%{TABLE}', CONCAT('tmp_', v_table_name, '_end'))), ''),
                            IF(limit_rows IS NOT NULL, CONCAT('\n LIMIT ', limit_rows), '')
                    )
                INTO @sys.diagnostics.sql_select
                FROM tmp_sys_views_delta
                WHERE TABLE_NAME COLLATE utf8mb4_0900_as_ci = v_table_name;
            SELECT CONCAT('Overall ', v_table_name) AS 'The following output is:';
            CALL sys.execute_prepared_stmt(@sys.diagnostics.sql_select);
        END LOOP;
        CLOSE c_sysviews_w_delta;
        DEALLOCATE PREPARE stmt_gen_query;
        SELECT '

======================

     Delta Status

======================

' AS '';
        CALL sys.statement_performance_analyzer('delta', 'tmp_digests_start', 'with_runtimes_in_95th_percentile');
        CALL sys.statement_performance_analyzer('cleanup', NULL, NULL);
        DROP TEMPORARY TABLE tmp_digests_start;
        -- @sys.diagnostics.sql_gen_query_delta is defined near the to together with @sys.diagnostics.sql_gen_query_template
        IF (@sys.debug = 'ON') THEN
            SELECT 'The following query will be used to generate the query for each sys view delta' AS 'Debug';
            SELECT @sys.diagnostics.sql_gen_query_delta AS 'Debug';
        END IF;
        PREPARE stmt_gen_query_delta FROM @sys.diagnostics.sql_gen_query_delta;
        SET v_old_group_concat_max_len = @@session.group_concat_max_len;
        SET @@session.group_concat_max_len = 2048;
        SET v_done = FALSE;
        OPEN c_sysviews_w_delta;
        c_sysviews_w_delta_loop: LOOP
            FETCH c_sysviews_w_delta INTO v_table_name;
            IF v_done THEN
                LEAVE c_sysviews_w_delta_loop;
            END IF;
            SET @sys.diagnostics.table_name = v_table_name;
            EXECUTE stmt_gen_query_delta USING @sys.diagnostics.table_name;
            -- If necessary add WHERE, ORDER BY, and LIMIT
            SELECT CONCAT(@sys.diagnostics.sql_select,
                            IF(where_delta IS NOT NULL, CONCAT('\n WHERE ', where_delta), ''),
                            IF(order_by_delta IS NOT NULL, CONCAT('\n ORDER BY ', order_by_delta), ''),
                            IF(limit_rows IS NOT NULL, CONCAT('\n LIMIT ', limit_rows), '')
                    )
                INTO @sys.diagnostics.sql_select
                FROM tmp_sys_views_delta
                WHERE TABLE_NAME COLLATE utf8mb4_0900_as_ci = v_table_name;
            SELECT CONCAT('Delta ', v_table_name) AS 'The following output is:';
            CALL sys.execute_prepared_stmt(@sys.diagnostics.sql_select);
            CALL sys.execute_prepared_stmt(CONCAT('DROP TEMPORARY TABLE `tmp_', v_table_name, '_end`'));
            CALL sys.execute_prepared_stmt(CONCAT('DROP TEMPORARY TABLE `tmp_', v_table_name, '_start`'));
        END LOOP;
        CLOSE c_sysviews_w_delta;
        SET @@session.group_concat_max_len = v_old_group_concat_max_len;
        DEALLOCATE PREPARE stmt_gen_query_delta;
        DROP TEMPORARY TABLE tmp_sys_views_delta;
    END IF;
    IF (v_has_metrics) THEN
        SELECT 'SELECT * FROM sys.metrics' AS 'The following output is:';
    ELSE
        SELECT 'sys.metrics equivalent' AS 'The following output is:';
    END IF;
    CALL sys.execute_prepared_stmt(
        CONCAT(v_sql_status_summary_select, v_sql_status_summary_delta, ', Type, s1.Enabled', v_sql_status_summary_from,
               '
 ORDER BY Type, Variable_name'
        )
    );
    -- Remove all the metrics temporary tables again
    SET v_count = 0;
    WHILE (v_count < v_output_count) DO
        SET v_count = v_count + 1;
        SET v_table_name = CONCAT('tmp_metrics_', v_count);
        CALL sys.execute_prepared_stmt(CONCAT('DROP TEMPORARY TABLE IF EXISTS ', v_table_name));
    END WHILE;
    IF (in_auto_config <> 'current') THEN
        CALL sys.ps_setup_reload_saved();
        SET sql_log_bin = @log_bin;
    END IF;
    -- Reset the @sys.diagnostics.% user variables internal to this procedure
    SET @sys.diagnostics.output_time            = NULL,
        @sys.diagnostics.sql                    = NULL,
        @sys.diagnostics.sql_gen_query_delta    = NULL,
        @sys.diagnostics.sql_gen_query_template = NULL,
        @sys.diagnostics.sql_select             = NULL,
        @sys.diagnostics.table_name             = NULL;
    -- Restore INSTRUMENTED for this thread
    IF (v_this_thread_enabled = 'YES') THEN
        CALL sys.ps_setup_enable_thread(CONNECTION_ID());
    END IF;
    IF (@log_bin = 1) THEN
        SET sql_log_bin = @log_bin;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure sys.execute_prepared_stmt
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `execute_prepared_stmt`(
        IN in_query longtext CHARACTER SET UTF8MB4
    )
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes the query in the argument and executes it using a prepared statement. The prepared statement is deallocated,\nso the procedure is mainly useful for executing one off dynamically created queries.\n\nThe sys_execute_prepared_stmt prepared statement name is used for the query and is required not to exist.\n\n\nParameters\n-----------\n\nin_query (longtext CHARACTER SET UTF8MB4):\n  The query to execute.\n\n\nConfiguration Options\n----------------------\n\nsys.debug\n  Whether to provide debugging output.\n  Default is ''OFF''. Set to ''ON'' to include.\n\n\nExample\n--------\n\nmysql> CALL sys.execute_prepared_stmt(''SELECT * FROM sys.sys_config'');\n+------------------------+-------+---------------------+--------+\n| variable               | value | set_time            | set_by |\n+------------------------+-------+---------------------+--------+\n| statement_truncate_len | 64    | 2015-06-30 13:06:00 | NULL   |\n+------------------------+-------+---------------------+--------+\n1 row in set (0.00 sec)\n\nQuery OK, 0 rows affected (0.00 sec)\n'
BEGIN
    -- Set configuration options
    IF (@sys.debug IS NULL) THEN
        SET @sys.debug = sys.sys_get_config('debug', 'OFF');
    END IF;
    -- Verify the query exists
    -- The shortest possible query is "DO 1"
    IF (in_query IS NULL OR LENGTH(in_query) < 4) THEN
       SIGNAL SQLSTATE '45000'
          SET MESSAGE_TEXT = "The @sys.execute_prepared_stmt.sql must contain a query";
    END IF;
    SET @sys.execute_prepared_stmt.sql = in_query;
    IF (@sys.debug = 'ON') THEN
        SELECT @sys.execute_prepared_stmt.sql AS 'Debug';
    END IF;
    PREPARE sys_execute_prepared_stmt FROM @sys.execute_prepared_stmt.sql;
    EXECUTE sys_execute_prepared_stmt;
    DEALLOCATE PREPARE sys_execute_prepared_stmt;
    SET @sys.execute_prepared_stmt.sql = NULL;
END//
DELIMITER ;

-- Dumping structure for function sys.extract_schema_from_file_name
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `extract_schema_from_file_name`(
        path VARCHAR(512)
    ) RETURNS varchar(64) CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a raw file path, and attempts to extract the schema name from it.\n\nUseful for when interacting with Performance Schema data \nconcerning IO statistics, for example.\n\nCurrently relies on the fact that a table data file will be within a \nspecified database directory (will not work with partitions or tables\nthat specify an individual DATA_DIRECTORY).\n\nParameters\n-----------\n\npath (VARCHAR(512)):\n  The full file path to a data file to extract the schema name from.\n\nReturns\n-----------\n\nVARCHAR(64)\n\nExample\n-----------\n\nmysql> SELECT sys.extract_schema_from_file_name(''/var/lib/mysql/employees/employee.ibd'');\n+----------------------------------------------------------------------------+\n| sys.extract_schema_from_file_name(''/var/lib/mysql/employees/employee.ibd'') |\n+----------------------------------------------------------------------------+\n| employees                                                                  |\n+----------------------------------------------------------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    RETURN LEFT(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(path, '\\', '/'), '/', -2), '/', 1), 64);
END//
DELIMITER ;

-- Dumping structure for function sys.extract_table_from_file_name
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `extract_table_from_file_name`(
        path VARCHAR(512)
    ) RETURNS varchar(64) CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a raw file path, and extracts the table name from it.\n\nUseful for when interacting with Performance Schema data \nconcerning IO statistics, for example.\n\nParameters\n-----------\n\npath (VARCHAR(512)):\n  The full file path to a data file to extract the table name from.\n\nReturns\n-----------\n\nVARCHAR(64)\n\nExample\n-----------\n\nmysql> SELECT sys.extract_table_from_file_name(''/var/lib/mysql/employees/employee.ibd'');\n+---------------------------------------------------------------------------+\n| sys.extract_table_from_file_name(''/var/lib/mysql/employees/employee.ibd'') |\n+---------------------------------------------------------------------------+\n| employee                                                                  |\n+---------------------------------------------------------------------------+\n1 row in set (0.02 sec)\n'
BEGIN
    RETURN LEFT(SUBSTRING_INDEX(REPLACE(SUBSTRING_INDEX(REPLACE(path, '\\', '/'), '/', -1), '@0024', '$'), '.', 1), 64);
END//
DELIMITER ;

-- Dumping structure for function sys.format_bytes
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `format_bytes`(
        -- We feed in and return TEXT here, as aggregates of
        -- bytes can return numbers larger than BIGINT UNSIGNED
        bytes TEXT
    ) RETURNS text CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a raw bytes value, and converts it to a human readable format.\n\nParameters\n-----------\n\nbytes (TEXT):\n  A raw bytes value.\n\nReturns\n-----------\n\nTEXT\n\nExample\n-----------\n\nmysql> SELECT sys.format_bytes(2348723492723746) AS size;\n+----------+\n| size     |\n+----------+\n| 2.09 PiB |\n+----------+\n1 row in set (0.00 sec)\n\nmysql> SELECT sys.format_bytes(2348723492723) AS size;\n+----------+\n| size     |\n+----------+\n| 2.14 TiB |\n+----------+\n1 row in set (0.00 sec)\n\nmysql> SELECT sys.format_bytes(23487234) AS size;\n+-----------+\n| size      |\n+-----------+\n| 22.40 MiB |\n+-----------+\n1 row in set (0.00 sec)\n'
BEGIN
  IF bytes IS NULL THEN RETURN NULL;
  ELSEIF bytes >= 1125899906842624 THEN RETURN CONCAT(ROUND(bytes / 1125899906842624, 2), ' PiB');
  ELSEIF bytes >= 1099511627776 THEN RETURN CONCAT(ROUND(bytes / 1099511627776, 2), ' TiB');
  ELSEIF bytes >= 1073741824 THEN RETURN CONCAT(ROUND(bytes / 1073741824, 2), ' GiB');
  ELSEIF bytes >= 1048576 THEN RETURN CONCAT(ROUND(bytes / 1048576, 2), ' MiB');
  ELSEIF bytes >= 1024 THEN RETURN CONCAT(ROUND(bytes / 1024, 2), ' KiB');
  ELSE RETURN CONCAT(ROUND(bytes, 0), ' bytes');
  END IF;
END//
DELIMITER ;

-- Dumping structure for function sys.format_path
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `format_path`(
        in_path VARCHAR(512)
    ) RETURNS varchar(512) CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a raw path value, and strips out the datadir or tmpdir\nreplacing with @@datadir and @@tmpdir respectively.\n\nAlso normalizes the paths across operating systems, so backslashes\non Windows are converted to forward slashes\n\nParameters\n-----------\n\npath (VARCHAR(512)):\n  The raw file path value to format.\n\nReturns\n-----------\n\nVARCHAR(512) CHARSET UTF8MB4\n\nExample\n-----------\n\nmysql> select @@datadir;\n+-----------------------------------------------+\n| @@datadir                                     |\n+-----------------------------------------------+\n| /Users/mark/sandboxes/SmallTree/AMaster/data/ |\n+-----------------------------------------------+\n1 row in set (0.06 sec)\n\nmysql> select format_path(''/Users/mark/sandboxes/SmallTree/AMaster/data/mysql/proc.MYD'') AS path;\n+--------------------------+\n| path                     |\n+--------------------------+\n| @@datadir/mysql/proc.MYD |\n+--------------------------+\n1 row in set (0.03 sec)\n'
BEGIN
  DECLARE v_path VARCHAR(512);
  DECLARE v_undo_dir VARCHAR(1024);
  DECLARE path_separator CHAR(1) DEFAULT '/';
  IF @@global.version_compile_os LIKE 'win%' THEN
    SET path_separator = '\\';
  END IF;
  -- OSX hides /private/ in variables, but Performance Schema does not
  IF in_path LIKE '/private/%' THEN
    SET v_path = REPLACE(in_path, '/private', '');
  ELSE
    SET v_path = in_path;
  END IF;
  -- @@global.innodb_undo_directory is only set when separate undo logs are used
  SET v_undo_dir = IFNULL((SELECT VARIABLE_VALUE FROM performance_schema.global_variables WHERE VARIABLE_NAME = 'innodb_undo_directory'), '');
  IF v_path IS NULL THEN
    RETURN NULL;
  ELSEIF v_path LIKE CONCAT(@@global.datadir, IF(SUBSTRING(@@global.datadir, -1) = path_separator, '%', CONCAT(path_separator, '%'))) ESCAPE '|' THEN
    SET v_path = REPLACE(v_path, @@global.datadir, CONCAT('@@datadir', IF(SUBSTRING(@@global.datadir, -1) = path_separator, path_separator, '')));
  ELSEIF v_path LIKE CONCAT(@@global.tmpdir, IF(SUBSTRING(@@global.tmpdir, -1) = path_separator, '%', CONCAT(path_separator, '%'))) ESCAPE '|' THEN
    SET v_path = REPLACE(v_path, @@global.tmpdir, CONCAT('@@tmpdir', IF(SUBSTRING(@@global.tmpdir, -1) = path_separator, path_separator, '')));
  ELSEIF v_path LIKE CONCAT(@@global.slave_load_tmpdir, IF(SUBSTRING(@@global.slave_load_tmpdir, -1) = path_separator, '%', CONCAT(path_separator, '%'))) ESCAPE '|' THEN
    SET v_path = REPLACE(v_path, @@global.slave_load_tmpdir, CONCAT('@@slave_load_tmpdir', IF(SUBSTRING(@@global.slave_load_tmpdir, -1) = path_separator, path_separator, '')));
  ELSEIF v_path LIKE CONCAT(@@global.innodb_data_home_dir, IF(SUBSTRING(@@global.innodb_data_home_dir, -1) = path_separator, '%', CONCAT(path_separator, '%'))) ESCAPE '|' THEN
    SET v_path = REPLACE(v_path, @@global.innodb_data_home_dir, CONCAT('@@innodb_data_home_dir', IF(SUBSTRING(@@global.innodb_data_home_dir, -1) = path_separator, path_separator, '')));
  ELSEIF v_path LIKE CONCAT(@@global.innodb_log_group_home_dir, IF(SUBSTRING(@@global.innodb_log_group_home_dir, -1) = path_separator, '%', CONCAT(path_separator, '%'))) ESCAPE '|' THEN
    SET v_path = REPLACE(v_path, @@global.innodb_log_group_home_dir, CONCAT('@@innodb_log_group_home_dir', IF(SUBSTRING(@@global.innodb_log_group_home_dir, -1) = path_separator, path_separator, '')));
  ELSEIF v_path LIKE CONCAT(v_undo_dir, IF(SUBSTRING(v_undo_dir, -1) = path_separator, '%', CONCAT(path_separator, '%'))) ESCAPE '|' THEN
    SET v_path = REPLACE(v_path, v_undo_dir, CONCAT('@@innodb_undo_directory', IF(SUBSTRING(v_undo_dir, -1) = path_separator, path_separator, '')));
  ELSEIF v_path LIKE CONCAT(@@global.basedir, IF(SUBSTRING(@@global.basedir, -1) = path_separator, '%', CONCAT(path_separator, '%'))) ESCAPE '|' THEN
    SET v_path = REPLACE(v_path, @@global.basedir, CONCAT('@@basedir', IF(SUBSTRING(@@global.basedir, -1) = path_separator, path_separator, '')));
  END IF;
  RETURN v_path;
END//
DELIMITER ;

-- Dumping structure for function sys.format_statement
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `format_statement`(
        statement LONGTEXT
    ) RETURNS longtext CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nFormats a normalized statement, truncating it if it is > 64 characters long by default.\n\nTo configure the length to truncate the statement to by default, update the `statement_truncate_len`\nvariable with `sys_config` table to a different value. Alternatively, to change it just for just \nyour particular session, use `SET @sys.statement_truncate_len := <some new value>`.\n\nUseful for printing statement related data from Performance Schema from \nthe command line.\n\nParameters\n-----------\n\nstatement (LONGTEXT): \n  The statement to format.\n\nReturns\n-----------\n\nLONGTEXT\n\nExample\n-----------\n\nmysql> SELECT sys.format_statement(digest_text)\n    ->   FROM performance_schema.events_statements_summary_by_digest\n    ->  ORDER by sum_timer_wait DESC limit 5;\n+-------------------------------------------------------------------+\n| sys.format_statement(digest_text)                                 |\n+-------------------------------------------------------------------+\n| CREATE SQL SECURITY INVOKER VI ... KE ? AND `variable_value` > ?  |\n| CREATE SQL SECURITY INVOKER VI ... ait` IS NOT NULL , `esc` . ... |\n| CREATE SQL SECURITY INVOKER VI ... ait` IS NOT NULL , `sys` . ... |\n| CREATE SQL SECURITY INVOKER VI ...  , `compressed_size` ) ) DESC  |\n| CREATE SQL SECURITY INVOKER VI ... LIKE ? ORDER BY `timer_start`  |\n+-------------------------------------------------------------------+\n5 rows in set (0.00 sec)\n'
BEGIN
  -- Check if we have the configured length, if not, init it
  IF @sys.statement_truncate_len IS NULL THEN
      SET @sys.statement_truncate_len = sys_get_config('statement_truncate_len', 64);
  END IF;
  IF CHAR_LENGTH(statement) > @sys.statement_truncate_len THEN
      RETURN REPLACE(CONCAT(LEFT(statement, (@sys.statement_truncate_len/2)-2), ' ... ', RIGHT(statement, (@sys.statement_truncate_len/2)-2)), '\n', ' ');
  ELSE 
      RETURN REPLACE(statement, '\n', ' ');
  END IF;
END//
DELIMITER ;

-- Dumping structure for function sys.format_time
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `format_time`(
        -- We feed in and return TEXT here, as aggregates of
        -- picoseconds can return numbers larger than BIGINT UNSIGNED
        picoseconds TEXT
    ) RETURNS text CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a raw picoseconds value, and converts it to a human readable form.\n\nPicoseconds are the precision that all latency values are printed in\nwithin Performance Schema, however are not user friendly when wanting\nto scan output from the command line.\n\nParameters\n-----------\n\npicoseconds (TEXT):\n  The raw picoseconds value to convert.\n\nReturns\n-----------\n\nTEXT CHARSET UTF8MB4\n\nExample\n-----------\n\nmysql> select format_time(342342342342345);\n+------------------------------+\n| format_time(342342342342345) |\n+------------------------------+\n| 00:05:42                     |\n+------------------------------+\n1 row in set (0.00 sec)\n\nmysql> select format_time(342342342);\n+------------------------+\n| format_time(342342342) |\n+------------------------+\n| 342.34 us              |\n+------------------------+\n1 row in set (0.00 sec)\n\nmysql> select format_time(34234);\n+--------------------+\n| format_time(34234) |\n+--------------------+\n| 34.23 ns           |\n+--------------------+\n1 row in set (0.00 sec)\n'
BEGIN
  IF picoseconds IS NULL THEN RETURN NULL;
  ELSEIF picoseconds >= 604800000000000000 THEN RETURN CONCAT(ROUND(picoseconds / 604800000000000000, 2), ' w');
  ELSEIF picoseconds >= 86400000000000000 THEN RETURN CONCAT(ROUND(picoseconds / 86400000000000000, 2), ' d');
  ELSEIF picoseconds >= 3600000000000000 THEN RETURN CONCAT(ROUND(picoseconds / 3600000000000000, 2), ' h');
  ELSEIF picoseconds >= 60000000000000 THEN RETURN CONCAT(ROUND(picoseconds / 60000000000000, 2), ' m');
  ELSEIF picoseconds >= 1000000000000 THEN RETURN CONCAT(ROUND(picoseconds / 1000000000000, 2), ' s');
  ELSEIF picoseconds >= 1000000000 THEN RETURN CONCAT(ROUND(picoseconds / 1000000000, 2), ' ms');
  ELSEIF picoseconds >= 1000000 THEN RETURN CONCAT(ROUND(picoseconds / 1000000, 2), ' us');
  ELSEIF picoseconds >= 1000 THEN RETURN CONCAT(ROUND(picoseconds / 1000, 2), ' ns');
  ELSE RETURN CONCAT(picoseconds, ' ps');
  END IF;
END//
DELIMITER ;

-- Dumping structure for view sys.host_summary
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `host_summary` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`statements` DECIMAL(64,0) NULL,
	`statement_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`statement_avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_scans` DECIMAL(65,0) NULL,
	`file_ios` DECIMAL(64,0) NULL,
	`file_io_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_connections` DECIMAL(41,0) NULL,
	`total_connections` DECIMAL(41,0) NULL,
	`unique_users` BIGINT(21) NOT NULL,
	`current_memory` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_memory_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.host_summary_by_file_io
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `host_summary_by_file_io` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`ios` DECIMAL(42,0) NULL,
	`io_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.host_summary_by_file_io_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `host_summary_by_file_io_type` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.host_summary_by_stages
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `host_summary_by_stages` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.host_summary_by_statement_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `host_summary_by_statement_latency` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`lock_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_sent` DECIMAL(42,0) NULL,
	`rows_examined` DECIMAL(42,0) NULL,
	`rows_affected` DECIMAL(42,0) NULL,
	`full_scans` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.host_summary_by_statement_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `host_summary_by_statement_type` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`statement` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`lock_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_affected` BIGINT(20) UNSIGNED NOT NULL,
	`full_scans` BIGINT(21) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.innodb_buffer_stats_by_schema
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `innodb_buffer_stats_by_schema` (
	`object_schema` TEXT NULL COLLATE 'utf8_general_ci',
	`allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`data` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`pages` BIGINT(21) NOT NULL,
	`pages_hashed` BIGINT(21) NOT NULL,
	`pages_old` BIGINT(21) NOT NULL,
	`rows_cached` DECIMAL(44,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.innodb_buffer_stats_by_table
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `innodb_buffer_stats_by_table` (
	`object_schema` TEXT NULL COLLATE 'utf8_general_ci',
	`object_name` TEXT NULL COLLATE 'utf8_general_ci',
	`allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`data` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`pages` BIGINT(21) NOT NULL,
	`pages_hashed` BIGINT(21) NOT NULL,
	`pages_old` BIGINT(21) NOT NULL,
	`rows_cached` DECIMAL(44,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.innodb_lock_waits
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `innodb_lock_waits` (
	`wait_started` DATETIME NULL,
	`wait_age` TIME NULL,
	`wait_age_secs` BIGINT(21) NULL,
	`locked_table` MEDIUMTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_partition` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_subpartition` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_index` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_type` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_trx_id` VARCHAR(18) NOT NULL COLLATE 'utf8_general_ci',
	`waiting_trx_started` DATETIME NOT NULL,
	`waiting_trx_age` TIME NULL,
	`waiting_trx_rows_locked` BIGINT(21) UNSIGNED NOT NULL,
	`waiting_trx_rows_modified` BIGINT(21) UNSIGNED NOT NULL,
	`waiting_pid` BIGINT(21) UNSIGNED NOT NULL,
	`waiting_query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_lock_id` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_lock_mode` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_trx_id` VARCHAR(18) NOT NULL COLLATE 'utf8_general_ci',
	`blocking_pid` BIGINT(21) UNSIGNED NOT NULL,
	`blocking_query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_lock_id` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_lock_mode` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_trx_started` DATETIME NOT NULL,
	`blocking_trx_age` TIME NULL,
	`blocking_trx_rows_locked` BIGINT(21) UNSIGNED NOT NULL,
	`blocking_trx_rows_modified` BIGINT(21) UNSIGNED NOT NULL,
	`sql_kill_blocking_query` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sql_kill_blocking_connection` VARCHAR(26) NOT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.io_by_thread_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `io_by_thread_by_latency` (
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`min_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`processlist_id` BIGINT(20) UNSIGNED NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.io_global_by_file_by_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `io_global_by_file_by_bytes` (
	`file` VARCHAR(512) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`total_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`total_written` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_write` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`write_pct` DECIMAL(26,2) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.io_global_by_file_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `io_global_by_file_by_latency` (
	`file` VARCHAR(512) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`read_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`write_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_misc` BIGINT(20) UNSIGNED NOT NULL,
	`misc_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.io_global_by_wait_by_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `io_global_by_wait_by_bytes` (
	`event_name` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`min_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`total_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`total_written` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_written` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_requested` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.io_global_by_wait_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `io_global_by_wait_by_latency` (
	`event_name` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`read_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`write_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`misc_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`total_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`total_written` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_written` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.latest_file_io
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `latest_file_io` (
	`thread` VARCHAR(316) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`file` VARCHAR(512) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`operation` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`requested` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for function sys.list_add
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `list_add`(
        in_list TEXT,
        in_add_value TEXT
    ) RETURNS text CHARSET utf8mb4
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a list, and a value to add to the list, and returns the resulting list.\n\nUseful for altering certain session variables, like sql_mode or optimizer_switch for instance.\n\nParameters\n-----------\n\nin_list (TEXT):\n  The comma separated list to add a value to\n\nin_add_value (TEXT):\n  The value to add to the input list\n\nReturns\n-----------\n\nTEXT\n\nExample\n--------\n\nmysql> select @@sql_mode;\n+-----------------------------------------------------------------------------------+\n| @@sql_mode                                                                        |\n+-----------------------------------------------------------------------------------+\n| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |\n+-----------------------------------------------------------------------------------+\n1 row in set (0.00 sec)\n\nmysql> set sql_mode = sys.list_add(@@sql_mode, ''ANSI_QUOTES'');\nQuery OK, 0 rows affected (0.06 sec)\n\nmysql> select @@sql_mode;\n+-----------------------------------------------------------------------------------------------+\n| @@sql_mode                                                                                    |\n+-----------------------------------------------------------------------------------------------+\n| ANSI_QUOTES,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |\n+-----------------------------------------------------------------------------------------------+\n1 row in set (0.00 sec)\n\n'
BEGIN
    IF (in_add_value IS NULL) THEN
        SIGNAL SQLSTATE '02200'
           SET MESSAGE_TEXT = 'Function sys.list_add: in_add_value input variable should not be NULL',
               MYSQL_ERRNO = 1138;
    END IF;
    IF (in_list IS NULL OR LENGTH(in_list) = 0) THEN
        -- return the new value as a single value list
        RETURN in_add_value;
    END IF;
    RETURN (SELECT CONCAT(TRIM(BOTH ',' FROM TRIM(in_list)), ',', in_add_value));
END//
DELIMITER ;

-- Dumping structure for function sys.list_drop
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `list_drop`(
        in_list TEXT,
        in_drop_value TEXT
    ) RETURNS text CHARSET utf8mb4
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes a list, and a value to attempt to remove from the list, and returns the resulting list.\n\nUseful for altering certain session variables, like sql_mode or optimizer_switch for instance.\n\nParameters\n-----------\n\nin_list (TEXT):\n  The comma separated list to drop a value from\n\nin_drop_value (TEXT):\n  The value to drop from the input list\n\nReturns\n-----------\n\nTEXT\n\nExample\n--------\n\nmysql> select @@sql_mode;\n+-----------------------------------------------------------------------------------------------+\n| @@sql_mode                                                                                    |\n+-----------------------------------------------------------------------------------------------+\n| ANSI_QUOTES,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |\n+-----------------------------------------------------------------------------------------------+\n1 row in set (0.00 sec)\n\nmysql> set sql_mode = sys.list_drop(@@sql_mode, ''ONLY_FULL_GROUP_BY'');\nQuery OK, 0 rows affected (0.03 sec)\n\nmysql> select @@sql_mode;\n+----------------------------------------------------------------------------+\n| @@sql_mode                                                                 |\n+----------------------------------------------------------------------------+\n| ANSI_QUOTES,STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |\n+----------------------------------------------------------------------------+\n1 row in set (0.00 sec)\n\n'
BEGIN
    IF (in_drop_value IS NULL) THEN
        SIGNAL SQLSTATE '02200'
           SET MESSAGE_TEXT = 'Function sys.list_drop: in_drop_value input variable should not be NULL',
               MYSQL_ERRNO = 1138;
    END IF;
    IF (in_list IS NULL OR LENGTH(in_list) = 0) THEN
        -- return the list as it was passed in
        RETURN in_list;
    END IF;
    -- ensure that leading / trailing commas are remove, support values with either spaces or not between commas
    RETURN (SELECT TRIM(BOTH ',' FROM REPLACE(REPLACE(CONCAT(',', in_list), CONCAT(',', in_drop_value), ''), CONCAT(', ', in_drop_value), '')));
END//
DELIMITER ;

-- Dumping structure for view sys.memory_by_host_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `memory_by_host_by_current_bytes` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`current_count_used` DECIMAL(41,0) NULL,
	`current_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_avg_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_max_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.memory_by_thread_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `memory_by_thread_by_current_bytes` (
	`thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_count_used` DECIMAL(41,0) NULL,
	`current_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_avg_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_max_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.memory_by_user_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `memory_by_user_by_current_bytes` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`current_count_used` DECIMAL(41,0) NULL,
	`current_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_avg_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_max_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.memory_global_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `memory_global_by_current_bytes` (
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_count` BIGINT(20) NOT NULL,
	`current_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_avg_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`high_count` BIGINT(20) NOT NULL,
	`high_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`high_avg_alloc` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.memory_global_total
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `memory_global_total` (
	`total_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.metrics
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `metrics` (
	`Variable_name` VARCHAR(193) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`Variable_value` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`Type` VARCHAR(210) NOT NULL COLLATE 'utf8_general_ci',
	`Enabled` VARCHAR(7) NOT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.processlist
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `processlist` (
	`thd_id` BIGINT(20) UNSIGNED NOT NULL,
	`conn_id` BIGINT(20) UNSIGNED NULL,
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`command` VARCHAR(16) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`state` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`time` BIGINT(20) NULL,
	`current_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`statement_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`progress` DECIMAL(26,2) NULL,
	`lock_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_examined` BIGINT(20) UNSIGNED NULL,
	`rows_sent` BIGINT(20) UNSIGNED NULL,
	`rows_affected` BIGINT(20) UNSIGNED NULL,
	`tmp_tables` BIGINT(20) UNSIGNED NULL,
	`tmp_disk_tables` BIGINT(20) UNSIGNED NULL,
	`full_scan` VARCHAR(3) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_memory` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_wait` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_wait_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`source` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_state` ENUM('ACTIVE','COMMITTED','ROLLED BACK') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_autocommit` ENUM('YES','NO') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`pid` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin',
	`program_name` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin'
) ENGINE=MyISAM;

-- Dumping structure for view sys.ps_check_lost_instrumentation
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `ps_check_lost_instrumentation` (
	`variable_name` VARCHAR(64) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`variable_value` VARCHAR(1024) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for function sys.ps_is_account_enabled
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_is_account_enabled`(
        in_host VARCHAR(255), 
        in_user VARCHAR(32)
    ) RETURNS enum('YES','NO') CHARSET utf8mb4
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nDetermines whether instrumentation of an account is enabled \nwithin Performance Schema.\n\nParameters\n-----------\n\nin_host VARCHAR(255): \n  The hostname of the account to check.\nin_user VARCHAR(32):\n  The username of the account to check.\n\nReturns\n-----------\n\nENUM(''YES'', ''NO'', ''PARTIAL'')\n\nExample\n-----------\n\nmysql> SELECT sys.ps_is_account_enabled(''localhost'', ''root'');\n+------------------------------------------------+\n| sys.ps_is_account_enabled(''localhost'', ''root'') |\n+------------------------------------------------+\n| YES                                            |\n+------------------------------------------------+\n1 row in set (0.01 sec)\n'
BEGIN
    RETURN IF(EXISTS(SELECT 1
                       FROM performance_schema.setup_actors
                      WHERE (`HOST` = '%' OR in_host LIKE `HOST`)
                        AND (`USER` = '%' OR `USER` = in_user)
                        AND (`ENABLED` = 'YES')
                    ),
              'YES', 'NO'
           );
END//
DELIMITER ;

-- Dumping structure for function sys.ps_is_consumer_enabled
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_is_consumer_enabled`(
        in_consumer varchar(64)
   ) RETURNS enum('YES','NO') CHARSET utf8mb4
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nDetermines whether a consumer is enabled (taking the consumer hierarchy into consideration)\nwithin the Performance Schema.\n\nAn exception with errno 3047 is thrown if an unknown consumer name is passed to the function.\nA consumer name of NULL returns NULL.\n\nParameters\n-----------\n\nin_consumer VARCHAR(64): \n  The name of the consumer to check.\n\nReturns\n-----------\n\nENUM(''YES'', ''NO'')\n\nExample\n-----------\n\nmysql> SELECT sys.ps_is_consumer_enabled(''events_stages_history'');\n+-----------------------------------------------------+\n| sys.ps_is_consumer_enabled(''events_stages_history'') |\n+-----------------------------------------------------+\n| NO                                                  |\n+-----------------------------------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    DECLARE v_is_enabled ENUM('YES', 'NO') DEFAULT NULL;
    DECLARE v_error_msg VARCHAR(128);
    -- Return NULL for a NULL argument.
    IF (in_consumer IS NULL) THEN
        RETURN NULL;
    END IF;
    SET v_is_enabled = (
        SELECT (CASE
                   WHEN c.NAME = 'global_instrumentation' THEN c.ENABLED
                   WHEN c.NAME = 'thread_instrumentation' THEN IF(cg.ENABLED = 'YES' AND c.ENABLED = 'YES', 'YES', 'NO')
                   WHEN c.NAME LIKE '%\_digest'           THEN IF(cg.ENABLED = 'YES' AND c.ENABLED = 'YES', 'YES', 'NO')
                   WHEN c.NAME LIKE '%\_current'          THEN IF(cg.ENABLED = 'YES' AND ct.ENABLED = 'YES' AND c.ENABLED = 'YES', 'YES', 'NO')
                   ELSE IF(cg.ENABLED = 'YES' AND ct.ENABLED = 'YES' AND c.ENABLED = 'YES'
                           AND ( SELECT cc.ENABLED FROM performance_schema.setup_consumers cc WHERE NAME = CONCAT(SUBSTRING_INDEX(c.NAME, '_', 2), '_current')
                               ) = 'YES', 'YES', 'NO')
                END) AS IsEnabled
          FROM performance_schema.setup_consumers c
               INNER JOIN performance_schema.setup_consumers cg
               INNER JOIN performance_schema.setup_consumers ct
         WHERE cg.NAME       = 'global_instrumentation'
               AND ct.NAME   = 'thread_instrumentation'
               AND c.NAME    = in_consumer
        );
    IF (v_is_enabled IS NOT NULL) THEN
        RETURN v_is_enabled;
    ELSE
        -- A value of NULL here means it is an unknown consumer name that was passed as an argument.
        -- Only an input value of NULL is allowed to return a NULL result value, to throw a signal instead.
        SET v_error_msg = CONCAT('Invalid argument error: ', in_consumer, ' in function sys.ps_is_consumer_enabled.');
        SIGNAL SQLSTATE 'HY000'
           SET MESSAGE_TEXT = v_error_msg,
               MYSQL_ERRNO  = 3047;
    END IF;
END//
DELIMITER ;

-- Dumping structure for function sys.ps_is_instrument_default_enabled
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_is_instrument_default_enabled`(
        in_instrument VARCHAR(128)
    ) RETURNS enum('YES','NO') CHARSET utf8mb4
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturns whether an instrument is enabled by default in this version of MySQL.\n\nParameters\n-----------\n\nin_instrument VARCHAR(128): \n  The instrument to check.\n\nReturns\n-----------\n\nENUM(''YES'', ''NO'')\n\nExample\n-----------\n\nmysql> SELECT sys.ps_is_instrument_default_enabled(''statement/sql/select'');\n+--------------------------------------------------------------+\n| sys.ps_is_instrument_default_enabled(''statement/sql/select'') |\n+--------------------------------------------------------------+\n| YES                                                          |\n+--------------------------------------------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    DECLARE v_enabled ENUM('YES', 'NO');
    -- Currently the same in all versions
    SET v_enabled = IF(in_instrument LIKE 'wait/io/file/%'
                        OR in_instrument LIKE 'wait/io/table/%'
                        OR in_instrument LIKE 'statement/%'
                        OR in_instrument LIKE 'memory/performance_schema/%'
                        OR in_instrument IN ('wait/lock/table/sql/handler', 'idle')
               
                        OR in_instrument LIKE 'stage/innodb/%'
                        OR in_instrument = 'stage/sql/copy to tmp table'
               
                      ,
                       'YES',
                       'NO'
                    );
    RETURN v_enabled;
END//
DELIMITER ;

-- Dumping structure for function sys.ps_is_instrument_default_timed
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_is_instrument_default_timed`(
        in_instrument VARCHAR(128)
    ) RETURNS enum('YES','NO') CHARSET utf8mb4
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturns whether an instrument is timed by default in this version of MySQL.\n\nParameters\n-----------\n\nin_instrument VARCHAR(128): \n  The instrument to check.\n\nReturns\n-----------\n\nENUM(''YES'', ''NO'')\n\nExample\n-----------\n\nmysql> SELECT sys.ps_is_instrument_default_timed(''statement/sql/select'');\n+------------------------------------------------------------+\n| sys.ps_is_instrument_default_timed(''statement/sql/select'') |\n+------------------------------------------------------------+\n| YES                                                        |\n+------------------------------------------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    DECLARE v_timed ENUM('YES', 'NO');
    -- Currently the same in all versions
    SET v_timed = IF(in_instrument LIKE 'wait/io/file/%'
                        OR in_instrument LIKE 'wait/io/table/%'
                        OR in_instrument LIKE 'statement/%'
                        OR in_instrument IN ('wait/lock/table/sql/handler', 'idle')
               
                        OR in_instrument LIKE 'stage/innodb/%'
                        OR in_instrument = 'stage/sql/copy to tmp table'
               
                      ,
                       'YES',
                       'NO'
                    );
    RETURN v_timed;
END//
DELIMITER ;

-- Dumping structure for function sys.ps_is_thread_instrumented
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_is_thread_instrumented`(
        in_connection_id BIGINT UNSIGNED
    ) RETURNS enum('YES','NO','UNKNOWN') CHARSET utf8mb4
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nChecks whether the provided connection id is instrumented within Performance Schema.\n\nParameters\n-----------\n\nin_connection_id (BIGINT UNSIGNED):\n  The id of the connection to check.\n\nReturns\n-----------\n\nENUM(''YES'', ''NO'', ''UNKNOWN'')\n\nExample\n-----------\n\nmysql> SELECT sys.ps_is_thread_instrumented(CONNECTION_ID());\n+------------------------------------------------+\n| sys.ps_is_thread_instrumented(CONNECTION_ID()) |\n+------------------------------------------------+\n| YES                                            |\n+------------------------------------------------+\n'
BEGIN
    DECLARE v_enabled ENUM('YES', 'NO', 'UNKNOWN');
    IF (in_connection_id IS NULL) THEN
        RETURN NULL;
    END IF;
    SELECT INSTRUMENTED INTO v_enabled
      FROM performance_schema.threads 
     WHERE PROCESSLIST_ID = in_connection_id;
    IF (v_enabled IS NULL) THEN
        RETURN 'UNKNOWN';
    ELSE
        RETURN v_enabled;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_disable_background_threads
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_disable_background_threads`()
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nDisable all background thread instrumentation within Performance Schema.\n\nParameters\n-----------\n\nNone.\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_disable_background_threads();\n+--------------------------------+\n| summary                        |\n+--------------------------------+\n| Disabled 18 background threads |\n+--------------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    UPDATE performance_schema.threads
       SET instrumented = 'NO'
     WHERE type = 'BACKGROUND';
    SELECT CONCAT('Disabled ', @rows := ROW_COUNT(), ' background thread', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_disable_consumer
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_disable_consumer`(
        IN consumer VARCHAR(128)
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nDisables consumers within Performance Schema \nmatching the input pattern.\n\nParameters\n-----------\n\nconsumer (VARCHAR(128)):\n  A LIKE pattern match (using "%consumer%") of consumers to disable\n\nExample\n-----------\n\nTo disable all consumers:\n\nmysql> CALL sys.ps_setup_disable_consumer('''');\n+--------------------------+\n| summary                  |\n+--------------------------+\n| Disabled 15 consumers    |\n+--------------------------+\n1 row in set (0.02 sec)\n\nTo disable just the event_stage consumers:\n\nmysql> CALL sys.ps_setup_disable_comsumers(''stage'');\n+------------------------+\n| summary                |\n+------------------------+\n| Disabled 3 consumers   |\n+------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    UPDATE performance_schema.setup_consumers
       SET enabled = 'NO'
     WHERE name LIKE CONCAT('%', consumer, '%');
    SELECT CONCAT('Disabled ', @rows := ROW_COUNT(), ' consumer', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_disable_instrument
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_disable_instrument`(
        IN in_pattern VARCHAR(128)
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nDisables instruments within Performance Schema \nmatching the input pattern.\n\nParameters\n-----------\n\nin_pattern (VARCHAR(128)):\n  A LIKE pattern match (using "%in_pattern%") of events to disable\n\nExample\n-----------\n\nTo disable all mutex instruments:\n\nmysql> CALL sys.ps_setup_disable_instrument(''wait/synch/mutex'');\n+--------------------------+\n| summary                  |\n+--------------------------+\n| Disabled 155 instruments |\n+--------------------------+\n1 row in set (0.02 sec)\n\nTo disable just a specific TCP/IP based network IO instrument:\n\nmysql> CALL sys.ps_setup_disable_instrument(''wait/io/socket/sql/server_tcpip_socket'');\n+------------------------+\n| summary                |\n+------------------------+\n| Disabled 1 instruments |\n+------------------------+\n1 row in set (0.00 sec)\n\nTo disable all instruments:\n\nmysql> CALL sys.ps_setup_disable_instrument('''');\n+--------------------------+\n| summary                  |\n+--------------------------+\n| Disabled 547 instruments |\n+--------------------------+\n1 row in set (0.01 sec)\n'
BEGIN
    UPDATE performance_schema.setup_instruments
       SET enabled = 'NO', timed = 'NO'
     WHERE name LIKE CONCAT('%', in_pattern, '%');
    SELECT CONCAT('Disabled ', @rows := ROW_COUNT(), ' instrument', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_disable_thread
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_disable_thread`(
        IN in_connection_id BIGINT
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nDisable the given connection/thread in Performance Schema.\n\nParameters\n-----------\n\nin_connection_id (BIGINT):\n  The connection ID (PROCESSLIST_ID from performance_schema.threads\n  or the ID shown within SHOW PROCESSLIST)\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_disable_thread(3);\n+-------------------+\n| summary           |\n+-------------------+\n| Disabled 1 thread |\n+-------------------+\n1 row in set (0.01 sec)\n\nTo disable the current connection:\n\nmysql> CALL sys.ps_setup_disable_thread(CONNECTION_ID());\n+-------------------+\n| summary           |\n+-------------------+\n| Disabled 1 thread |\n+-------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    UPDATE performance_schema.threads
       SET instrumented = 'NO'
     WHERE processlist_id = in_connection_id;
    SELECT CONCAT('Disabled ', @rows := ROW_COUNT(), ' thread', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_enable_background_threads
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_enable_background_threads`()
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nEnable all background thread instrumentation within Performance Schema.\n\nParameters\n-----------\n\nNone.\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_enable_background_threads();\n+-------------------------------+\n| summary                       |\n+-------------------------------+\n| Enabled 18 background threads |\n+-------------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    UPDATE performance_schema.threads
       SET instrumented = 'YES'
     WHERE type = 'BACKGROUND';
    SELECT CONCAT('Enabled ', @rows := ROW_COUNT(), ' background thread', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_enable_consumer
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_enable_consumer`(
        IN consumer VARCHAR(128)
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nEnables consumers within Performance Schema \nmatching the input pattern.\n\nParameters\n-----------\n\nconsumer (VARCHAR(128)):\n  A LIKE pattern match (using "%consumer%") of consumers to enable\n\nExample\n-----------\n\nTo enable all consumers:\n\nmysql> CALL sys.ps_setup_enable_consumer('''');\n+-------------------------+\n| summary                 |\n+-------------------------+\n| Enabled 10 consumers    |\n+-------------------------+\n1 row in set (0.02 sec)\n\nQuery OK, 0 rows affected (0.02 sec)\n\nTo enable just "waits" consumers:\n\nmysql> CALL sys.ps_setup_enable_consumer(''waits'');\n+-----------------------+\n| summary               |\n+-----------------------+\n| Enabled 3 consumers   |\n+-----------------------+\n1 row in set (0.00 sec)\n\nQuery OK, 0 rows affected (0.00 sec)\n'
BEGIN
    UPDATE performance_schema.setup_consumers
       SET enabled = 'YES'
     WHERE name LIKE CONCAT('%', consumer, '%');
    SELECT CONCAT('Enabled ', @rows := ROW_COUNT(), ' consumer', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_enable_instrument
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_enable_instrument`(
        IN in_pattern VARCHAR(128)
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nEnables instruments within Performance Schema \nmatching the input pattern.\n\nParameters\n-----------\n\nin_pattern (VARCHAR(128)):\n  A LIKE pattern match (using "%in_pattern%") of events to enable\n\nExample\n-----------\n\nTo enable all mutex instruments:\n\nmysql> CALL sys.ps_setup_enable_instrument(''wait/synch/mutex'');\n+-------------------------+\n| summary                 |\n+-------------------------+\n| Enabled 155 instruments |\n+-------------------------+\n1 row in set (0.02 sec)\n\nQuery OK, 0 rows affected (0.02 sec)\n\nTo enable just a specific TCP/IP based network IO instrument:\n\nmysql> CALL sys.ps_setup_enable_instrument(''wait/io/socket/sql/server_tcpip_socket'');\n+-----------------------+\n| summary               |\n+-----------------------+\n| Enabled 1 instruments |\n+-----------------------+\n1 row in set (0.00 sec)\n\nQuery OK, 0 rows affected (0.00 sec)\n\nTo enable all instruments:\n\nmysql> CALL sys.ps_setup_enable_instrument('''');\n+-------------------------+\n| summary                 |\n+-------------------------+\n| Enabled 547 instruments |\n+-------------------------+\n1 row in set (0.01 sec)\n\nQuery OK, 0 rows affected (0.01 sec)\n'
BEGIN
    UPDATE performance_schema.setup_instruments
       SET enabled = 'YES', timed = 'YES'
     WHERE name LIKE CONCAT('%', in_pattern, '%');
    SELECT CONCAT('Enabled ', @rows := ROW_COUNT(), ' instrument', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_enable_thread
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_enable_thread`(
        IN in_connection_id BIGINT
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nEnable the given connection/thread in Performance Schema.\n\nParameters\n-----------\n\nin_connection_id (BIGINT):\n  The connection ID (PROCESSLIST_ID from performance_schema.threads\n  or the ID shown within SHOW PROCESSLIST)\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_enable_thread(3);\n+------------------+\n| summary          |\n+------------------+\n| Enabled 1 thread |\n+------------------+\n1 row in set (0.01 sec)\n\nTo enable the current connection:\n\nmysql> CALL sys.ps_setup_enable_thread(CONNECTION_ID());\n+------------------+\n| summary          |\n+------------------+\n| Enabled 1 thread |\n+------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    UPDATE performance_schema.threads
       SET instrumented = 'YES'
     WHERE processlist_id = in_connection_id;
    SELECT CONCAT('Enabled ', @rows := ROW_COUNT(), ' thread', IF(@rows != 1, 's', '')) AS summary;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_reload_saved
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_reload_saved`()
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReloads a saved Performance Schema configuration,\nso that you can alter the setup for debugging purposes, \nbut restore it to a previous state.\n\nUse the companion procedure - ps_setup_save(), to \nsave a configuration.\n\nRequires the SUPER privilege for "SET sql_log_bin = 0;".\n\nParameters\n-----------\n\nNone.\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_save();\nQuery OK, 0 rows affected (0.08 sec)\n\nmysql> UPDATE performance_schema.setup_instruments SET enabled = ''YES'', timed = ''YES'';\nQuery OK, 547 rows affected (0.40 sec)\nRows matched: 784  Changed: 547  Warnings: 0\n\n/* Run some tests that need more detailed instrumentation here */\n\nmysql> CALL sys.ps_setup_reload_saved();\nQuery OK, 0 rows affected (0.32 sec)\n'
BEGIN
    DECLARE v_done bool DEFAULT FALSE;
    DECLARE v_lock_result INT;
    DECLARE v_lock_used_by BIGINT;
    DECLARE v_signal_message TEXT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE VALUE '90001'
           SET MESSAGE_TEXT = 'An error occurred, was sys.ps_setup_save() run before this procedure?';
    END;
    SET @log_bin := @@sql_log_bin;
    SET sql_log_bin = 0;
    SELECT IS_USED_LOCK('sys.ps_setup_save') INTO v_lock_used_by;
    IF (v_lock_used_by != CONNECTION_ID()) THEN
        SET v_signal_message = CONCAT('The sys.ps_setup_save lock is currently owned by ', v_lock_used_by);
        SIGNAL SQLSTATE VALUE '90002'
           SET MESSAGE_TEXT = v_signal_message;
    END IF;
    DELETE FROM performance_schema.setup_actors;
    INSERT INTO performance_schema.setup_actors SELECT * FROM tmp_setup_actors;
    BEGIN
        -- Workaround for http://bugs.mysql.com/bug.php?id=70025
        DECLARE v_name varchar(64);
        DECLARE v_enabled enum('YES', 'NO');
        DECLARE c_consumers CURSOR FOR SELECT NAME, ENABLED FROM tmp_setup_consumers;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
        SET v_done = FALSE;
        OPEN c_consumers;
        c_consumers_loop: LOOP
            FETCH c_consumers INTO v_name, v_enabled;
            IF v_done THEN
               LEAVE c_consumers_loop;
            END IF;
            UPDATE performance_schema.setup_consumers
               SET ENABLED = v_enabled
             WHERE NAME = v_name;
         END LOOP;
         CLOSE c_consumers;
    END;
    UPDATE performance_schema.setup_instruments
     INNER JOIN tmp_setup_instruments USING (NAME)
       SET performance_schema.setup_instruments.ENABLED = tmp_setup_instruments.ENABLED,
           performance_schema.setup_instruments.TIMED   = tmp_setup_instruments.TIMED;
    BEGIN
        -- Workaround for http://bugs.mysql.com/bug.php?id=70025
        DECLARE v_thread_id bigint unsigned;
        DECLARE v_instrumented enum('YES', 'NO');
        DECLARE c_threads CURSOR FOR SELECT THREAD_ID, INSTRUMENTED FROM tmp_threads;
        DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
        SET v_done = FALSE;
        OPEN c_threads;
        c_threads_loop: LOOP
            FETCH c_threads INTO v_thread_id, v_instrumented;
            IF v_done THEN
               LEAVE c_threads_loop;
            END IF;
            UPDATE performance_schema.threads
               SET INSTRUMENTED = v_instrumented
             WHERE THREAD_ID = v_thread_id;
        END LOOP;
        CLOSE c_threads;
    END;
    UPDATE performance_schema.threads
       SET INSTRUMENTED = IF(PROCESSLIST_USER IS NOT NULL,
                             sys.ps_is_account_enabled(PROCESSLIST_HOST, PROCESSLIST_USER),
                             'YES')
     WHERE THREAD_ID NOT IN (SELECT THREAD_ID FROM tmp_threads);
    DROP TEMPORARY TABLE tmp_setup_actors;
    DROP TEMPORARY TABLE tmp_setup_consumers;
    DROP TEMPORARY TABLE tmp_setup_instruments;
    DROP TEMPORARY TABLE tmp_threads;
    SELECT RELEASE_LOCK('sys.ps_setup_save') INTO v_lock_result;
    SET sql_log_bin = @log_bin; 
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_reset_to_default
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_reset_to_default`(
       IN in_verbose BOOLEAN
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nResets the Performance Schema setup to the default settings.\n\nParameters\n-----------\n\nin_verbose (BOOLEAN):\n  Whether to print each setup stage (including the SQL) whilst running.\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_reset_to_default(true)\\G\n*************************** 1. row ***************************\nstatus: Resetting: setup_actors\nDELETE\nFROM performance_schema.setup_actors\n WHERE NOT (HOST = ''%'' AND USER = ''%'' AND `ROLE` = ''%'')\n1 row in set (0.00 sec)\n\n*************************** 1. row ***************************\nstatus: Resetting: setup_actors\nINSERT IGNORE INTO performance_schema.setup_actors\nVALUES (''%'', ''%'', ''%'')\n1 row in set (0.00 sec)\n...\n\nmysql> CALL sys.ps_setup_reset_to_default(false)\\G\nQuery OK, 0 rows affected (0.00 sec)\n'
BEGIN
    SET @query = 'DELETE
                    FROM performance_schema.setup_actors
                   WHERE NOT (HOST = ''%'' AND USER = ''%'' AND `ROLE` = ''%'')';
    IF (in_verbose) THEN
        SELECT CONCAT('Resetting: setup_actors\n', REPLACE(@query, '  ', '')) AS status;
    END IF;
    PREPARE reset_stmt FROM @query;
    EXECUTE reset_stmt;
    DEALLOCATE PREPARE reset_stmt;
    SET @query = 'INSERT IGNORE INTO performance_schema.setup_actors
                  VALUES (''%'', ''%'', ''%'', ''YES'', ''YES'')';
    IF (in_verbose) THEN
        SELECT CONCAT('Resetting: setup_actors\n', REPLACE(@query, '  ', '')) AS status;
    END IF;
    PREPARE reset_stmt FROM @query;
    EXECUTE reset_stmt;
    DEALLOCATE PREPARE reset_stmt;
    SET @query = 'UPDATE performance_schema.setup_instruments
                     SET ENABLED = sys.ps_is_instrument_default_enabled(NAME),
                         TIMED   = sys.ps_is_instrument_default_timed(NAME)';
    IF (in_verbose) THEN
        SELECT CONCAT('Resetting: setup_instruments\n', REPLACE(@query, '  ', '')) AS status;
    END IF;
    PREPARE reset_stmt FROM @query;
    EXECUTE reset_stmt;
    DEALLOCATE PREPARE reset_stmt;
    SET @query = 'UPDATE performance_schema.setup_consumers
                     SET ENABLED = IF(NAME IN (''events_statements_current'', ''events_transactions_current'', ''global_instrumentation'', ''thread_instrumentation'', ''statements_digest''), ''YES'', ''NO'')';
    IF (in_verbose) THEN
        SELECT CONCAT('Resetting: setup_consumers\n', REPLACE(@query, '  ', '')) AS status;
    END IF;
    PREPARE reset_stmt FROM @query;
    EXECUTE reset_stmt;
    DEALLOCATE PREPARE reset_stmt;
    SET @query = 'DELETE
                    FROM performance_schema.setup_objects
                   WHERE NOT (OBJECT_TYPE IN (''EVENT'', ''FUNCTION'', ''PROCEDURE'', ''TABLE'', ''TRIGGER'') AND OBJECT_NAME = ''%'' 
                     AND (OBJECT_SCHEMA = ''mysql''              AND ENABLED = ''NO''  AND TIMED = ''NO'' )
                      OR (OBJECT_SCHEMA = ''performance_schema'' AND ENABLED = ''NO''  AND TIMED = ''NO'' )
                      OR (OBJECT_SCHEMA = ''information_schema'' AND ENABLED = ''NO''  AND TIMED = ''NO'' )
                      OR (OBJECT_SCHEMA = ''%''                  AND ENABLED = ''YES'' AND TIMED = ''YES''))';
    IF (in_verbose) THEN
        SELECT CONCAT('Resetting: setup_objects\n', REPLACE(@query, '  ', '')) AS status;
    END IF;
    PREPARE reset_stmt FROM @query;
    EXECUTE reset_stmt;
    DEALLOCATE PREPARE reset_stmt;
    SET @query = 'INSERT IGNORE INTO performance_schema.setup_objects
                  VALUES (''EVENT''    , ''mysql''             , ''%'', ''NO'' , ''NO'' ),
                         (''EVENT''    , ''performance_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''EVENT''    , ''information_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''EVENT''    , ''%''                 , ''%'', ''YES'', ''YES''),
                         (''FUNCTION'' , ''mysql''             , ''%'', ''NO'' , ''NO'' ),
                         (''FUNCTION'' , ''performance_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''FUNCTION'' , ''information_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''FUNCTION'' , ''%''                 , ''%'', ''YES'', ''YES''),
                         (''PROCEDURE'', ''mysql''             , ''%'', ''NO'' , ''NO'' ),
                         (''PROCEDURE'', ''performance_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''PROCEDURE'', ''information_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''PROCEDURE'', ''%''                 , ''%'', ''YES'', ''YES''),
                         (''TABLE''    , ''mysql''             , ''%'', ''NO'' , ''NO'' ),
                         (''TABLE''    , ''performance_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''TABLE''    , ''information_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''TABLE''    , ''%''                 , ''%'', ''YES'', ''YES''),
                         (''TRIGGER''  , ''mysql''             , ''%'', ''NO'' , ''NO'' ),
                         (''TRIGGER''  , ''performance_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''TRIGGER''  , ''information_schema'', ''%'', ''NO'' , ''NO'' ),
                         (''TRIGGER''  , ''%''                 , ''%'', ''YES'', ''YES'')';
    IF (in_verbose) THEN
        SELECT CONCAT('Resetting: setup_objects\n', REPLACE(@query, '  ', '')) AS status;
    END IF;
    PREPARE reset_stmt FROM @query;
    EXECUTE reset_stmt;
    DEALLOCATE PREPARE reset_stmt;
    SET @query = 'UPDATE performance_schema.threads
                     SET INSTRUMENTED = ''YES''';
    IF (in_verbose) THEN
        SELECT CONCAT('Resetting: threads\n', REPLACE(@query, '  ', '')) AS status;
    END IF;
    PREPARE reset_stmt FROM @query;
    EXECUTE reset_stmt;
    DEALLOCATE PREPARE reset_stmt;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_save
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_save`(
        IN in_timeout INT
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nSaves the current configuration of Performance Schema, \nso that you can alter the setup for debugging purposes, \nbut restore it to a previous state.\n\nUse the companion procedure - ps_setup_reload_saved(), to \nrestore the saved config.\n\nThe named lock "sys.ps_setup_save" is taken before the\ncurrent configuration is saved. If the attempt to get the named\nlock times out, an error occurs.\n\nThe lock is released after the settings have been restored by\ncalling ps_setup_reload_saved().\n\nRequires the SUPER privilege for "SET sql_log_bin = 0;".\n\nParameters\n-----------\n\nin_timeout INT\n  The timeout in seconds used when trying to obtain the lock.\n  A negative timeout means infinite timeout.\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_save(-1);\nQuery OK, 0 rows affected (0.08 sec)\n\nmysql> UPDATE performance_schema.setup_instruments \n    ->    SET enabled = ''YES'', timed = ''YES'';\nQuery OK, 547 rows affected (0.40 sec)\nRows matched: 784  Changed: 547  Warnings: 0\n\n/* Run some tests that need more detailed instrumentation here */\n\nmysql> CALL sys.ps_setup_reload_saved();\nQuery OK, 0 rows affected (0.32 sec)\n'
BEGIN
    DECLARE v_lock_result INT;
    SET @log_bin := @@sql_log_bin;
    SET sql_log_bin = 0;
    SELECT GET_LOCK('sys.ps_setup_save', in_timeout) INTO v_lock_result;
    IF v_lock_result THEN
        DROP TEMPORARY TABLE IF EXISTS tmp_setup_actors;
        DROP TEMPORARY TABLE IF EXISTS tmp_setup_consumers;
        DROP TEMPORARY TABLE IF EXISTS tmp_setup_instruments;
        DROP TEMPORARY TABLE IF EXISTS tmp_threads;
        CREATE TEMPORARY TABLE tmp_setup_actors SELECT * FROM performance_schema.setup_actors LIMIT 0;
        CREATE TEMPORARY TABLE tmp_setup_consumers LIKE performance_schema.setup_consumers;
        CREATE TEMPORARY TABLE tmp_setup_instruments LIKE performance_schema.setup_instruments;
        CREATE TEMPORARY TABLE tmp_threads (THREAD_ID bigint unsigned NOT NULL PRIMARY KEY, INSTRUMENTED enum('YES','NO') NOT NULL);
        INSERT INTO tmp_setup_actors SELECT * FROM performance_schema.setup_actors;
        INSERT INTO tmp_setup_consumers SELECT * FROM performance_schema.setup_consumers;
        INSERT INTO tmp_setup_instruments SELECT * FROM performance_schema.setup_instruments;
        INSERT INTO tmp_threads SELECT THREAD_ID, INSTRUMENTED FROM performance_schema.threads;
    ELSE
        SIGNAL SQLSTATE VALUE '90000'
           SET MESSAGE_TEXT = 'Could not lock the sys.ps_setup_save user lock, another thread has a saved configuration';
    END IF;
    SET sql_log_bin = @log_bin;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_show_disabled
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_show_disabled`(
        IN in_show_instruments BOOLEAN,
        IN in_show_threads BOOLEAN
    )
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nShows all currently disable Performance Schema configuration.\n\nDisabled users is only available for MySQL 5.7.6 and later.\nIn earlier versions it was only possible to enable users.\n\nParameters\n-----------\n\nin_show_instruments (BOOLEAN):\n  Whether to print disabled instruments (can print many items)\n\nin_show_threads (BOOLEAN):\n  Whether to print disabled threads\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_show_disabled(TRUE, TRUE);\n+----------------------------+\n| performance_schema_enabled |\n+----------------------------+\n|                          1 |\n+----------------------------+\n1 row in set (0.00 sec)\n\n+--------------------+\n| disabled_users     |\n+--------------------+\n| ''mark''@''localhost'' |\n+--------------------+\n1 row in set (0.00 sec)\n\n+-------------+----------------------+---------+-------+\n| object_type | objects              | enabled | timed |\n+-------------+----------------------+---------+-------+\n| EVENT       | mysql.%              | NO      | NO    |\n| EVENT       | performance_schema.% | NO      | NO    |\n| EVENT       | information_schema.% | NO      | NO    |\n| FUNCTION    | mysql.%              | NO      | NO    |\n| FUNCTION    | performance_schema.% | NO      | NO    |\n| FUNCTION    | information_schema.% | NO      | NO    |\n| PROCEDURE   | mysql.%              | NO      | NO    |\n| PROCEDURE   | performance_schema.% | NO      | NO    |\n| PROCEDURE   | information_schema.% | NO      | NO    |\n| TABLE       | mysql.%              | NO      | NO    |\n| TABLE       | performance_schema.% | NO      | NO    |\n| TABLE       | information_schema.% | NO      | NO    |\n| TRIGGER     | mysql.%              | NO      | NO    |\n| TRIGGER     | performance_schema.% | NO      | NO    |\n| TRIGGER     | information_schema.% | NO      | NO    |\n+-------------+----------------------+---------+-------+\n15 rows in set (0.00 sec)\n\n+----------------------------------+\n| disabled_consumers               |\n+----------------------------------+\n| events_stages_current            |\n| events_stages_history            |\n| events_stages_history_long       |\n| events_statements_history        |\n| events_statements_history_long   |\n| events_transactions_history      |\n| events_transactions_history_long |\n| events_waits_current             |\n| events_waits_history             |\n| events_waits_history_long        |\n+----------------------------------+\n10 rows in set (0.00 sec)\n\nEmpty set (0.00 sec)\n\n+---------------------------------------------------------------------------------------+-------+\n| disabled_instruments                                                                  | timed |\n+---------------------------------------------------------------------------------------+-------+\n| wait/synch/mutex/sql/TC_LOG_MMAP::LOCK_tc                                             | NO    |\n| wait/synch/mutex/sql/LOCK_des_key_file                                                | NO    |\n| wait/synch/mutex/sql/MYSQL_BIN_LOG::LOCK_commit                                       | NO    |\n...\n| memory/sql/servers_cache                                                              | NO    |\n| memory/sql/udf_mem                                                                    | NO    |\n| wait/lock/metadata/sql/mdl                                                            | NO    |\n+---------------------------------------------------------------------------------------+-------+\n547 rows in set (0.00 sec)\n\nQuery OK, 0 rows affected (0.01 sec)\n'
BEGIN
    SELECT @@performance_schema AS performance_schema_enabled;
    -- In 5.7.6 and later the setup_actors table has an ENABLED column to
    -- specify whether the actor is enabled. Before that all actors matched
    -- in the setup_actors table were enabled.
    -- So only execute the query in 5.7.6+
    
    SELECT CONCAT('\'', user, '\'@\'', host, '\'') AS disabled_users
      FROM performance_schema.setup_actors
     WHERE enabled = 'NO'
     ORDER BY disabled_users;
    
    SELECT object_type,
           CONCAT(object_schema, '.', object_name) AS objects,
           enabled,
           timed
      FROM performance_schema.setup_objects
     WHERE enabled = 'NO'
     ORDER BY object_type, objects;
    SELECT name AS disabled_consumers
      FROM performance_schema.setup_consumers
     WHERE enabled = 'NO'
     ORDER BY disabled_consumers;
    IF (in_show_threads) THEN
        SELECT IF(name = 'thread/sql/one_connection', 
                  CONCAT(processlist_user, '@', processlist_host), 
                  REPLACE(name, 'thread/', '')) AS disabled_threads,
        TYPE AS thread_type
          FROM performance_schema.threads
         WHERE INSTRUMENTED = 'NO'
         ORDER BY disabled_threads;
    END IF;
    IF (in_show_instruments) THEN
        SELECT name AS disabled_instruments,
               timed
          FROM performance_schema.setup_instruments
         WHERE enabled = 'NO'
         ORDER BY disabled_instruments;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_show_disabled_consumers
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_show_disabled_consumers`()
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nShows all currently disabled consumers.\n\nParameters\n-----------\n\nNone\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_show_disabled_consumers();\n\n+---------------------------+\n| disabled_consumers        |\n+---------------------------+\n| events_statements_current |\n| global_instrumentation    |\n| thread_instrumentation    |\n| statements_digest         |\n+---------------------------+\n4 rows in set (0.05 sec)\n'
BEGIN
    SELECT name AS disabled_consumers
      FROM performance_schema.setup_consumers
     WHERE enabled = 'NO'
     ORDER BY disabled_consumers;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_show_disabled_instruments
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_show_disabled_instruments`()
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nShows all currently disabled instruments.\n\nParameters\n-----------\n\nNone\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_show_disabled_instruments();\n'
BEGIN
    SELECT name AS disabled_instruments, timed
      FROM performance_schema.setup_instruments
     WHERE enabled = 'NO'
     ORDER BY disabled_instruments;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_show_enabled
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_show_enabled`(
        IN in_show_instruments BOOLEAN,
        IN in_show_threads BOOLEAN
    )
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nShows all currently enabled Performance Schema configuration.\n\nParameters\n-----------\n\nin_show_instruments (BOOLEAN):\n  Whether to print enabled instruments (can print many items)\n\nin_show_threads (BOOLEAN):\n  Whether to print enabled threads\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_show_enabled(TRUE, TRUE);\n+----------------------------+\n| performance_schema_enabled |\n+----------------------------+\n|                          1 |\n+----------------------------+\n1 row in set (0.00 sec)\n\n+---------------+\n| enabled_users |\n+---------------+\n| ''%''@''%''       |\n+---------------+\n1 row in set (0.01 sec)\n\n+-------------+---------+---------+-------+\n| object_type | objects | enabled | timed |\n+-------------+---------+---------+-------+\n| EVENT       | %.%     | YES     | YES   |\n| FUNCTION    | %.%     | YES     | YES   |\n| PROCEDURE   | %.%     | YES     | YES   |\n| TABLE       | %.%     | YES     | YES   |\n| TRIGGER     | %.%     | YES     | YES   |\n+-------------+---------+---------+-------+\n5 rows in set (0.01 sec)\n\n+---------------------------+\n| enabled_consumers         |\n+---------------------------+\n| events_statements_current |\n| global_instrumentation    |\n| thread_instrumentation    |\n| statements_digest         |\n+---------------------------+\n4 rows in set (0.05 sec)\n\n+---------------------------------+-------------+\n| enabled_threads                 | thread_type |\n+---------------------------------+-------------+\n| sql/main                        | BACKGROUND  |\n| sql/thread_timer_notifier       | BACKGROUND  |\n| innodb/io_ibuf_thread           | BACKGROUND  |\n| innodb/io_log_thread            | BACKGROUND  |\n| innodb/io_read_thread           | BACKGROUND  |\n| innodb/io_read_thread           | BACKGROUND  |\n| innodb/io_write_thread          | BACKGROUND  |\n| innodb/io_write_thread          | BACKGROUND  |\n| innodb/page_cleaner_thread      | BACKGROUND  |\n| innodb/srv_lock_timeout_thread  | BACKGROUND  |\n| innodb/srv_error_monitor_thread | BACKGROUND  |\n| innodb/srv_monitor_thread       | BACKGROUND  |\n| innodb/srv_master_thread        | BACKGROUND  |\n| innodb/srv_purge_thread         | BACKGROUND  |\n| innodb/srv_worker_thread        | BACKGROUND  |\n| innodb/srv_worker_thread        | BACKGROUND  |\n| innodb/srv_worker_thread        | BACKGROUND  |\n| innodb/buf_dump_thread          | BACKGROUND  |\n| innodb/dict_stats_thread        | BACKGROUND  |\n| sql/signal_handler              | BACKGROUND  |\n| sql/compress_gtid_table         | FOREGROUND  |\n| root@localhost                  | FOREGROUND  |\n+---------------------------------+-------------+\n22 rows in set (0.01 sec)\n\n+-------------------------------------+-------+\n| enabled_instruments                 | timed |\n+-------------------------------------+-------+\n| wait/io/file/sql/map                | YES   |\n| wait/io/file/sql/binlog             | YES   |\n...\n| statement/com/Error                 | YES   |\n| statement/com/                      | YES   |\n| idle                                | YES   |\n+-------------------------------------+-------+\n210 rows in set (0.08 sec)\n\nQuery OK, 0 rows affected (0.89 sec)\n'
BEGIN
    SELECT @@performance_schema AS performance_schema_enabled;
    -- In 5.7.6 and later the setup_actors table has an ENABLED column to
    -- specify whether the actor is enabled. Before that all actors matched
    -- in the setup_actors table were enabled.
    SELECT CONCAT('\'', user, '\'@\'', host, '\'') AS enabled_users
      FROM performance_schema.setup_actors
      WHERE enabled = 'YES' 
     ORDER BY enabled_users;
    SELECT object_type,
           CONCAT(object_schema, '.', object_name) AS objects,
           enabled,
           timed
      FROM performance_schema.setup_objects
     WHERE enabled = 'YES'
     ORDER BY object_type, objects;
    SELECT name AS enabled_consumers
      FROM performance_schema.setup_consumers
     WHERE enabled = 'YES'
     ORDER BY enabled_consumers;
    IF (in_show_threads) THEN
        SELECT IF(name = 'thread/sql/one_connection', 
                  CONCAT(processlist_user, '@', processlist_host), 
                  REPLACE(name, 'thread/', '')) AS enabled_threads,
        TYPE AS thread_type
          FROM performance_schema.threads
         WHERE INSTRUMENTED = 'YES'
         ORDER BY enabled_threads;
    END IF;
    IF (in_show_instruments) THEN
        SELECT name AS enabled_instruments,
               timed
          FROM performance_schema.setup_instruments
         WHERE enabled = 'YES'
         ORDER BY enabled_instruments;
    END IF;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_show_enabled_consumers
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_show_enabled_consumers`()
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nShows all currently enabled consumers.\n\nParameters\n-----------\n\nNone\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_show_enabled_consumers();\n\n+---------------------------+\n| enabled_consumers         |\n+---------------------------+\n| events_statements_current |\n| global_instrumentation    |\n| thread_instrumentation    |\n| statements_digest         |\n+---------------------------+\n4 rows in set (0.05 sec)\n'
BEGIN
    SELECT name AS enabled_consumers
      FROM performance_schema.setup_consumers
     WHERE enabled = 'YES'
     ORDER BY enabled_consumers;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_setup_show_enabled_instruments
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_setup_show_enabled_instruments`()
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nShows all currently enabled instruments.\n\nParameters\n-----------\n\nNone\n\nExample\n-----------\n\nmysql> CALL sys.ps_setup_show_enabled_instruments();\n'
BEGIN
    SELECT name AS enabled_instruments, timed
      FROM performance_schema.setup_instruments
     WHERE enabled = 'YES'
     ORDER BY enabled_instruments;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_statement_avg_latency_histogram
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_statement_avg_latency_histogram`()
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nOutputs a textual histogram graph of the average latency values\nacross all normalized queries tracked within the Performance Schema\nevents_statements_summary_by_digest table.\n\nCan be used to show a very high level picture of what kind of \nlatency distribution statements running within this instance have.\n\nParameters\n-----------\n\nNone.\n\nExample\n-----------\n\nmysql> CALL sys.ps_statement_avg_latency_histogram()\\G\n*************************** 1. row ***************************\nPerformance Schema Statement Digest Average Latency Histogram:\n\n  . = 1 unit\n  * = 2 units\n  # = 3 units\n\n(0 - 38ms)     240 | ################################################################################\n(38 - 77ms)    38  | ......................................\n(77 - 115ms)   3   | ...\n(115 - 154ms)  62  | *******************************\n(154 - 192ms)  3   | ...\n(192 - 231ms)  0   |\n(231 - 269ms)  0   |\n(269 - 307ms)  0   |\n(307 - 346ms)  0   |\n(346 - 384ms)  1   | .\n(384 - 423ms)  1   | .\n(423 - 461ms)  0   |\n(461 - 499ms)  0   |\n(499 - 538ms)  0   |\n(538 - 576ms)  0   |\n(576 - 615ms)  1   | .\n\n  Total Statements: 350; Buckets: 16; Bucket Size: 38 ms;\n'
BEGIN
SELECT CONCAT('\n',
       '\n  . = 1 unit',
       '\n  * = 2 units',
       '\n  # = 3 units\n',
       @label := CONCAT(@label_inner := CONCAT('\n(0 - ',
                                               ROUND((@bucket_size := (SELECT ROUND((MAX(avg_us) - MIN(avg_us)) / (@buckets := 16)) AS size
                                                                         FROM sys.x$ps_digest_avg_latency_distribution)) / (@unit_div := 1000)),
                                                (@unit := 'ms'), ')'),
                        REPEAT(' ', (@max_label_size := ((1 + LENGTH(ROUND((@bucket_size * 15) / @unit_div)) + 3 + LENGTH(ROUND(@bucket_size * 16) / @unit_div)) + 1)) - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us <= @bucket_size), 0)),
       REPEAT(' ', (@max_label_len := (@max_label_size + LENGTH((@total_queries := (SELECT SUM(cnt) FROM sys.x$ps_digest_avg_latency_distribution)))) + 1) - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < (@one_unit := 40), '.', IF(@count_in_bucket < (@two_unit := 80), '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND(@bucket_size / @unit_div), ' - ', ROUND((@bucket_size * 2) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size AND b1.avg_us <= @bucket_size * 2), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 2) / @unit_div), ' - ', ROUND((@bucket_size * 3) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 2 AND b1.avg_us <= @bucket_size * 3), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 3) / @unit_div), ' - ', ROUND((@bucket_size * 4) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 3 AND b1.avg_us <= @bucket_size * 4), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 4) / @unit_div), ' - ', ROUND((@bucket_size * 5) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 4 AND b1.avg_us <= @bucket_size * 5), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 5) / @unit_div), ' - ', ROUND((@bucket_size * 6) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 5 AND b1.avg_us <= @bucket_size * 6), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 6) / @unit_div), ' - ', ROUND((@bucket_size * 7) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 6 AND b1.avg_us <= @bucket_size * 7), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 7) / @unit_div), ' - ', ROUND((@bucket_size * 8) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 7 AND b1.avg_us <= @bucket_size * 8), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 8) / @unit_div), ' - ', ROUND((@bucket_size * 9) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 8 AND b1.avg_us <= @bucket_size * 9), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 9) / @unit_div), ' - ', ROUND((@bucket_size * 10) / @unit_div), @unit, ')'),
                         REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                         @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                       FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                      WHERE b1.avg_us > @bucket_size * 9 AND b1.avg_us <= @bucket_size * 10), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 10) / @unit_div), ' - ', ROUND((@bucket_size * 11) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 10 AND b1.avg_us <= @bucket_size * 11), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 11) / @unit_div), ' - ', ROUND((@bucket_size * 12) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 11 AND b1.avg_us <= @bucket_size * 12), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 12) / @unit_div), ' - ', ROUND((@bucket_size * 13) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 12 AND b1.avg_us <= @bucket_size * 13), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 13) / @unit_div), ' - ', ROUND((@bucket_size * 14) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 13 AND b1.avg_us <= @bucket_size * 14), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 14) / @unit_div), ' - ', ROUND((@bucket_size * 15) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 14 AND b1.avg_us <= @bucket_size * 15), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       @label := CONCAT(@label_inner := CONCAT('\n(', ROUND((@bucket_size * 15) / @unit_div), ' - ', ROUND((@bucket_size * 16) / @unit_div), @unit, ')'),
                        REPEAT(' ', @max_label_size - LENGTH(@label_inner)),
                        @count_in_bucket := IFNULL((SELECT SUM(cnt)
                                                      FROM sys.x$ps_digest_avg_latency_distribution AS b1 
                                                     WHERE b1.avg_us > @bucket_size * 15 AND b1.avg_us <= @bucket_size * 16), 0)),
       REPEAT(' ', @max_label_len - LENGTH(@label)), '| ',
       IFNULL(REPEAT(IF(@count_in_bucket < @one_unit, '.', IF(@count_in_bucket < @two_unit, '*', '#')), 
       	             IF(@count_in_bucket < @one_unit, @count_in_bucket,
       	             	IF(@count_in_bucket < @two_unit, @count_in_bucket / 2, @count_in_bucket / 3))), ''),
       '\n\n  Total Statements: ', @total_queries, '; Buckets: ', @buckets , '; Bucket Size: ', ROUND(@bucket_size / @unit_div) , ' ', @unit, ';\n'
      ) AS `Performance Schema Statement Digest Average Latency Histogram`;
END//
DELIMITER ;

-- Dumping structure for function sys.ps_thread_account
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_thread_account`(
        in_thread_id BIGINT UNSIGNED
    ) RETURNS text CHARSET utf8mb4
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturn the user@host account for the given Performance Schema thread id.\n\nParameters\n-----------\n\nin_thread_id (BIGINT UNSIGNED):\n  The id of the thread to return the account for.\n\nExample\n-----------\n\nmysql> select thread_id, processlist_user, processlist_host from performance_schema.threads where type = ''foreground'';\n+-----------+------------------+------------------+\n| thread_id | processlist_user | processlist_host |\n+-----------+------------------+------------------+\n|        23 | NULL             | NULL             |\n|        30 | root             | localhost        |\n|        31 | msandbox         | localhost        |\n|        32 | msandbox         | localhost        |\n+-----------+------------------+------------------+\n4 rows in set (0.00 sec)\n\nmysql> select sys.ps_thread_account(31);\n+---------------------------+\n| sys.ps_thread_account(31) |\n+---------------------------+\n| msandbox@localhost        |\n+---------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    RETURN (SELECT IF(
                      type = 'FOREGROUND',
                      CONCAT(processlist_user, '@', processlist_host),
                      type
                     ) AS account
              FROM `performance_schema`.`threads`
             WHERE thread_id = in_thread_id);
END//
DELIMITER ;

-- Dumping structure for function sys.ps_thread_id
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_thread_id`(
        in_connection_id BIGINT UNSIGNED
    ) RETURNS bigint(20) unsigned
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturn the Performance Schema THREAD_ID for the specified connection ID.\n\nParameters\n-----------\n\nin_connection_id (BIGINT UNSIGNED):\n  The id of the connection to return the thread id for. If NULL, the current\n  connection thread id is returned.\n\nExample\n-----------\n\nmysql> SELECT sys.ps_thread_id(79);\n+----------------------+\n| sys.ps_thread_id(79) |\n+----------------------+\n|                   98 |\n+----------------------+\n1 row in set (0.00 sec)\n\nmysql> SELECT sys.ps_thread_id(CONNECTION_ID());\n+-----------------------------------+\n| sys.ps_thread_id(CONNECTION_ID()) |\n+-----------------------------------+\n|                                98 |\n+-----------------------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    RETURN (SELECT THREAD_ID
              FROM `performance_schema`.`threads`
             WHERE PROCESSLIST_ID = IFNULL(in_connection_id, CONNECTION_ID())
           );
END//
DELIMITER ;

-- Dumping structure for function sys.ps_thread_stack
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_thread_stack`(
        thd_id BIGINT UNSIGNED,
        debug BOOLEAN
    ) RETURNS longtext CHARSET latin1
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nOutputs a JSON formatted stack of all statements, stages and events\nwithin Performance Schema for the specified thread.\n\nParameters\n-----------\n\nthd_id (BIGINT UNSIGNED):\n  The id of the thread to trace. This should match the thread_id\n  column from the performance_schema.threads table.\nin_verbose (BOOLEAN):\n  Include file:lineno information in the events.\n\nExample\n-----------\n\n(line separation added for output)\n\nmysql> SELECT sys.ps_thread_stack(37, FALSE) AS thread_stack\\G\n*************************** 1. row ***************************\nthread_stack: {"rankdir": "LR","nodesep": "0.10","stack_created": "2014-02-19 13:39:03",\n"mysql_version": "5.7.3-m13","mysql_user": "root@localhost","events": \n[{"nesting_event_id": "0", "event_id": "10", "timer_wait": 256.35, "event_info": \n"sql/select", "wait_info": "select @@version_comment limit 1\\nerrors: 0\\nwarnings: 0\\nlock time:\n...\n'
BEGIN
    DECLARE json_objects LONGTEXT;
    
    -- Do not track the current thread, it will kill the stack
    UPDATE performance_schema.threads
       SET instrumented = 'NO'
     WHERE processlist_id = CONNECTION_ID();
    
    SET SESSION group_concat_max_len=@@global.max_allowed_packet;
    -- Select the entire stack of events
    SELECT GROUP_CONCAT(CONCAT( '{'
              , CONCAT_WS( ', '
              , CONCAT('"nesting_event_id": "', IF(nesting_event_id IS NULL, '0', nesting_event_id), '"')
              , CONCAT('"event_id": "', event_id, '"')
              -- Convert from picoseconds to microseconds
              , CONCAT( '"timer_wait": ', ROUND(timer_wait/1000000, 2))  
              , CONCAT( '"event_info": "'
                  , CASE
                        WHEN event_name NOT LIKE 'wait/io%' THEN REPLACE(SUBSTRING_INDEX(event_name, '/', -2), '\\', '\\\\')
                        WHEN event_name NOT LIKE 'wait/io/file%' OR event_name NOT LIKE 'wait/io/socket%' THEN REPLACE(SUBSTRING_INDEX(event_name, '/', -4), '\\', '\\\\')
                        ELSE event_name
                    END
                  , '"'
              )
              -- Always dump the extra wait information gathered for statements
              , CONCAT( '"wait_info": "', IFNULL(wait_info, ''), '"')
              -- If debug is enabled, add the file:lineno information for waits
              , CONCAT( '"source": "', IF(true AND event_name LIKE 'wait%', IFNULL(wait_info, ''), ''), '"')
              -- Depending on the type of event, name it appropriately
              , CASE 
                     WHEN event_name LIKE 'wait/io/file%'      THEN '"event_type": "io/file"'
                     WHEN event_name LIKE 'wait/io/table%'     THEN '"event_type": "io/table"'
                     WHEN event_name LIKE 'wait/io/socket%'    THEN '"event_type": "io/socket"'
                     WHEN event_name LIKE 'wait/synch/mutex%'  THEN '"event_type": "synch/mutex"'
                     WHEN event_name LIKE 'wait/synch/cond%'   THEN '"event_type": "synch/cond"'
                     WHEN event_name LIKE 'wait/synch/rwlock%' THEN '"event_type": "synch/rwlock"'
                     WHEN event_name LIKE 'wait/lock%'         THEN '"event_type": "lock"'
                     WHEN event_name LIKE 'statement/%'        THEN '"event_type": "stmt"'
                     WHEN event_name LIKE 'stage/%'            THEN '"event_type": "stage"'
                     WHEN event_name LIKE '%idle%'             THEN '"event_type": "idle"'
                     ELSE '' 
                END                   
            )
            , '}'
          )
          ORDER BY event_id ASC SEPARATOR ',') event
    INTO json_objects
    FROM (
          
          -- Select all statements, with the extra tracing information available
          (SELECT thread_id, event_id, event_name, timer_wait, timer_start, nesting_event_id, 
                  CONCAT(sql_text, '\\n',
                         'errors: ', errors, '\\n',
                         'warnings: ', warnings, '\\n',
                         'lock time: ', ROUND(lock_time/1000000, 2),'us\\n',
                         'rows affected: ', rows_affected, '\\n',
                         'rows sent: ', rows_sent, '\\n',
                         'rows examined: ', rows_examined, '\\n',
                         'tmp tables: ', created_tmp_tables, '\\n',
                         'tmp disk tables: ', created_tmp_disk_tables, '\\n',
                         'select scan: ', select_scan, '\\n',
                         'select full join: ', select_full_join, '\\n',
                         'select full range join: ', select_full_range_join, '\\n',
                         'select range: ', select_range, '\\n',
                         'select range check: ', select_range_check, '\\n', 
                         'sort merge passes: ', sort_merge_passes, '\\n',
                         'sort rows: ', sort_rows, '\\n',
                         'sort range: ', sort_range, '\\n',
                         'sort scan: ', sort_scan, '\\n',
                         'no index used: ', IF(no_index_used, 'TRUE', 'FALSE'), '\\n',
                         'no good index used: ', IF(no_good_index_used, 'TRUE', 'FALSE'), '\\n'
                         ) AS wait_info
             FROM performance_schema.events_statements_history_long WHERE thread_id = thd_id)
          UNION 
          -- Select all stages
          (SELECT thread_id, event_id, event_name, timer_wait, timer_start, nesting_event_id, null AS wait_info
             FROM performance_schema.events_stages_history_long WHERE thread_id = thd_id) 
          UNION 
          -- Select all events, adding information appropriate to the event
          (SELECT thread_id, event_id, 
                  CONCAT(event_name , 
                         IF(event_name NOT LIKE 'wait/synch/mutex%', IFNULL(CONCAT(' - ', operation), ''), ''), 
                         IF(number_of_bytes IS NOT NULL, CONCAT(' ', number_of_bytes, ' bytes'), ''),
                         IF(event_name LIKE 'wait/io/file%', '\\n', ''),
                         IF(object_schema IS NOT NULL, CONCAT('\\nObject: ', object_schema, '.'), ''), 
                         IF(object_name IS NOT NULL, 
                            IF (event_name LIKE 'wait/io/socket%',
                                -- Print the socket if used, else the IP:port as reported
                                CONCAT(IF (object_name LIKE ':0%', @@socket, object_name)),
                                object_name),
                            ''),
                          IF(index_name IS NOT NULL, CONCAT(' Index: ', index_name), ''), '\\n'
                         ) AS event_name,
                  timer_wait, timer_start, nesting_event_id, source AS wait_info
             FROM performance_schema.events_waits_history_long WHERE thread_id = thd_id)) events 
    ORDER BY event_id;
    RETURN CONCAT('{', 
                  CONCAT_WS(',', 
                            '"rankdir": "LR"',
                            '"nodesep": "0.10"',
                            CONCAT('"stack_created": "', NOW(), '"'),
                            CONCAT('"mysql_version": "', VERSION(), '"'),
                            CONCAT('"mysql_user": "', CURRENT_USER(), '"'),
                            CONCAT('"events": [', IFNULL(json_objects,''), ']')
                           ),
                  '}');
END//
DELIMITER ;

-- Dumping structure for function sys.ps_thread_trx_info
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `ps_thread_trx_info`(
        in_thread_id BIGINT UNSIGNED
    ) RETURNS longtext CHARSET utf8mb4
    READS SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturns a JSON object with info on the given threads current transaction, \nand the statements it has already executed, derived from the\nperformance_schema.events_transactions_current and\nperformance_schema.events_statements_history tables (so the consumers \nfor these also have to be enabled within Performance Schema to get full\ndata in the object).\n\nWhen the output exceeds the default truncation length (65535), a JSON error\nobject is returned, such as:\n\n{ "error": "Trx info truncated: Row 6 was cut by GROUP_CONCAT()" }\n\nSimilar error objects are returned for other warnings/and exceptions raised\nwhen calling the function.\n\nThe max length of the output of this function can be controlled with the\nps_thread_trx_info.max_length variable set via sys_config, or the\n@sys.ps_thread_trx_info.max_length user variable, as appropriate.\n\nParameters\n-----------\n\nin_thread_id (BIGINT UNSIGNED):\n  The id of the thread to return the transaction info for.\n\nExample\n-----------\n\nSELECT sys.ps_thread_trx_info(48)\\G\n*************************** 1. row ***************************\nsys.ps_thread_trx_info(48): [\n  {\n    "time": "790.70 us",\n    "state": "COMMITTED",\n    "mode": "READ WRITE",\n    "autocommitted": "NO",\n    "gtid": "AUTOMATIC",\n    "isolation": "REPEATABLE READ",\n    "statements_executed": [\n      {\n        "sql_text": "INSERT INTO info VALUES (1, ''foo'')",\n        "time": "471.02 us",\n        "schema": "trx",\n        "rows_examined": 0,\n        "rows_affected": 1,\n        "rows_sent": 0,\n        "tmp_tables": 0,\n        "tmp_disk_tables": 0,\n        "sort_rows": 0,\n        "sort_merge_passes": 0\n      },\n      {\n        "sql_text": "COMMIT",\n        "time": "254.42 us",\n        "schema": "trx",\n        "rows_examined": 0,\n        "rows_affected": 0,\n        "rows_sent": 0,\n        "tmp_tables": 0,\n        "tmp_disk_tables": 0,\n        "sort_rows": 0,\n        "sort_merge_passes": 0\n      }\n    ]\n  },\n  {\n    "time": "426.20 us",\n    "state": "COMMITTED",\n    "mode": "READ WRITE",\n    "autocommitted": "NO",\n    "gtid": "AUTOMATIC",\n    "isolation": "REPEATABLE READ",\n    "statements_executed": [\n      {\n        "sql_text": "INSERT INTO info VALUES (2, ''bar'')",\n        "time": "107.33 us",\n        "schema": "trx",\n        "rows_examined": 0,\n        "rows_affected": 1,\n        "rows_sent": 0,\n        "tmp_tables": 0,\n        "tmp_disk_tables": 0,\n        "sort_rows": 0,\n        "sort_merge_passes": 0\n      },\n      {\n        "sql_text": "COMMIT",\n        "time": "213.23 us",\n        "schema": "trx",\n        "rows_examined": 0,\n        "rows_affected": 0,\n        "rows_sent": 0,\n        "tmp_tables": 0,\n        "tmp_disk_tables": 0,\n        "sort_rows": 0,\n        "sort_merge_passes": 0\n      }\n    ]\n  }\n]\n1 row in set (0.03 sec)\n'
BEGIN
    DECLARE v_output LONGTEXT DEFAULT '{}';
    DECLARE v_msg_text TEXT DEFAULT '';
    DECLARE v_signal_msg TEXT DEFAULT '';
    DECLARE v_mysql_errno INT;
    DECLARE v_max_output_len BIGINT;
    -- Capture warnings/errors such as group_concat truncation
    -- and report as JSON error objects
    DECLARE EXIT HANDLER FOR SQLWARNING, SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1
            v_msg_text = MESSAGE_TEXT,
            v_mysql_errno = MYSQL_ERRNO;
        IF v_mysql_errno = 1260 THEN
            SET v_signal_msg = CONCAT('{ "error": "Trx info truncated: ', v_msg_text, '" }');
        ELSE
            SET v_signal_msg = CONCAT('{ "error": "', v_msg_text, '" }');
        END IF;
        RETURN v_signal_msg;
    END;
    -- Set configuration options
    IF (@sys.ps_thread_trx_info.max_length IS NULL) THEN
        SET @sys.ps_thread_trx_info.max_length = sys.sys_get_config('ps_thread_trx_info.max_length', 65535);
    END IF;
    IF (@sys.ps_thread_trx_info.max_length != @@session.group_concat_max_len) THEN
        SET @old_group_concat_max_len = @@session.group_concat_max_len;
        -- Convert to int value for the SET, and give some surrounding space
        SET v_max_output_len = (@sys.ps_thread_trx_info.max_length - 5);
        SET SESSION group_concat_max_len = v_max_output_len;
    END IF;
    SET v_output = (
        SELECT CONCAT('[', IFNULL(GROUP_CONCAT(trx_info ORDER BY event_id), ''), '\n]') AS trx_info
          FROM (SELECT trxi.thread_id, 
                       trxi.event_id,
                       GROUP_CONCAT(
                         IFNULL(
                           CONCAT('\n  {\n',
                                  '    "time": "', IFNULL(sys.format_time(trxi.timer_wait), ''), '",\n',
                                  '    "state": "', IFNULL(trxi.state, ''), '",\n',
                                  '    "mode": "', IFNULL(trxi.access_mode, ''), '",\n',
                                  '    "autocommitted": "', IFNULL(trxi.autocommit, ''), '",\n',
                                  '    "gtid": "', IFNULL(trxi.gtid, ''), '",\n',
                                  '    "isolation": "', IFNULL(trxi.isolation_level, ''), '",\n',
                                  '    "statements_executed": [', IFNULL(s.stmts, ''), IF(s.stmts IS NULL, ' ]\n', '\n    ]\n'),
                                  '  }'
                           ), 
                           '') 
                         ORDER BY event_id) AS trx_info
                  FROM (
                        (SELECT thread_id, event_id, timer_wait, state,access_mode, autocommit, gtid, isolation_level
                           FROM performance_schema.events_transactions_current
                          WHERE thread_id = in_thread_id
                            AND end_event_id IS NULL)
                        UNION
                        (SELECT thread_id, event_id, timer_wait, state,access_mode, autocommit, gtid, isolation_level
                           FROM performance_schema.events_transactions_history
                          WHERE thread_id = in_thread_id)
                       ) AS trxi
                  LEFT JOIN (SELECT thread_id,
                                    nesting_event_id,
                                    GROUP_CONCAT(
                                      IFNULL(
                                        CONCAT('\n      {\n',
                                               '        "sql_text": "', IFNULL(sys.format_statement(REPLACE(sql_text, '\\', '\\\\')), ''), '",\n',
                                               '        "time": "', IFNULL(sys.format_time(timer_wait), ''), '",\n',
                                               '        "schema": "', IFNULL(current_schema, ''), '",\n',
                                               '        "rows_examined": ', IFNULL(rows_examined, ''), ',\n',
                                               '        "rows_affected": ', IFNULL(rows_affected, ''), ',\n',
                                               '        "rows_sent": ', IFNULL(rows_sent, ''), ',\n',
                                               '        "tmp_tables": ', IFNULL(created_tmp_tables, ''), ',\n',
                                               '        "tmp_disk_tables": ', IFNULL(created_tmp_disk_tables, ''), ',\n',
                                               '        "sort_rows": ', IFNULL(sort_rows, ''), ',\n',
                                               '        "sort_merge_passes": ', IFNULL(sort_merge_passes, ''), '\n',
                                               '      }'), '') ORDER BY event_id) AS stmts
                               FROM performance_schema.events_statements_history
                              WHERE sql_text IS NOT NULL
                                AND thread_id = in_thread_id
                              GROUP BY thread_id, nesting_event_id
                            ) AS s 
                    ON trxi.thread_id = s.thread_id 
                   AND trxi.event_id = s.nesting_event_id
                 WHERE trxi.thread_id = in_thread_id
                 GROUP BY trxi.thread_id, trxi.event_id
                ) trxs
          GROUP BY thread_id
    );
    IF (@old_group_concat_max_len IS NOT NULL) THEN
        SET SESSION group_concat_max_len = @old_group_concat_max_len;
    END IF;
    RETURN v_output;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_trace_statement_digest
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_trace_statement_digest`(
        IN in_digest VARCHAR(64),
        IN in_runtime INT,
        IN in_interval DECIMAL(2,2),
        IN in_start_fresh BOOLEAN,
        IN in_auto_enable BOOLEAN
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTraces all instrumentation within Performance Schema for a specific\nStatement Digest.\n\nWhen finding a statement of interest within the\nperformance_schema.events_statements_summary_by_digest table, feed\nthe DIGEST value in to this procedure, set how long to poll for,\nand at what interval to poll, and it will generate a report of all\nstatistics tracked within Performance Schema for that digest for the\ninterval.\n\nIt will also attempt to generate an EXPLAIN for the longest running\nexample of the digest during the interval. Note this may fail, as:\n\n   * Performance Schema truncates long SQL_TEXT values (and hence the\n     EXPLAIN will fail due to parse errors)\n   * the default schema is sys (so tables that are not fully qualified\n     in the query may not be found)\n   * some queries such as SHOW are not supported in EXPLAIN.\n\nWhen the EXPLAIN fails, the error will be ignored and no EXPLAIN\noutput generated.\n\nRequires the SUPER privilege for "SET sql_log_bin = 0;".\n\nParameters\n-----------\n\nin_digest (VARCHAR(64)):\n  The statement digest identifier you would like to analyze\nin_runtime (INT):\n  The number of seconds to run analysis for\nin_interval (DECIMAL(2,2)):\n  The interval (in seconds, may be fractional) at which to try\n  and take snapshots\nin_start_fresh (BOOLEAN):\n  Whether to TRUNCATE the events_statements_history_long and\n  events_stages_history_long tables before starting\nin_auto_enable (BOOLEAN):\n  Whether to automatically turn on required consumers\n\nExample\n-----------\n\nmysql> call ps_trace_statement_digest(''891ec6860f98ba46d89dd20b0c03652c'', 10, 0.1, true, true);\n+--------------------+\n| SUMMARY STATISTICS |\n+--------------------+\n| SUMMARY STATISTICS |\n+--------------------+\n1 row in set (9.11 sec)\n\n+------------+-----------+-----------+-----------+---------------+------------+------------+\n| executions | exec_time | lock_time | rows_sent | rows_examined | tmp_tables | full_scans |\n+------------+-----------+-----------+-----------+---------------+------------+------------+\n|         21 | 4.11 ms   | 2.00 ms   |         0 |            21 |          0 |          0 |\n+------------+-----------+-----------+-----------+---------------+------------+------------+\n1 row in set (9.11 sec)\n\n+------------------------------------------+-------+-----------+\n| event_name                               | count | latency   |\n+------------------------------------------+-------+-----------+\n| stage/sql/checking query cache for query |    16 | 724.37 us |\n| stage/sql/statistics                     |    16 | 546.92 us |\n| stage/sql/freeing items                  |    18 | 520.11 us |\n| stage/sql/init                           |    51 | 466.80 us |\n...\n| stage/sql/cleaning up                    |    18 | 11.92 us  |\n| stage/sql/executing                      |    16 | 6.95 us   |\n+------------------------------------------+-------+-----------+\n17 rows in set (9.12 sec)\n\n+---------------------------+\n| LONGEST RUNNING STATEMENT |\n+---------------------------+\n| LONGEST RUNNING STATEMENT |\n+---------------------------+\n1 row in set (9.16 sec)\n\n+-----------+-----------+-----------+-----------+---------------+------------+-----------+\n| thread_id | exec_time | lock_time | rows_sent | rows_examined | tmp_tables | full_scan |\n+-----------+-----------+-----------+-----------+---------------+------------+-----------+\n|    166646 | 618.43 us | 1.00 ms   |         0 |             1 |          0 |         0 |\n+-----------+-----------+-----------+-----------+---------------+------------+-----------+\n1 row in set (9.16 sec)\n\n// Truncated for clarity...\n+-----------------------------------------------------------------+\n| sql_text                                                        |\n+-----------------------------------------------------------------+\n| select hibeventhe0_.id as id1382_, hibeventhe0_.createdTime ... |\n+-----------------------------------------------------------------+\n1 row in set (9.17 sec)\n\n+------------------------------------------+-----------+\n| event_name                               | latency   |\n+------------------------------------------+-----------+\n| stage/sql/init                           | 8.61 us   |\n| stage/sql/Waiting for query cache lock   | 453.23 us |\n| stage/sql/init                           | 331.07 ns |\n| stage/sql/checking query cache for query | 43.04 us  |\n...\n| stage/sql/freeing items                  | 30.46 us  |\n| stage/sql/cleaning up                    | 662.13 ns |\n+------------------------------------------+-----------+\n18 rows in set (9.23 sec)\n\n+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+\n| id | select_type | table        | type  | possible_keys | key       | key_len | ref         | rows | Extra |\n+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+\n|  1 | SIMPLE      | hibeventhe0_ | const | fixedTime     | fixedTime | 775     | const,const |    1 | NULL  |\n+----+-------------+--------------+-------+---------------+-----------+---------+-------------+------+-------+\n1 row in set (9.27 sec)\n\nQuery OK, 0 rows affected (9.28 sec)\n'
BEGIN
    DECLARE v_start_fresh BOOLEAN DEFAULT false;
    DECLARE v_auto_enable BOOLEAN DEFAULT false;
    DECLARE v_explain     BOOLEAN DEFAULT true;
    DECLARE v_this_thread_enabed ENUM('YES', 'NO');
    DECLARE v_runtime INT DEFAULT 0;
    DECLARE v_start INT DEFAULT 0;
    DECLARE v_found_stmts INT;
    SET @log_bin := @@sql_log_bin;
    SET sql_log_bin = 0;
    -- Do not track the current thread, it will kill the stack
    SELECT INSTRUMENTED INTO v_this_thread_enabed FROM performance_schema.threads WHERE PROCESSLIST_ID = CONNECTION_ID();
    CALL sys.ps_setup_disable_thread(CONNECTION_ID());
    DROP TEMPORARY TABLE IF EXISTS stmt_trace;
    CREATE TEMPORARY TABLE stmt_trace (
        thread_id BIGINT UNSIGNED,
        timer_start BIGINT UNSIGNED,
        event_id BIGINT UNSIGNED,
        sql_text longtext,
        timer_wait BIGINT UNSIGNED,
        lock_time BIGINT UNSIGNED,
        errors BIGINT UNSIGNED,
        mysql_errno INT,
        rows_sent BIGINT UNSIGNED,
        rows_affected BIGINT UNSIGNED,
        rows_examined BIGINT UNSIGNED,
        created_tmp_tables BIGINT UNSIGNED,
        created_tmp_disk_tables BIGINT UNSIGNED,
        no_index_used BIGINT UNSIGNED,
        PRIMARY KEY (thread_id, timer_start)
    );
    DROP TEMPORARY TABLE IF EXISTS stmt_stages;
    CREATE TEMPORARY TABLE stmt_stages (
       event_id BIGINT UNSIGNED,
       stmt_id BIGINT UNSIGNED,
       event_name VARCHAR(128),
       timer_wait BIGINT UNSIGNED,
       PRIMARY KEY (event_id)
    );
    SET v_start_fresh = in_start_fresh;
    IF v_start_fresh THEN
        TRUNCATE TABLE performance_schema.events_statements_history_long;
        TRUNCATE TABLE performance_schema.events_stages_history_long;
    END IF;
    SET v_auto_enable = in_auto_enable;
    IF v_auto_enable THEN
        CALL sys.ps_setup_save(0);
        UPDATE performance_schema.threads
           SET INSTRUMENTED = IF(PROCESSLIST_ID IS NOT NULL, 'YES', 'NO');
        -- Only the events_statements_history_long and events_stages_history_long tables and their ancestors are needed
        UPDATE performance_schema.setup_consumers
           SET ENABLED = 'YES'
         WHERE NAME NOT LIKE '%\_history'
               AND NAME NOT LIKE 'events_wait%'
               AND NAME NOT LIKE 'events_transactions%'
               AND NAME <> 'statements_digest';
        UPDATE performance_schema.setup_instruments
           SET ENABLED = 'YES',
               TIMED   = 'YES'
         WHERE NAME LIKE 'statement/%' OR NAME LIKE 'stage/%';
    END IF;
    WHILE v_runtime < in_runtime DO
        SELECT UNIX_TIMESTAMP() INTO v_start;
        INSERT IGNORE INTO stmt_trace
        SELECT thread_id, timer_start, event_id, sql_text, timer_wait, lock_time, errors, mysql_errno, 
               rows_sent, rows_affected, rows_examined, created_tmp_tables, created_tmp_disk_tables, no_index_used
          FROM performance_schema.events_statements_history_long
        WHERE digest = in_digest;
        INSERT IGNORE INTO stmt_stages
        SELECT stages.event_id, stmt_trace.event_id,
               stages.event_name, stages.timer_wait
          FROM performance_schema.events_stages_history_long AS stages
          JOIN stmt_trace ON stages.nesting_event_id = stmt_trace.event_id;
        SELECT SLEEP(in_interval) INTO @sleep;
        SET v_runtime = v_runtime + (UNIX_TIMESTAMP() - v_start);
    END WHILE;
    SELECT "SUMMARY STATISTICS";
    SELECT COUNT(*) executions,
           sys.format_time(SUM(timer_wait)) AS exec_time,
           sys.format_time(SUM(lock_time)) AS lock_time,
           SUM(rows_sent) AS rows_sent,
           SUM(rows_affected) AS rows_affected,
           SUM(rows_examined) AS rows_examined,
           SUM(created_tmp_tables) AS tmp_tables,
           SUM(no_index_used) AS full_scans
      FROM stmt_trace;
    SELECT event_name,
           COUNT(*) as count,
           sys.format_time(SUM(timer_wait)) as latency
      FROM stmt_stages
     GROUP BY event_name
     ORDER BY SUM(timer_wait) DESC;
    SELECT "LONGEST RUNNING STATEMENT";
    SELECT thread_id,
           sys.format_time(timer_wait) AS exec_time,
           sys.format_time(lock_time) AS lock_time,
           rows_sent,
           rows_affected,
           rows_examined,
           created_tmp_tables AS tmp_tables,
           no_index_used AS full_scan
      FROM stmt_trace
     ORDER BY timer_wait DESC LIMIT 1;
    SELECT sql_text
      FROM stmt_trace
     ORDER BY timer_wait DESC LIMIT 1;
    SELECT sql_text, event_id INTO @sql, @sql_id
      FROM stmt_trace
    ORDER BY timer_wait DESC LIMIT 1;
    IF (@sql_id IS NOT NULL) THEN
        SELECT event_name,
               sys.format_time(timer_wait) as latency
          FROM stmt_stages
         WHERE stmt_id = @sql_id
         ORDER BY event_id;
    END IF;
    DROP TEMPORARY TABLE stmt_trace;
    DROP TEMPORARY TABLE stmt_stages;
    IF (@sql IS NOT NULL) THEN
        SET @stmt := CONCAT("EXPLAIN FORMAT=JSON ", @sql);
        BEGIN
            -- Not all queries support EXPLAIN, so catch the cases that are
            -- not supported. Currently that includes cases where the table
            -- is not fully qualified and is not in the default schema for this
            -- procedure as it's not possible to change the default schema inside
            -- a procedure.
            --
            -- Errno = 1064: You have an error in your SQL syntax
            -- Errno = 1146: Table '...' doesn't exist
            DECLARE CONTINUE HANDLER FOR 1064, 1146 SET v_explain = false;
            PREPARE explain_stmt FROM @stmt;
        END;
        IF (v_explain) THEN
            EXECUTE explain_stmt;
            DEALLOCATE PREPARE explain_stmt;
        END IF;
    END IF;
    IF v_auto_enable THEN
        CALL sys.ps_setup_reload_saved();
    END IF;
    -- Restore INSTRUMENTED for this thread
    IF (v_this_thread_enabed = 'YES') THEN
        CALL sys.ps_setup_enable_thread(CONNECTION_ID());
    END IF;
    SET sql_log_bin = @log_bin;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_trace_thread
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_trace_thread`(
        IN in_thread_id BIGINT UNSIGNED,
        IN in_outfile VARCHAR(255),
        IN in_max_runtime DECIMAL(20,2),
        IN in_interval DECIMAL(20,2),
        IN in_start_fresh BOOLEAN,
        IN in_auto_setup BOOLEAN,
        IN in_debug BOOLEAN
    )
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nDumps all data within Performance Schema for an instrumented thread,\nto create a DOT formatted graph file. \n\nEach resultset returned from the procedure should be used for a complete graph\n\nRequires the SUPER privilege for "SET sql_log_bin = 0;".\n\nParameters\n-----------\n\nin_thread_id (BIGINT UNSIGNED):\n  The thread that you would like a stack trace for\nin_outfile  (VARCHAR(255)):\n  The filename the dot file will be written to\nin_max_runtime (DECIMAL(20,2)):\n  The maximum time to keep collecting data.\n  Use NULL to get the default which is 60 seconds.\nin_interval (DECIMAL(20,2)): \n  How long to sleep between data collections. \n  Use NULL to get the default which is 1 second.\nin_start_fresh (BOOLEAN):\n  Whether to reset all Performance Schema data before tracing.\nin_auto_setup (BOOLEAN):\n  Whether to disable all other threads and enable all consumers/instruments. \n  This will also reset the settings at the end of the run.\nin_debug (BOOLEAN):\n  Whether you would like to include file:lineno in the graph\n\nExample\n-----------\n\nmysql> CALL sys.ps_trace_thread(25, CONCAT(''/tmp/stack-'', REPLACE(NOW(), '' '', ''-''), ''.dot''), NULL, NULL, TRUE, TRUE, TRUE);\n+-------------------+\n| summary           |\n+-------------------+\n| Disabled 1 thread |\n+-------------------+\n1 row in set (0.00 sec)\n\n+---------------------------------------------+\n| Info                                        |\n+---------------------------------------------+\n| Data collection starting for THREAD_ID = 25 |\n+---------------------------------------------+\n1 row in set (0.03 sec)\n\n+-----------------------------------------------------------+\n| Info                                                      |\n+-----------------------------------------------------------+\n| Stack trace written to /tmp/stack-2014-02-16-21:18:41.dot |\n+-----------------------------------------------------------+\n1 row in set (60.07 sec)\n\n+-------------------------------------------------------------------+\n| Convert to PDF                                                    |\n+-------------------------------------------------------------------+\n| dot -Tpdf -o /tmp/stack_25.pdf /tmp/stack-2014-02-16-21:18:41.dot |\n+-------------------------------------------------------------------+\n1 row in set (60.07 sec)\n\n+-------------------------------------------------------------------+\n| Convert to PNG                                                    |\n+-------------------------------------------------------------------+\n| dot -Tpng -o /tmp/stack_25.png /tmp/stack-2014-02-16-21:18:41.dot |\n+-------------------------------------------------------------------+\n1 row in set (60.07 sec)\n\n+------------------+\n| summary          |\n+------------------+\n| Enabled 1 thread |\n+------------------+\n1 row in set (60.32 sec)\n'
BEGIN
    DECLARE v_done bool DEFAULT FALSE;
    DECLARE v_start, v_runtime DECIMAL(20,2) DEFAULT 0.0;
    DECLARE v_min_event_id bigint unsigned DEFAULT 0;
    DECLARE v_this_thread_enabed ENUM('YES', 'NO');
    DECLARE v_event longtext;
    DECLARE c_stack CURSOR FOR
        SELECT CONCAT(IF(nesting_event_id IS NOT NULL, CONCAT(nesting_event_id, ' -> '), ''), 
                    event_id, '; ', event_id, ' [label="',
                    -- Convert from picoseconds to microseconds
                    '(', sys.format_time(timer_wait), ') ',
                    IF (event_name NOT LIKE 'wait/io%', 
                        SUBSTRING_INDEX(event_name, '/', -2), 
                        IF (event_name NOT LIKE 'wait/io/file%' OR event_name NOT LIKE 'wait/io/socket%',
                            SUBSTRING_INDEX(event_name, '/', -4),
                            event_name)
                        ),
                    -- Always dump the extra wait information gathered for transactions and statements
                    IF (event_name LIKE 'transaction', IFNULL(CONCAT('\\n', wait_info), ''), ''),
                    IF (event_name LIKE 'statement/%', IFNULL(CONCAT('\\n', wait_info), ''), ''),
                    -- If debug is enabled, add the file:lineno information for waits
                    IF (in_debug AND event_name LIKE 'wait%', wait_info, ''),
                    '", ', 
                    -- Depending on the type of event, style appropriately
                    CASE WHEN event_name LIKE 'wait/io/file%' THEN 
                           'shape=box, style=filled, color=red'
                         WHEN event_name LIKE 'wait/io/table%' THEN 
                           'shape=box, style=filled, color=green'
                         WHEN event_name LIKE 'wait/io/socket%' THEN
                           'shape=box, style=filled, color=yellow'
                         WHEN event_name LIKE 'wait/synch/mutex%' THEN
                           'style=filled, color=lightskyblue'
                         WHEN event_name LIKE 'wait/synch/cond%' THEN
                           'style=filled, color=darkseagreen3'
                         WHEN event_name LIKE 'wait/synch/rwlock%' THEN
                           'style=filled, color=orchid'
                         WHEN event_name LIKE 'wait/synch/sxlock%' THEN
                           'style=filled, color=palevioletred' 
                         WHEN event_name LIKE 'wait/lock%' THEN
                           'shape=box, style=filled, color=tan'
                         WHEN event_name LIKE 'statement/%' THEN
                           CONCAT('shape=box, style=bold',
                                  -- Style statements depending on COM vs SQL
                                  CASE WHEN event_name LIKE 'statement/com/%' THEN
                                         ' style=filled, color=darkseagreen'
                                       ELSE
                                         -- Use long query time from the server to
                                         -- flag long running statements in red
                                         IF((timer_wait/1000000000000) > @@long_query_time, 
                                            ' style=filled, color=red', 
                                            ' style=filled, color=lightblue')
                                  END
                           )
                         WHEN event_name LIKE 'transaction' THEN
                           'shape=box, style=filled, color=lightblue3'
                         WHEN event_name LIKE 'stage/%' THEN
                           'style=filled, color=slategray3'
                         -- IDLE events are on their own, call attention to them
                         WHEN event_name LIKE '%idle%' THEN
                           'shape=box, style=filled, color=firebrick3'
                         ELSE '' END,
                     '];\n'
                   ) event, event_id
        FROM (
             -- Select all transactions
             (SELECT thread_id, event_id, event_name, timer_wait, timer_start, nesting_event_id,
                     CONCAT('trx_id: ',  IFNULL(trx_id, ''), '\\n',
                            'gtid: ', IFNULL(gtid, ''), '\\n',
                            'state: ', state, '\\n',
                            'mode: ', access_mode, '\\n',
                            'isolation: ', isolation_level, '\\n',
                            'autocommit: ', autocommit, '\\n',
                            'savepoints: ', number_of_savepoints, '\\n'
                     ) AS wait_info
                FROM performance_schema.events_transactions_history_long
               WHERE thread_id = in_thread_id AND event_id > v_min_event_id)
             UNION
             -- Select all statements, with the extra tracing information available
             (SELECT thread_id, event_id, event_name, timer_wait, timer_start, nesting_event_id, 
                     CONCAT('statement: ', sql_text, '\\n',
                            'errors: ', errors, '\\n',
                            'warnings: ', warnings, '\\n',
                            'lock time: ', sys.format_time(lock_time),'\\n',
                            'rows affected: ', rows_affected, '\\n',
                            'rows sent: ', rows_sent, '\\n',
                            'rows examined: ', rows_examined, '\\n',
                            'tmp tables: ', created_tmp_tables, '\\n',
                            'tmp disk tables: ', created_tmp_disk_tables, '\\n'
                            'select scan: ', select_scan, '\\n',
                            'select full join: ', select_full_join, '\\n',
                            'select full range join: ', select_full_range_join, '\\n',
                            'select range: ', select_range, '\\n',
                            'select range check: ', select_range_check, '\\n', 
                            'sort merge passes: ', sort_merge_passes, '\\n',
                            'sort rows: ', sort_rows, '\\n',
                            'sort range: ', sort_range, '\\n',
                            'sort scan: ', sort_scan, '\\n',
                            'no index used: ', IF(no_index_used, 'TRUE', 'FALSE'), '\\n',
                            'no good index used: ', IF(no_good_index_used, 'TRUE', 'FALSE'), '\\n'
                     ) AS wait_info
                FROM performance_schema.events_statements_history_long
               WHERE thread_id = in_thread_id AND event_id > v_min_event_id)
             UNION
             -- Select all stages
             (SELECT thread_id, event_id, event_name, timer_wait, timer_start, nesting_event_id, null AS wait_info
                FROM performance_schema.events_stages_history_long 
               WHERE thread_id = in_thread_id AND event_id > v_min_event_id)
             UNION 
             -- Select all events, adding information appropriate to the event
             (SELECT thread_id, event_id, 
                     CONCAT(event_name, 
                            IF(event_name NOT LIKE 'wait/synch/mutex%', IFNULL(CONCAT(' - ', operation), ''), ''), 
                            IF(number_of_bytes IS NOT NULL, CONCAT(' ', number_of_bytes, ' bytes'), ''),
                            IF(event_name LIKE 'wait/io/file%', '\\n', ''),
                            IF(object_schema IS NOT NULL, CONCAT('\\nObject: ', object_schema, '.'), ''), 
                            IF(object_name IS NOT NULL, 
                               IF (event_name LIKE 'wait/io/socket%',
                                   -- Print the socket if used, else the IP:port as reported
                                   CONCAT('\\n', IF (object_name LIKE ':0%', @@socket, object_name)),
                                   object_name),
                               ''
                            ),
                            IF(index_name IS NOT NULL, CONCAT(' Index: ', index_name), ''), '\\n'
                     ) AS event_name,
                     timer_wait, timer_start, nesting_event_id, source AS wait_info
                FROM performance_schema.events_waits_history_long
               WHERE thread_id = in_thread_id AND event_id > v_min_event_id)
           ) events 
       ORDER BY event_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    SET @log_bin := @@sql_log_bin;
    SET sql_log_bin = 0;
    -- Do not track the current thread, it will kill the stack
    SELECT INSTRUMENTED INTO v_this_thread_enabed FROM performance_schema.threads WHERE PROCESSLIST_ID = CONNECTION_ID();
    CALL sys.ps_setup_disable_thread(CONNECTION_ID());
    IF (in_auto_setup) THEN
        CALL sys.ps_setup_save(0);
        -- Ensure only the thread to create the stack trace for is instrumented and that we instrument everything.
        DELETE FROM performance_schema.setup_actors;
        UPDATE performance_schema.threads
           SET INSTRUMENTED = IF(THREAD_ID = in_thread_id, 'YES', 'NO');
        -- only the %_history_long tables and it ancestors are needed
        UPDATE performance_schema.setup_consumers
           SET ENABLED = 'YES'
         WHERE NAME NOT LIKE '%\_history';
        UPDATE performance_schema.setup_instruments
           SET ENABLED = 'YES',
               TIMED   = 'YES';
    END IF;
    IF (in_start_fresh) THEN
        TRUNCATE performance_schema.events_transactions_history_long;
        TRUNCATE performance_schema.events_statements_history_long;
        TRUNCATE performance_schema.events_stages_history_long;
        TRUNCATE performance_schema.events_waits_history_long;
    END IF;
    DROP TEMPORARY TABLE IF EXISTS tmp_events;
    CREATE TEMPORARY TABLE tmp_events (
      event_id bigint unsigned NOT NULL,
      event longblob,
      PRIMARY KEY (event_id)
    );
    -- Print headers for a .dot file
    INSERT INTO tmp_events VALUES (0, CONCAT('digraph events { rankdir=LR; nodesep=0.10;\n',
                                             '// Stack created .....: ', NOW(), '\n',
                                             '// MySQL version .....: ', VERSION(), '\n',
                                             '// MySQL hostname ....: ', @@hostname, '\n',
                                             '// MySQL port ........: ', @@port, '\n',
                                             '// MySQL socket ......: ', @@socket, '\n',
                                             '// MySQL user ........: ', CURRENT_USER(), '\n'));
    SELECT CONCAT('Data collection starting for THREAD_ID = ', in_thread_id) AS 'Info';
    SET v_min_event_id = 0,
        v_start        = UNIX_TIMESTAMP(),
        in_interval    = IFNULL(in_interval, 1.00),
        in_max_runtime = IFNULL(in_max_runtime, 60.00);
    WHILE (v_runtime < in_max_runtime
           AND (SELECT INSTRUMENTED FROM performance_schema.threads WHERE THREAD_ID = in_thread_id) = 'YES') DO
        SET v_done = FALSE;
        OPEN c_stack;
        c_stack_loop: LOOP
            FETCH c_stack INTO v_event, v_min_event_id;
            IF v_done THEN
                LEAVE c_stack_loop;
            END IF;
            IF (LENGTH(v_event) > 0) THEN
                INSERT INTO tmp_events VALUES (v_min_event_id, v_event);
            END IF;
        END LOOP;
        CLOSE c_stack;
        SELECT SLEEP(in_interval) INTO @sleep;
        SET v_runtime = (UNIX_TIMESTAMP() - v_start);
    END WHILE;
    INSERT INTO tmp_events VALUES (v_min_event_id+1, '}');
    SET @query = CONCAT('SELECT event FROM tmp_events ORDER BY event_id INTO OUTFILE ''', in_outfile, ''' FIELDS ESCAPED BY '''' LINES TERMINATED BY ''''');
    PREPARE stmt_output FROM @query;
    EXECUTE stmt_output;
    DEALLOCATE PREPARE stmt_output;
    SELECT CONCAT('Stack trace written to ', in_outfile) AS 'Info';
    SELECT CONCAT('dot -Tpdf -o /tmp/stack_', in_thread_id, '.pdf ', in_outfile) AS 'Convert to PDF';
    SELECT CONCAT('dot -Tpng -o /tmp/stack_', in_thread_id, '.png ', in_outfile) AS 'Convert to PNG';
    DROP TEMPORARY TABLE tmp_events;
    -- Reset the settings for the performance schema
    IF (in_auto_setup) THEN
        CALL sys.ps_setup_reload_saved();
    END IF;
    -- Restore INSTRUMENTED for this thread
    IF (v_this_thread_enabed = 'YES') THEN
        CALL sys.ps_setup_enable_thread(CONNECTION_ID());
    END IF;
    SET sql_log_bin = @log_bin;
END//
DELIMITER ;

-- Dumping structure for procedure sys.ps_truncate_all_tables
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `ps_truncate_all_tables`(
        IN in_verbose BOOLEAN
    )
    MODIFIES SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTruncates all summary tables within Performance Schema, \nresetting all aggregated instrumentation as a snapshot.\n\nParameters\n-----------\n\nin_verbose (BOOLEAN):\n  Whether to print each TRUNCATE statement before running\n\nExample\n-----------\n\nmysql> CALL sys.ps_truncate_all_tables(false);\n+---------------------+\n| summary             |\n+---------------------+\n| Truncated 44 tables |\n+---------------------+\n1 row in set (0.10 sec)\n\nQuery OK, 0 rows affected (0.10 sec)\n'
BEGIN
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_total_tables INT DEFAULT 0;
    DECLARE v_ps_table VARCHAR(64);
    DECLARE ps_tables CURSOR FOR
        SELECT table_name 
          FROM INFORMATION_SCHEMA.TABLES 
         WHERE table_schema = 'performance_schema' 
           AND (table_name LIKE '%summary%' 
            OR table_name LIKE '%history%');
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    OPEN ps_tables;
    ps_tables_loop: LOOP
        FETCH ps_tables INTO v_ps_table;
        IF v_done THEN
          LEAVE ps_tables_loop;
        END IF;
        SET @truncate_stmt := CONCAT('TRUNCATE TABLE performance_schema.', v_ps_table);
        IF in_verbose THEN
            SELECT CONCAT('Running: ', @truncate_stmt) AS status;
        END IF;
        PREPARE truncate_stmt FROM @truncate_stmt;
        EXECUTE truncate_stmt;
        DEALLOCATE PREPARE truncate_stmt;
        SET v_total_tables = v_total_tables + 1;
    END LOOP;
    CLOSE ps_tables;
    SELECT CONCAT('Truncated ', v_total_tables, ' tables') AS summary;
END//
DELIMITER ;

-- Dumping structure for function sys.quote_identifier
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `quote_identifier`(in_identifier TEXT) RETURNS text CHARSET utf8mb4
    NO SQL
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTakes an unquoted identifier (schema name, table name, etc.) and\nreturns the identifier quoted with backticks.\n\nParameters\n-----------\n\nin_identifier (TEXT):\n  The identifier to quote.\n\nReturns\n-----------\n\nTEXT CHARSET UTF8MB4\n\nExample\n-----------\n\nmysql> SELECT sys.quote_identifier(''my_identifier'') AS Identifier;\n+-----------------+\n| Identifier      |\n+-----------------+\n| `my_identifier` |\n+-----------------+\n1 row in set (0.00 sec)\n\nmysql> SELECT sys.quote_identifier(''my`idenfier'') AS Identifier;\n+----------------+\n| Identifier     |\n+----------------+\n| `my``idenfier` |\n+----------------+\n1 row in set (0.00 sec)\n'
BEGIN
    RETURN CONCAT('`', REPLACE(in_identifier, '`', '``'), '`');
END//
DELIMITER ;

-- Dumping structure for view sys.schema_auto_increment_columns
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_auto_increment_columns` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`column_name` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`data_type` LONGTEXT NULL COLLATE 'utf8_bin',
	`column_type` MEDIUMTEXT NOT NULL COLLATE 'utf8_bin',
	`is_signed` INT(1) NOT NULL,
	`is_unsigned` INT(1) NOT NULL,
	`max_value` BIGINT(21) UNSIGNED NULL,
	`auto_increment` BIGINT(21) UNSIGNED NULL,
	`auto_increment_ratio` DECIMAL(25,4) UNSIGNED NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_index_statistics
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_index_statistics` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`index_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_selected` BIGINT(20) UNSIGNED NOT NULL,
	`select_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_inserted` BIGINT(20) UNSIGNED NOT NULL,
	`insert_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_updated` BIGINT(20) UNSIGNED NOT NULL,
	`update_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_deleted` BIGINT(20) UNSIGNED NOT NULL,
	`delete_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_object_overview
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_object_overview` (
	`db` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`object_type` VARCHAR(19) NULL COLLATE 'utf8_bin',
	`count` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_redundant_indexes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_redundant_indexes` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`redundant_index_name` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`redundant_index_columns` TEXT NULL COLLATE 'utf8_tolower_ci',
	`redundant_index_non_unique` INT(1) NULL,
	`dominant_index_name` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`dominant_index_columns` TEXT NULL COLLATE 'utf8_tolower_ci',
	`dominant_index_non_unique` INT(1) NULL,
	`subpart_exists` INT(1) NOT NULL,
	`sql_drop_index` VARCHAR(223) NULL COLLATE 'utf8_tolower_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_tables_with_full_table_scans
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_tables_with_full_table_scans` (
	`object_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`object_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_full_scanned` BIGINT(20) UNSIGNED NOT NULL,
	`latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_table_lock_waits
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_table_lock_waits` (
	`object_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`object_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`waiting_pid` BIGINT(20) UNSIGNED NULL,
	`waiting_account` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_lock_type` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_lock_duration` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_query_secs` BIGINT(20) NULL,
	`waiting_query_rows_affected` BIGINT(20) UNSIGNED NULL,
	`waiting_query_rows_examined` BIGINT(20) UNSIGNED NULL,
	`blocking_thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`blocking_pid` BIGINT(20) UNSIGNED NULL,
	`blocking_account` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_lock_type` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_lock_duration` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sql_kill_blocking_query` VARCHAR(31) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sql_kill_blocking_connection` VARCHAR(25) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_table_statistics
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_table_statistics` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_fetched` BIGINT(20) UNSIGNED NOT NULL,
	`fetch_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_inserted` BIGINT(20) UNSIGNED NOT NULL,
	`insert_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_updated` BIGINT(20) UNSIGNED NOT NULL,
	`update_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_deleted` BIGINT(20) UNSIGNED NOT NULL,
	`delete_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_read_requests` DECIMAL(42,0) NULL,
	`io_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_read_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_write_requests` DECIMAL(42,0) NULL,
	`io_write` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_write_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_misc_requests` DECIMAL(42,0) NULL,
	`io_misc_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_table_statistics_with_buffer
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_table_statistics_with_buffer` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_fetched` BIGINT(20) UNSIGNED NOT NULL,
	`fetch_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_inserted` BIGINT(20) UNSIGNED NOT NULL,
	`insert_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_updated` BIGINT(20) UNSIGNED NOT NULL,
	`update_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_deleted` BIGINT(20) UNSIGNED NOT NULL,
	`delete_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_read_requests` DECIMAL(42,0) NULL,
	`io_read` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_read_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_write_requests` DECIMAL(42,0) NULL,
	`io_write` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_write_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`io_misc_requests` DECIMAL(42,0) NULL,
	`io_misc_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`innodb_buffer_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`innodb_buffer_data` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`innodb_buffer_free` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`innodb_buffer_pages` BIGINT(21) NULL,
	`innodb_buffer_pages_hashed` BIGINT(21) NULL,
	`innodb_buffer_pages_old` BIGINT(21) NULL,
	`innodb_buffer_rows_cached` DECIMAL(44,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.schema_unused_indexes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `schema_unused_indexes` (
	`object_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`object_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`index_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.session
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `session` (
	`thd_id` BIGINT(20) UNSIGNED NOT NULL,
	`conn_id` BIGINT(20) UNSIGNED NULL,
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`command` VARCHAR(16) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`state` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`time` BIGINT(20) NULL,
	`current_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`statement_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`progress` DECIMAL(26,2) NULL,
	`lock_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_examined` BIGINT(20) UNSIGNED NULL,
	`rows_sent` BIGINT(20) UNSIGNED NULL,
	`rows_affected` BIGINT(20) UNSIGNED NULL,
	`tmp_tables` BIGINT(20) UNSIGNED NULL,
	`tmp_disk_tables` BIGINT(20) UNSIGNED NULL,
	`full_scan` VARCHAR(3) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_memory` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_wait` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_wait_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`source` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_state` ENUM('ACTIVE','COMMITTED','ROLLED BACK') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_autocommit` ENUM('YES','NO') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`pid` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin',
	`program_name` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin'
) ENGINE=MyISAM;

-- Dumping structure for view sys.session_ssl_status
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `session_ssl_status` (
	`thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`ssl_version` VARCHAR(1024) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`ssl_cipher` VARCHAR(1024) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`ssl_sessions_reused` VARCHAR(1024) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.statements_with_errors_or_warnings
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `statements_with_errors_or_warnings` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`errors` BIGINT(20) UNSIGNED NOT NULL,
	`error_pct` DECIMAL(27,4) NOT NULL,
	`warnings` BIGINT(20) UNSIGNED NOT NULL,
	`warning_pct` DECIMAL(27,4) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.statements_with_full_table_scans
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `statements_with_full_table_scans` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`no_index_used_count` BIGINT(20) UNSIGNED NOT NULL,
	`no_good_index_used_count` BIGINT(20) UNSIGNED NOT NULL,
	`no_index_used_pct` DECIMAL(24,0) NOT NULL,
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent_avg` DECIMAL(21,0) UNSIGNED NULL,
	`rows_examined_avg` DECIMAL(21,0) UNSIGNED NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.statements_with_runtimes_in_95th_percentile
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `statements_with_runtimes_in_95th_percentile` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`full_scan` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`err_count` BIGINT(20) UNSIGNED NOT NULL,
	`warn_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent_avg` DECIMAL(21,0) NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined_avg` DECIMAL(21,0) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.statements_with_sorting
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `statements_with_sorting` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sort_merge_passes` BIGINT(20) UNSIGNED NOT NULL,
	`avg_sort_merges` DECIMAL(21,0) NOT NULL,
	`sorts_using_scans` BIGINT(20) UNSIGNED NOT NULL,
	`sort_using_range` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sorted` BIGINT(20) UNSIGNED NOT NULL,
	`avg_rows_sorted` DECIMAL(21,0) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.statements_with_temp_tables
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `statements_with_temp_tables` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`memory_tmp_tables` BIGINT(20) UNSIGNED NOT NULL,
	`disk_tmp_tables` BIGINT(20) UNSIGNED NOT NULL,
	`avg_tmp_tables_per_query` DECIMAL(21,0) NOT NULL,
	`tmp_tables_to_disk_pct` DECIMAL(24,0) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.statement_analysis
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `statement_analysis` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`full_scan` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`err_count` BIGINT(20) UNSIGNED NOT NULL,
	`warn_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`lock_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent_avg` DECIMAL(21,0) NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined_avg` DECIMAL(21,0) NOT NULL,
	`rows_affected` BIGINT(20) UNSIGNED NOT NULL,
	`rows_affected_avg` DECIMAL(21,0) NOT NULL,
	`tmp_tables` BIGINT(20) UNSIGNED NOT NULL,
	`tmp_disk_tables` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sorted` BIGINT(20) UNSIGNED NOT NULL,
	`sort_merge_passes` BIGINT(20) UNSIGNED NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for procedure sys.statement_performance_analyzer
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `statement_performance_analyzer`(
        IN in_action ENUM('snapshot', 'overall', 'delta', 'create_table', 'create_tmp', 'save', 'cleanup'),
        IN in_table VARCHAR(129),
        IN in_views SET ('with_runtimes_in_95th_percentile', 'analysis', 'with_errors_or_warnings', 'with_full_table_scans', 'with_sorting', 'with_temp_tables', 'custom')
    )
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nCreate a report of the statements running on the server.\n\nThe views are calculated based on the overall and/or delta activity.\n\nRequires the SUPER privilege for "SET sql_log_bin = 0;".\n\nParameters\n-----------\n\nin_action (ENUM(''snapshot'', ''overall'', ''delta'', ''create_tmp'', ''create_table'', ''save'', ''cleanup'')):\n  The action to take. Supported actions are:\n    * snapshot      Store a snapshot. The default is to make a snapshot of the current content of\n                    performance_schema.events_statements_summary_by_digest, but by setting in_table\n                    this can be overwritten to copy the content of the specified table.\n                    The snapshot is stored in the sys.tmp_digests temporary table.\n    * overall       Generate analyzis based on the content specified by in_table. For the overall analyzis,\n                    in_table can be NOW() to use a fresh snapshot. This will overwrite an existing snapshot.\n                    Use NULL for in_table to use the existing snapshot. If in_table IS NULL and no snapshot\n                    exists, a new will be created.\n                    See also in_views and @sys.statement_performance_analyzer.limit.\n    * delta         Generate a delta analysis. The delta will be calculated between the reference table in\n                    in_table and the snapshot. An existing snapshot must exist.\n                    The action uses the sys.tmp_digests_delta temporary table.\n                    See also in_views and @sys.statement_performance_analyzer.limit.\n    * create_table  Create a regular table suitable for storing the snapshot for later use, e.g. for\n                    calculating deltas.\n    * create_tmp    Create a temporary table suitable for storing the snapshot for later use, e.g. for\n                    calculating deltas.\n    * save          Save the snapshot in the table specified by in_table. The table must exists and have\n                    the correct structure.\n                    If no snapshot exists, a new is created.\n    * cleanup       Remove the temporary tables used for the snapshot and delta.\n\nin_table (VARCHAR(129)):\n  The table argument used for some actions. Use the format ''db1.t1'' or ''t1'' without using any backticks (`)\n  for quoting. Periods (.) are not supported in the database and table names.\n\n  The meaning of the table for each action supporting the argument is:\n\n    * snapshot      The snapshot is created based on the specified table. Set to NULL or NOW() to use\n                    the current content of performance_schema.events_statements_summary_by_digest.\n    * overall       The table with the content to create the overall analyzis for. The following values\n                    can be used:\n                      - A table name - use the content of that table.\n                      - NOW()        - create a fresh snapshot and overwrite the existing snapshot.\n                      - NULL         - use the last stored snapshot.\n    * delta         The table name is mandatory and specified the reference view to compare the currently\n                    stored snapshot against. If no snapshot exists, a new will be created.\n    * create_table  The name of the regular table to create.\n    * create_tmp    The name of the temporary table to create.\n    * save          The name of the table to save the currently stored snapshot into.\n\nin_views (SET (''with_runtimes_in_95th_percentile'', ''analysis'', ''with_errors_or_warnings'',\n               ''with_full_table_scans'', ''with_sorting'', ''with_temp_tables'', ''custom''))\n  Which views to include:\n\n    * with_runtimes_in_95th_percentile  Based on the sys.statements_with_runtimes_in_95th_percentile view\n    * analysis                          Based on the sys.statement_analysis view\n    * with_errors_or_warnings           Based on the sys.statements_with_errors_or_warnings view\n    * with_full_table_scans             Based on the sys.statements_with_full_table_scans view\n    * with_sorting                      Based on the sys.statements_with_sorting view\n    * with_temp_tables                  Based on the sys.statements_with_temp_tables view\n    * custom                            Use a custom view. This view must be specified in @sys.statement_performance_analyzer.view to an existing view or a query\n\nDefault is to include all except ''custom''.\n\n\nConfiguration Options\n----------------------\n\nsys.statement_performance_analyzer.limit\n  The maximum number of rows to include for the views that does not have a built-in limit (e.g. the 95th percentile view).\n  If not set the limit is 100.\n\nsys.statement_performance_analyzer.view\n  Used together with the ''custom'' view. If the value contains a space, it is considered a query, otherwise it must be\n  an existing view querying the performance_schema.events_statements_summary_by_digest table. There cannot be any limit\n  clause including in the query or view definition if @sys.statement_performance_analyzer.limit > 0.\n  If specifying a view, use the same format as for in_table.\n\nsys.debug\n  Whether to provide debugging output.\n  Default is ''OFF''. Set to ''ON'' to include.\n\n\nExample\n--------\n\nTo create a report with the queries in the 95th percentile since last truncate of performance_schema.events_statements_summary_by_digest\nand the delta for a 1 minute period:\n\n   1. Create a temporary table to store the initial snapshot.\n   2. Create the initial snapshot.\n   3. Save the initial snapshot in the temporary table.\n   4. Wait one minute.\n   5. Create a new snapshot.\n   6. Perform analyzis based on the new snapshot.\n   7. Perform analyzis based on the delta between the initial and new snapshots.\n\nmysql> CALL sys.statement_performance_analyzer(''create_tmp'', ''mydb.tmp_digests_ini'', NULL);\nQuery OK, 0 rows affected (0.08 sec)\n\nmysql> CALL sys.statement_performance_analyzer(''snapshot'', NULL, NULL);\nQuery OK, 0 rows affected (0.02 sec)\n\nmysql> CALL sys.statement_performance_analyzer(''save'', ''mydb.tmp_digests_ini'', NULL);\nQuery OK, 0 rows affected (0.00 sec)\n\nmysql> DO SLEEP(60);\nQuery OK, 0 rows affected (1 min 0.00 sec)\n\nmysql> CALL sys.statement_performance_analyzer(''snapshot'', NULL, NULL);\nQuery OK, 0 rows affected (0.02 sec)\n\nmysql> CALL sys.statement_performance_analyzer(''overall'', NULL, ''with_runtimes_in_95th_percentile'');\n+-----------------------------------------+\n| Next Output                             |\n+-----------------------------------------+\n| Queries with Runtime in 95th Percentile |\n+-----------------------------------------+\n1 row in set (0.05 sec)\n\n...\n\nmysql> CALL sys.statement_performance_analyzer(''delta'', ''mydb.tmp_digests_ini'', ''with_runtimes_in_95th_percentile'');\n+-----------------------------------------+\n| Next Output                             |\n+-----------------------------------------+\n| Queries with Runtime in 95th Percentile |\n+-----------------------------------------+\n1 row in set (0.03 sec)\n\n...\n\n\nTo create an overall report of the 95th percentile queries and the top 10 queries with full table scans:\n\nmysql> CALL sys.statement_performance_analyzer(''snapshot'', NULL, NULL);\nQuery OK, 0 rows affected (0.01 sec)\n\nmysql> SET @sys.statement_performance_analyzer.limit = 10;\nQuery OK, 0 rows affected (0.00 sec)\n\nmysql> CALL sys.statement_performance_analyzer(''overall'', NULL, ''with_runtimes_in_95th_percentile,with_full_table_scans'');\n+-----------------------------------------+\n| Next Output                             |\n+-----------------------------------------+\n| Queries with Runtime in 95th Percentile |\n+-----------------------------------------+\n1 row in set (0.01 sec)\n\n...\n\n+-------------------------------------+\n| Next Output                         |\n+-------------------------------------+\n| Top 10 Queries with Full Table Scan |\n+-------------------------------------+\n1 row in set (0.09 sec)\n\n...\n\n\nUse a custom view showing the top 10 query sorted by total execution time refreshing the view every minute using\nthe watch command in Linux.\n\nmysql> CREATE OR REPLACE VIEW mydb.my_statements AS\n    -> SELECT sys.format_statement(DIGEST_TEXT) AS query,\n    ->        SCHEMA_NAME AS db,\n    ->        COUNT_STAR AS exec_count,\n    ->        sys.format_time(SUM_TIMER_WAIT) AS total_latency,\n    ->        sys.format_time(AVG_TIMER_WAIT) AS avg_latency,\n    ->        ROUND(IFNULL(SUM_ROWS_SENT / NULLIF(COUNT_STAR, 0), 0)) AS rows_sent_avg,\n    ->        ROUND(IFNULL(SUM_ROWS_EXAMINED / NULLIF(COUNT_STAR, 0), 0)) AS rows_examined_avg,\n    ->        ROUND(IFNULL(SUM_ROWS_AFFECTED / NULLIF(COUNT_STAR, 0), 0)) AS rows_affected_avg,\n    ->        DIGEST AS digest\n    ->   FROM performance_schema.events_statements_summary_by_digest\n    -> ORDER BY SUM_TIMER_WAIT DESC;\nQuery OK, 0 rows affected (0.01 sec)\n\nmysql> CALL sys.statement_performance_analyzer(''create_table'', ''mydb.digests_prev'', NULL);\nQuery OK, 0 rows affected (0.10 sec)\n\nshell$ watch -n 60 "mysql sys --table -e "\n> SET @sys.statement_performance_analyzer.view = ''mydb.my_statements'';\n> SET @sys.statement_performance_analyzer.limit = 10;\n> CALL statement_performance_analyzer(''snapshot'', NULL, NULL);\n> CALL statement_performance_analyzer(''delta'', ''mydb.digests_prev'', ''custom'');\n> CALL statement_performance_analyzer(''save'', ''mydb.digests_prev'', NULL);\n> ""\n\nEvery 60.0s: mysql sys --table -e "                                                                                                   ...  Mon Dec 22 10:58:51 2014\n\n+----------------------------------+\n| Next Output                      |\n+----------------------------------+\n| Top 10 Queries Using Custom View |\n+----------------------------------+\n+-------------------+-------+------------+---------------+-------------+---------------+-------------------+-------------------+----------------------------------+\n| query             | db    | exec_count | total_latency | avg_latency | rows_sent_avg | rows_examined_avg | rows_affected_avg | digest                           |\n+-------------------+-------+------------+---------------+-------------+---------------+-------------------+-------------------+----------------------------------+\n...\n'
BEGIN
    DECLARE v_table_exists, v_tmp_digests_table_exists, v_custom_view_exists ENUM('', 'BASE TABLE', 'VIEW', 'TEMPORARY') DEFAULT '';
    DECLARE v_this_thread_enabled ENUM('YES', 'NO');
    DECLARE v_force_new_snapshot BOOLEAN DEFAULT FALSE;
    DECLARE v_digests_table VARCHAR(133);
    DECLARE v_quoted_table, v_quoted_custom_view VARCHAR(133) DEFAULT '';
    DECLARE v_table_db, v_table_name, v_custom_db, v_custom_name VARCHAR(64);
    DECLARE v_digest_table_template, v_checksum_ref, v_checksum_table text;
    DECLARE v_sql longtext;
    -- Maximum supported length for MESSAGE_TEXT with the SIGNAL command is 128 chars.
    DECLARE v_error_msg VARCHAR(128);
    DECLARE v_old_group_concat_max_len INT UNSIGNED DEFAULT 0;
    -- Don't instrument this thread
    SELECT INSTRUMENTED INTO v_this_thread_enabled FROM performance_schema.threads WHERE PROCESSLIST_ID = CONNECTION_ID();
    IF (v_this_thread_enabled = 'YES') THEN
        CALL sys.ps_setup_disable_thread(CONNECTION_ID());
    END IF;
    -- Temporary table are used - disable sql_log_bin if necessary to prevent them replicating
    SET @log_bin := @@sql_log_bin;
    IF (@log_bin = 1) THEN
        SET sql_log_bin = 0;
    END IF;
    -- Set configuration options
    IF (@sys.statement_performance_analyzer.limit IS NULL) THEN
        SET @sys.statement_performance_analyzer.limit = sys.sys_get_config('statement_performance_analyzer.limit', '100');
    END IF;
    IF (@sys.debug IS NULL) THEN
        SET @sys.debug                                = sys.sys_get_config('debug'                               , 'OFF');
    END IF;
    -- If in_table is set, break in_table into a db and table component and check whether it exists
    -- in_table = NOW() is considered like it's not set.
    IF (in_table = 'NOW()') THEN
        SET v_force_new_snapshot = TRUE,
            in_table             = NULL;
    ELSEIF (in_table IS NOT NULL) THEN
        IF (NOT INSTR(in_table, '.')) THEN
            -- No . in the table name - use current database
            -- DATABASE() will be the database of the procedure
            SET v_table_db   = DATABASE(),
                v_table_name = in_table;
        ELSE
            SET v_table_db   = SUBSTRING_INDEX(in_table, '.', 1);
            SET v_table_name = SUBSTRING(in_table, CHAR_LENGTH(v_table_db)+2);
        END IF;
        SET v_quoted_table = CONCAT('`', v_table_db, '`.`', v_table_name, '`');
        IF (@sys.debug = 'ON') THEN
            SELECT CONCAT('in_table is: db = ''', v_table_db, ''', table = ''', v_table_name, '''') AS 'Debug';
        END IF;
        IF (v_table_db = DATABASE() AND (v_table_name = 'tmp_digests' OR v_table_name = 'tmp_digests_delta')) THEN
            SET v_error_msg = CONCAT('Invalid value for in_table: ', v_quoted_table, ' is reserved table name.');
            SIGNAL SQLSTATE '45000'
               SET MESSAGE_TEXT = v_error_msg;
        END IF;
        CALL sys.table_exists(v_table_db, v_table_name, v_table_exists);
        IF (@sys.debug = 'ON') THEN
            SELECT CONCAT('v_table_exists = ', v_table_exists) AS 'Debug';
        END IF;
        IF (v_table_exists = 'BASE TABLE') THEN
            SET v_old_group_concat_max_len = @@session.group_concat_max_len;
            SET @@session.group_concat_max_len = 2048;
            -- Verify that the table has the correct table definition
            -- This can only be done for base tables as temporary aren't in information_schema.COLUMNS.
            -- This also minimises the risk of using a production table.
            SET v_checksum_ref = (
                 SELECT GROUP_CONCAT(CONCAT(COLUMN_NAME, COLUMN_TYPE) ORDER BY ORDINAL_POSITION) AS Checksum
                   FROM information_schema.COLUMNS
                  WHERE TABLE_SCHEMA = 'performance_schema' AND TABLE_NAME = 'events_statements_summary_by_digest'
                ),
                v_checksum_table = (
                 SELECT GROUP_CONCAT(CONCAT(COLUMN_NAME, COLUMN_TYPE) ORDER BY ORDINAL_POSITION) AS Checksum
                   FROM information_schema.COLUMNS
                  WHERE TABLE_SCHEMA = v_table_db AND TABLE_NAME = v_table_name
                );
            SET @@session.group_concat_max_len = v_old_group_concat_max_len;
            IF (v_checksum_ref <> v_checksum_table) THEN
                -- The table does not have the correct definition, so abandon
                SET v_error_msg = CONCAT('The table ',
                                         IF(CHAR_LENGTH(v_quoted_table) > 93, CONCAT('...', SUBSTRING(v_quoted_table, -90)), v_quoted_table),
                                         ' has the wrong definition.');
                SIGNAL SQLSTATE '45000'
                   SET MESSAGE_TEXT = v_error_msg;
            END IF;
        END IF;
    END IF;
    IF (in_views IS NULL OR in_views = '') THEN
        -- Set to default
        SET in_views = 'with_runtimes_in_95th_percentile,analysis,with_errors_or_warnings,with_full_table_scans,with_sorting,with_temp_tables';
    END IF;
    -- Validate settings
    CALL sys.table_exists(DATABASE(), 'tmp_digests', v_tmp_digests_table_exists);
    IF (@sys.debug = 'ON') THEN
        SELECT CONCAT('v_tmp_digests_table_exists = ', v_tmp_digests_table_exists) AS 'Debug';
    END IF;
    CASE
        WHEN in_action IN ('snapshot', 'overall') THEN
            -- in_table must be NULL, NOW(), or an existing table
            IF (in_table IS NOT NULL) THEN
                IF (NOT v_table_exists IN ('TEMPORARY', 'BASE TABLE')) THEN
                    SET v_error_msg = CONCAT('The ', in_action, ' action requires in_table to be NULL, NOW() or specify an existing table.',
                                             ' The table ',
                                             IF(CHAR_LENGTH(v_quoted_table) > 16, CONCAT('...', SUBSTRING(v_quoted_table, -13)), v_quoted_table),
                                             ' does not exist.');
                    SIGNAL SQLSTATE '45000'
                       SET MESSAGE_TEXT = v_error_msg;
                END IF;
            END IF;
        WHEN in_action IN ('delta', 'save') THEN
            -- in_table must be an existing table
            IF (v_table_exists NOT IN ('TEMPORARY', 'BASE TABLE')) THEN
                SET v_error_msg = CONCAT('The ', in_action, ' action requires in_table to be an existing table.',
                                         IF(in_table IS NOT NULL, CONCAT(' The table ',
                                             IF(CHAR_LENGTH(v_quoted_table) > 39, CONCAT('...', SUBSTRING(v_quoted_table, -36)), v_quoted_table),
                                             ' does not exist.'), ''));
                SIGNAL SQLSTATE '45000'
                   SET MESSAGE_TEXT = v_error_msg;
            END IF;
            IF (in_action = 'delta' AND v_tmp_digests_table_exists <> 'TEMPORARY') THEN
                SIGNAL SQLSTATE '45000'
                   SET MESSAGE_TEXT = 'An existing snapshot generated with the statement_performance_analyzer() must exist.';
            END IF;
        WHEN in_action = 'create_tmp' THEN
            -- in_table must not exists as a temporary table
            IF (v_table_exists = 'TEMPORARY') THEN
                SET v_error_msg = CONCAT('Cannot create the table ',
                                         IF(CHAR_LENGTH(v_quoted_table) > 72, CONCAT('...', SUBSTRING(v_quoted_table, -69)), v_quoted_table),
                                         ' as it already exists.');
                SIGNAL SQLSTATE '45000'
                   SET MESSAGE_TEXT = v_error_msg;
            END IF;
        WHEN in_action = 'create_table' THEN
            -- in_table must not exists at all
            IF (v_table_exists <> '') THEN
                SET v_error_msg = CONCAT('Cannot create the table ',
                                         IF(CHAR_LENGTH(v_quoted_table) > 52, CONCAT('...', SUBSTRING(v_quoted_table, -49)), v_quoted_table),
                                         ' as it already exists',
                                         IF(v_table_exists = 'TEMPORARY', ' as a temporary table.', '.'));
                SIGNAL SQLSTATE '45000'
                   SET MESSAGE_TEXT = v_error_msg;
            END IF;
        WHEN in_action = 'cleanup' THEN
            -- doesn't use any of the arguments
            DO (SELECT 1);
        ELSE
            SIGNAL SQLSTATE '45000'
               SET MESSAGE_TEXT = 'Unknown action. Supported actions are: cleanup, create_table, create_tmp, delta, overall, save, snapshot';
    END CASE;
    SET v_digest_table_template = 'CREATE %{TEMPORARY}TABLE %{TABLE_NAME} (
  `SCHEMA_NAME` varchar(64) DEFAULT NULL,
  `DIGEST` varchar(64) DEFAULT NULL,
  `DIGEST_TEXT` longtext,
  `COUNT_STAR` bigint(20) unsigned NOT NULL,
  `SUM_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MIN_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `AVG_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `MAX_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  `SUM_LOCK_TIME` bigint(20) unsigned NOT NULL,
  `SUM_ERRORS` bigint(20) unsigned NOT NULL,
  `SUM_WARNINGS` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_AFFECTED` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_SENT` bigint(20) unsigned NOT NULL,
  `SUM_ROWS_EXAMINED` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_DISK_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_CREATED_TMP_TABLES` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_FULL_RANGE_JOIN` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_RANGE_CHECK` bigint(20) unsigned NOT NULL,
  `SUM_SELECT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_SORT_MERGE_PASSES` bigint(20) unsigned NOT NULL,
  `SUM_SORT_RANGE` bigint(20) unsigned NOT NULL,
  `SUM_SORT_ROWS` bigint(20) unsigned NOT NULL,
  `SUM_SORT_SCAN` bigint(20) unsigned NOT NULL,
  `SUM_NO_INDEX_USED` bigint(20) unsigned NOT NULL,
  `SUM_NO_GOOD_INDEX_USED` bigint(20) unsigned NOT NULL,
  `FIRST_SEEN` timestamp(6) NULL DEFAULT NULL,
  `LAST_SEEN` timestamp(6) NULL DEFAULT NULL,
  `QUANTILE_95` bigint(20) unsigned NOT NULL,
  `QUANTILE_99` bigint(20) unsigned NOT NULL,
  `QUANTILE_999` bigint(20) unsigned NOT NULL,
  `QUERY_SAMPLE_TEXT` longtext,
  `QUERY_SAMPLE_SEEN` timestamp(6) NULL DEFAULT NULL,
  `QUERY_SAMPLE_TIMER_WAIT` bigint(20) unsigned NOT NULL,
  INDEX (SCHEMA_NAME, DIGEST)
) DEFAULT CHARSET=utf8mb4';
    -- Do the action
    -- The actions snapshot, ... requires a fresh snapshot - create it now
    IF (v_force_new_snapshot
           OR in_action = 'snapshot'
           OR (in_action = 'overall' AND in_table IS NULL)
           OR (in_action = 'save' AND v_tmp_digests_table_exists <> 'TEMPORARY')
       ) THEN
        IF (v_tmp_digests_table_exists = 'TEMPORARY') THEN
            IF (@sys.debug = 'ON') THEN
                SELECT 'DROP TEMPORARY TABLE IF EXISTS tmp_digests' AS 'Debug';
            END IF;
            DROP TEMPORARY TABLE IF EXISTS tmp_digests;
        END IF;
        CALL sys.execute_prepared_stmt(REPLACE(REPLACE(v_digest_table_template, '%{TEMPORARY}', 'TEMPORARY '), '%{TABLE_NAME}', 'tmp_digests'));
        SET v_sql = CONCAT('INSERT INTO tmp_digests SELECT * FROM ',
                           IF(in_table IS NULL OR in_action = 'save', 'performance_schema.events_statements_summary_by_digest', v_quoted_table));
        CALL sys.execute_prepared_stmt(v_sql);
    END IF;
    -- Go through the remaining actions
    IF (in_action IN ('create_table', 'create_tmp')) THEN
        IF (in_action = 'create_table') THEN
            CALL sys.execute_prepared_stmt(REPLACE(REPLACE(v_digest_table_template, '%{TEMPORARY}', ''), '%{TABLE_NAME}', v_quoted_table));
        ELSE
            CALL sys.execute_prepared_stmt(REPLACE(REPLACE(v_digest_table_template, '%{TEMPORARY}', 'TEMPORARY '), '%{TABLE_NAME}', v_quoted_table));
        END IF;
    ELSEIF (in_action = 'save') THEN
        CALL sys.execute_prepared_stmt(CONCAT('DELETE FROM ', v_quoted_table));
        CALL sys.execute_prepared_stmt(CONCAT('INSERT INTO ', v_quoted_table, ' SELECT * FROM tmp_digests'));
    ELSEIF (in_action = 'cleanup') THEN
        DROP TEMPORARY TABLE IF EXISTS sys.tmp_digests;
        DROP TEMPORARY TABLE IF EXISTS sys.tmp_digests_delta;
    ELSEIF (in_action IN ('overall', 'delta')) THEN
        -- These are almost the same - for delta calculate the delta in tmp_digests_delta and use that instead of tmp_digests.
        -- And overall allows overriding the table to use.
        IF (in_action = 'overall') THEN
            IF (in_table IS NULL) THEN
                SET v_digests_table = 'tmp_digests';
            ELSE
                SET v_digests_table = v_quoted_table;
            END IF;
        ELSE
            SET v_digests_table = 'tmp_digests_delta';
            DROP TEMPORARY TABLE IF EXISTS tmp_digests_delta;
            CREATE TEMPORARY TABLE tmp_digests_delta LIKE tmp_digests;
            SET v_sql = CONCAT('INSERT INTO tmp_digests_delta
SELECT `d_end`.`SCHEMA_NAME`,
       `d_end`.`DIGEST`,
       `d_end`.`DIGEST_TEXT`,
       `d_end`.`COUNT_STAR`-IFNULL(`d_start`.`COUNT_STAR`, 0) AS ''COUNT_STAR'',
       `d_end`.`SUM_TIMER_WAIT`-IFNULL(`d_start`.`SUM_TIMER_WAIT`, 0) AS ''SUM_TIMER_WAIT'',
       `d_end`.`MIN_TIMER_WAIT` AS ''MIN_TIMER_WAIT'',
       IFNULL((`d_end`.`SUM_TIMER_WAIT`-IFNULL(`d_start`.`SUM_TIMER_WAIT`, 0))/NULLIF(`d_end`.`COUNT_STAR`-IFNULL(`d_start`.`COUNT_STAR`, 0), 0), 0) AS ''AVG_TIMER_WAIT'',
       `d_end`.`MAX_TIMER_WAIT` AS ''MAX_TIMER_WAIT'',
       `d_end`.`SUM_LOCK_TIME`-IFNULL(`d_start`.`SUM_LOCK_TIME`, 0) AS ''SUM_LOCK_TIME'',
       `d_end`.`SUM_ERRORS`-IFNULL(`d_start`.`SUM_ERRORS`, 0) AS ''SUM_ERRORS'',
       `d_end`.`SUM_WARNINGS`-IFNULL(`d_start`.`SUM_WARNINGS`, 0) AS ''SUM_WARNINGS'',
       `d_end`.`SUM_ROWS_AFFECTED`-IFNULL(`d_start`.`SUM_ROWS_AFFECTED`, 0) AS ''SUM_ROWS_AFFECTED'',
       `d_end`.`SUM_ROWS_SENT`-IFNULL(`d_start`.`SUM_ROWS_SENT`, 0) AS ''SUM_ROWS_SENT'',
       `d_end`.`SUM_ROWS_EXAMINED`-IFNULL(`d_start`.`SUM_ROWS_EXAMINED`, 0) AS ''SUM_ROWS_EXAMINED'',
       `d_end`.`SUM_CREATED_TMP_DISK_TABLES`-IFNULL(`d_start`.`SUM_CREATED_TMP_DISK_TABLES`, 0) AS ''SUM_CREATED_TMP_DISK_TABLES'',
       `d_end`.`SUM_CREATED_TMP_TABLES`-IFNULL(`d_start`.`SUM_CREATED_TMP_TABLES`, 0) AS ''SUM_CREATED_TMP_TABLES'',
       `d_end`.`SUM_SELECT_FULL_JOIN`-IFNULL(`d_start`.`SUM_SELECT_FULL_JOIN`, 0) AS ''SUM_SELECT_FULL_JOIN'',
       `d_end`.`SUM_SELECT_FULL_RANGE_JOIN`-IFNULL(`d_start`.`SUM_SELECT_FULL_RANGE_JOIN`, 0) AS ''SUM_SELECT_FULL_RANGE_JOIN'',
       `d_end`.`SUM_SELECT_RANGE`-IFNULL(`d_start`.`SUM_SELECT_RANGE`, 0) AS ''SUM_SELECT_RANGE'',
       `d_end`.`SUM_SELECT_RANGE_CHECK`-IFNULL(`d_start`.`SUM_SELECT_RANGE_CHECK`, 0) AS ''SUM_SELECT_RANGE_CHECK'',
       `d_end`.`SUM_SELECT_SCAN`-IFNULL(`d_start`.`SUM_SELECT_SCAN`, 0) AS ''SUM_SELECT_SCAN'',
       `d_end`.`SUM_SORT_MERGE_PASSES`-IFNULL(`d_start`.`SUM_SORT_MERGE_PASSES`, 0) AS ''SUM_SORT_MERGE_PASSES'',
       `d_end`.`SUM_SORT_RANGE`-IFNULL(`d_start`.`SUM_SORT_RANGE`, 0) AS ''SUM_SORT_RANGE'',
       `d_end`.`SUM_SORT_ROWS`-IFNULL(`d_start`.`SUM_SORT_ROWS`, 0) AS ''SUM_SORT_ROWS'',
       `d_end`.`SUM_SORT_SCAN`-IFNULL(`d_start`.`SUM_SORT_SCAN`, 0) AS ''SUM_SORT_SCAN'',
       `d_end`.`SUM_NO_INDEX_USED`-IFNULL(`d_start`.`SUM_NO_INDEX_USED`, 0) AS ''SUM_NO_INDEX_USED'',
       `d_end`.`SUM_NO_GOOD_INDEX_USED`-IFNULL(`d_start`.`SUM_NO_GOOD_INDEX_USED`, 0) AS ''SUM_NO_GOOD_INDEX_USED'',
       `d_end`.`FIRST_SEEN`,
       `d_end`.`LAST_SEEN`,
       `d_end`.`QUANTILE_95`,
       `d_end`.`QUANTILE_99`,
       `d_end`.`QUANTILE_999`,
       `d_end`.`QUERY_SAMPLE_TEXT`,
       `d_end`.`QUERY_SAMPLE_SEEN`,
       `d_end`.`QUERY_SAMPLE_TIMER_WAIT`
  FROM tmp_digests d_end
       LEFT OUTER JOIN ', v_quoted_table, ' d_start ON `d_start`.`DIGEST` = `d_end`.`DIGEST`
                                                    AND (`d_start`.`SCHEMA_NAME` = `d_end`.`SCHEMA_NAME`
                                                          OR (`d_start`.`SCHEMA_NAME` IS NULL AND `d_end`.`SCHEMA_NAME` IS NULL)
                                                        )
 WHERE `d_end`.`COUNT_STAR`-IFNULL(`d_start`.`COUNT_STAR`, 0) > 0');
            CALL sys.execute_prepared_stmt(v_sql);
        END IF;
        IF (FIND_IN_SET('with_runtimes_in_95th_percentile', in_views)) THEN
            SELECT 'Queries with Runtime in 95th Percentile' AS 'Next Output';
            DROP TEMPORARY TABLE IF EXISTS tmp_digest_avg_latency_distribution1;
            DROP TEMPORARY TABLE IF EXISTS tmp_digest_avg_latency_distribution2;
            DROP TEMPORARY TABLE IF EXISTS tmp_digest_95th_percentile_by_avg_us;
            CREATE TEMPORARY TABLE tmp_digest_avg_latency_distribution1 (
              cnt bigint unsigned NOT NULL,
              avg_us decimal(21,0) NOT NULL,
              PRIMARY KEY (avg_us)
            ) ENGINE=InnoDB;
            SET v_sql = CONCAT('INSERT INTO tmp_digest_avg_latency_distribution1
SELECT COUNT(*) cnt,
       ROUND(avg_timer_wait/1000000) AS avg_us
  FROM ', v_digests_table, '
 GROUP BY avg_us');
            CALL sys.execute_prepared_stmt(v_sql);
            CREATE TEMPORARY TABLE tmp_digest_avg_latency_distribution2 LIKE tmp_digest_avg_latency_distribution1;
            INSERT INTO tmp_digest_avg_latency_distribution2 SELECT * FROM tmp_digest_avg_latency_distribution1;
            CREATE TEMPORARY TABLE tmp_digest_95th_percentile_by_avg_us (
              avg_us decimal(21,0) NOT NULL,
              percentile decimal(46,4) NOT NULL,
              PRIMARY KEY (avg_us)
            ) ENGINE=InnoDB;
            SET v_sql = CONCAT('INSERT INTO tmp_digest_95th_percentile_by_avg_us
SELECT s2.avg_us avg_us,
       IFNULL(SUM(s1.cnt)/NULLIF((SELECT COUNT(*) FROM ', v_digests_table, '), 0), 0) percentile
  FROM tmp_digest_avg_latency_distribution1 AS s1
       JOIN tmp_digest_avg_latency_distribution2 AS s2 ON s1.avg_us <= s2.avg_us
 GROUP BY s2.avg_us
HAVING percentile > 0.95
 ORDER BY percentile
 LIMIT 1');
            CALL sys.execute_prepared_stmt(v_sql);
            SET v_sql =
                REPLACE(
                    REPLACE(
                        (SELECT VIEW_DEFINITION
                           FROM information_schema.VIEWS
                          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'statements_with_runtimes_in_95th_percentile'
                        ),
                        '`performance_schema`.`events_statements_summary_by_digest`',
                        v_digests_table
                    ),
                    'sys.x$ps_digest_95th_percentile_by_avg_us',
                    '`sys`.`x$ps_digest_95th_percentile_by_avg_us`'
              );
            CALL sys.execute_prepared_stmt(v_sql);
            DROP TEMPORARY TABLE tmp_digest_avg_latency_distribution1;
            DROP TEMPORARY TABLE tmp_digest_avg_latency_distribution2;
            DROP TEMPORARY TABLE tmp_digest_95th_percentile_by_avg_us;
        END IF;
        IF (FIND_IN_SET('analysis', in_views)) THEN
            SELECT CONCAT('Top ', @sys.statement_performance_analyzer.limit, ' Queries Ordered by Total Latency') AS 'Next Output';
            SET v_sql =
                REPLACE(
                    (SELECT VIEW_DEFINITION
                       FROM information_schema.VIEWS
                      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'statement_analysis'
                    ),
                    '`performance_schema`.`events_statements_summary_by_digest`',
                    v_digests_table
                );
            IF (@sys.statement_performance_analyzer.limit > 0) THEN
                SET v_sql = CONCAT(v_sql, ' LIMIT ', @sys.statement_performance_analyzer.limit);
            END IF;
            CALL sys.execute_prepared_stmt(v_sql);
        END IF;
        IF (FIND_IN_SET('with_errors_or_warnings', in_views)) THEN
            SELECT CONCAT('Top ', @sys.statement_performance_analyzer.limit, ' Queries with Errors') AS 'Next Output';
            SET v_sql =
                REPLACE(
                    (SELECT VIEW_DEFINITION
                       FROM information_schema.VIEWS
                      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'statements_with_errors_or_warnings'
                    ),
                    '`performance_schema`.`events_statements_summary_by_digest`',
                    v_digests_table
                );
            IF (@sys.statement_performance_analyzer.limit > 0) THEN
                SET v_sql = CONCAT(v_sql, ' LIMIT ', @sys.statement_performance_analyzer.limit);
            END IF;
            CALL sys.execute_prepared_stmt(v_sql);
        END IF;
        IF (FIND_IN_SET('with_full_table_scans', in_views)) THEN
            SELECT CONCAT('Top ', @sys.statement_performance_analyzer.limit, ' Queries with Full Table Scan') AS 'Next Output';
            SET v_sql =
                REPLACE(
                    (SELECT VIEW_DEFINITION
                       FROM information_schema.VIEWS
                      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'statements_with_full_table_scans'
                    ),
                    '`performance_schema`.`events_statements_summary_by_digest`',
                    v_digests_table
                );
            IF (@sys.statement_performance_analyzer.limit > 0) THEN
                SET v_sql = CONCAT(v_sql, ' LIMIT ', @sys.statement_performance_analyzer.limit);
            END IF;
            CALL sys.execute_prepared_stmt(v_sql);
        END IF;
        IF (FIND_IN_SET('with_sorting', in_views)) THEN
            SELECT CONCAT('Top ', @sys.statement_performance_analyzer.limit, ' Queries with Sorting') AS 'Next Output';
            SET v_sql =
                REPLACE(
                    (SELECT VIEW_DEFINITION
                       FROM information_schema.VIEWS
                      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'statements_with_sorting'
                    ),
                    '`performance_schema`.`events_statements_summary_by_digest`',
                    v_digests_table
                );
            IF (@sys.statement_performance_analyzer.limit > 0) THEN
                SET v_sql = CONCAT(v_sql, ' LIMIT ', @sys.statement_performance_analyzer.limit);
            END IF;
            CALL sys.execute_prepared_stmt(v_sql);
        END IF;
        IF (FIND_IN_SET('with_temp_tables', in_views)) THEN
            SELECT CONCAT('Top ', @sys.statement_performance_analyzer.limit, ' Queries with Internal Temporary Tables') AS 'Next Output';
            SET v_sql =
                REPLACE(
                    (SELECT VIEW_DEFINITION
                       FROM information_schema.VIEWS
                      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'statements_with_temp_tables'
                    ),
                    '`performance_schema`.`events_statements_summary_by_digest`',
                    v_digests_table
                );
            IF (@sys.statement_performance_analyzer.limit > 0) THEN
                SET v_sql = CONCAT(v_sql, ' LIMIT ', @sys.statement_performance_analyzer.limit);
            END IF;
            CALL sys.execute_prepared_stmt(v_sql);
        END IF;
        IF (FIND_IN_SET('custom', in_views)) THEN
            SELECT CONCAT('Top ', @sys.statement_performance_analyzer.limit, ' Queries Using Custom View') AS 'Next Output';
            IF (@sys.statement_performance_analyzer.view IS NULL) THEN
                SET @sys.statement_performance_analyzer.view = sys.sys_get_config('statement_performance_analyzer.view', NULL);
            END IF;
            IF (@sys.statement_performance_analyzer.view IS NULL) THEN
                SIGNAL SQLSTATE '45000'
                   SET MESSAGE_TEXT = 'The @sys.statement_performance_analyzer.view user variable must be set with the view or query to use.';
            END IF;
            IF (NOT INSTR(@sys.statement_performance_analyzer.view, ' ')) THEN
                -- No spaces, so can't be a query
                IF (NOT INSTR(@sys.statement_performance_analyzer.view, '.')) THEN
                    -- No . in the table name - use current database
                    -- DATABASE() will be the database of the procedure
                    SET v_custom_db   = DATABASE(),
                        v_custom_name = @sys.statement_performance_analyzer.view;
                ELSE
                    SET v_custom_db   = SUBSTRING_INDEX(@sys.statement_performance_analyzer.view, '.', 1);
                    SET v_custom_name = SUBSTRING(@sys.statement_performance_analyzer.view, CHAR_LENGTH(v_custom_db)+2);
                END IF;
                CALL sys.table_exists(v_custom_db, v_custom_name, v_custom_view_exists);
                IF (v_custom_view_exists <> 'VIEW') THEN
                    SIGNAL SQLSTATE '45000'
                       SET MESSAGE_TEXT = 'The @sys.statement_performance_analyzer.view user variable is set but specified neither an existing view nor a query.';
                END IF;
                SET v_sql =
                    REPLACE(
                        (SELECT VIEW_DEFINITION
                           FROM information_schema.VIEWS
                          WHERE TABLE_SCHEMA = v_custom_db AND TABLE_NAME = v_custom_name
                        ),
                        '`performance_schema`.`events_statements_summary_by_digest`',
                        v_digests_table
                    );
            ELSE
                SET v_sql = REPLACE(@sys.statement_performance_analyzer.view, '`performance_schema`.`events_statements_summary_by_digest`', v_digests_table);
            END IF;
            IF (@sys.statement_performance_analyzer.limit > 0) THEN
                SET v_sql = CONCAT(v_sql, ' LIMIT ', @sys.statement_performance_analyzer.limit);
            END IF;
            CALL sys.execute_prepared_stmt(v_sql);
        END IF;
    END IF;
    -- Restore INSTRUMENTED for this thread
    IF (v_this_thread_enabled = 'YES') THEN
        CALL sys.ps_setup_enable_thread(CONNECTION_ID());
    END IF;
    IF (@log_bin = 1) THEN
        SET sql_log_bin = @log_bin;
    END IF;
END//
DELIMITER ;

-- Dumping structure for table sys.sys_config
CREATE TABLE IF NOT EXISTS `sys_config` (
  `variable` varchar(128) NOT NULL,
  `value` varchar(128) DEFAULT NULL,
  `set_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `set_by` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`variable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for function sys.sys_get_config
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `sys_get_config`(
        in_variable_name VARCHAR(128),
        in_default_value VARCHAR(128)
    ) RETURNS varchar(128) CHARSET utf8mb4
    READS SQL DATA
    DETERMINISTIC
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturns the value for the requested variable using the following logic:\n\n   1. If the option exists in sys.sys_config return the value from there.\n   2. Else fall back on the provided default value.\n\nNotes for using sys_get_config():\n\n   * If the default value argument to sys_get_config() is NULL and case 2. is reached, NULL is returned.\n     It is then expected that the caller is able to handle NULL for the given configuration option.\n   * The convention is to name the user variables @sys.<name of variable>. It is <name of variable> that\n     is stored in the sys_config table and is what is expected as the argument to sys_get_config().\n   * If you want to check whether the configuration option has already been set and if not assign with\n     the return value of sys_get_config() you can use IFNULL(...) (see example below). However this should\n     not be done inside a loop (e.g. for each row in a result set) as for repeated calls where assignment\n     is only needed in the first iteration using IFNULL(...) is expected to be significantly slower than\n     using an IF (...) THEN ... END IF; block (see example below).\n\nParameters\n-----------\n\nin_variable_name (VARCHAR(128)):\n  The name of the config option to return the value for.\n\nin_default_value (VARCHAR(128)):\n  The default value to return if the variable does not exist in sys.sys_config.\n\nReturns\n-----------\n\nVARCHAR(128)\n\nExample\n-----------\n\n-- Get the configuration value from sys.sys_config falling back on 128 if the option is not present in the table.\nmysql> SELECT sys.sys_get_config(''statement_truncate_len'', 128) AS Value;\n+-------+\n| Value |\n+-------+\n| 64    |\n+-------+\n1 row in set (0.00 sec)\n\n-- Check whether the option is already set, if not assign - IFNULL(...) one liner example.\nmysql> SET @sys.statement_truncate_len = IFNULL(@sys.statement_truncate_len, sys.sys_get_config(''statement_truncate_len'', 64));\nQuery OK, 0 rows affected (0.00 sec)\n\n-- Check whether the option is already set, if not assign - IF ... THEN ... END IF example.\nIF (@sys.statement_truncate_len IS NULL) THEN\n    SET @sys.statement_truncate_len = sys.sys_get_config(''statement_truncate_len'', 64);\nEND IF;\n'
BEGIN
    DECLARE v_value VARCHAR(128) DEFAULT NULL;
    -- Check if we have the variable in the sys.sys_config table
    SET v_value = (SELECT value FROM sys.sys_config WHERE variable = in_variable_name);
    -- Protection against the variable not existing in sys_config
    IF (v_value IS NULL) THEN
        SET v_value = in_default_value;
    END IF;
    RETURN v_value;
END//
DELIMITER ;

-- Dumping structure for procedure sys.table_exists
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` PROCEDURE `table_exists`(
        IN in_db VARCHAR(64), IN in_table VARCHAR(64),
        OUT out_exists ENUM('', 'BASE TABLE', 'VIEW', 'TEMPORARY')
    )
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nTests whether the table specified in in_db and in_table exists either as a regular\ntable, or as a temporary table. The returned value corresponds to the table that\nwill be used, so if there''s both a temporary and a permanent table with the given\nname, then ''TEMPORARY'' will be returned.\n\nParameters\n-----------\n\nin_db (VARCHAR(64)):\n  The database name to check for the existance of the table in.\n\nin_table (VARCHAR(64)):\n  The name of the table to check the existance of.\n\nout_exists ENUM('''', ''BASE TABLE'', ''VIEW'', ''TEMPORARY''):\n  The return value: whether the table exists. The value is one of:\n    * ''''           - the table does not exist neither as a base table, view, nor temporary table.\n    * ''BASE TABLE'' - the table name exists as a permanent base table table.\n    * ''VIEW''       - the table name exists as a view.\n    * ''TEMPORARY''  - the table name exists as a temporary table.\n\nExample\n--------\n\nmysql> CREATE DATABASE db1;\nQuery OK, 1 row affected (0.07 sec)\n\nmysql> use db1;\nDatabase changed\nmysql> CREATE TABLE t1 (id INT PRIMARY KEY);\nQuery OK, 0 rows affected (0.08 sec)\n\nmysql> CREATE TABLE t2 (id INT PRIMARY KEY);\nQuery OK, 0 rows affected (0.08 sec)\n\nmysql> CREATE view v_t1 AS SELECT * FROM t1;\nQuery OK, 0 rows affected (0.00 sec)\n\nmysql> CREATE TEMPORARY TABLE t1 (id INT PRIMARY KEY);\nQuery OK, 0 rows affected (0.00 sec)\n\nmysql> CALL sys.table_exists(''db1'', ''t1'', @exists); SELECT @exists;\nQuery OK, 0 rows affected (0.00 sec)\n\n+------------+\n| @exists    |\n+------------+\n| TEMPORARY  |\n+------------+\n1 row in set (0.00 sec)\n\nmysql> CALL sys.table_exists(''db1'', ''t2'', @exists); SELECT @exists;\nQuery OK, 0 rows affected (0.00 sec)\n\n+------------+\n| @exists    |\n+------------+\n| BASE TABLE |\n+------------+\n1 row in set (0.01 sec)\n\nmysql> CALL sys.table_exists(''db1'', ''v_t1'', @exists); SELECT @exists;\nQuery OK, 0 rows affected (0.00 sec)\n\n+---------+\n| @exists |\n+---------+\n| VIEW    |\n+---------+\n1 row in set (0.00 sec)\n\nmysql> CALL sys.table_exists(''db1'', ''t3'', @exists); SELECT @exists;\nQuery OK, 0 rows affected (0.01 sec)\n\n+---------+\n| @exists |\n+---------+\n|         |\n+---------+\n1 row in set (0.00 sec)\n'
BEGIN
    DECLARE v_error BOOLEAN DEFAULT FALSE;
    DECLARE CONTINUE HANDLER FOR 1050 SET v_error = TRUE;
    DECLARE CONTINUE HANDLER FOR 1146 SET v_error = TRUE;
    SET out_exists = '';
    -- Verify whether the table name exists as a normal table
    IF (EXISTS(SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = in_db AND TABLE_NAME = in_table)) THEN
        -- Unfortunately the only way to determine whether there is also a temporary table is to try to create
        -- a temporary table with the same name. If it succeeds the table didn't exist as a temporary table.
        SET @sys.tmp.table_exists.SQL = CONCAT('CREATE TEMPORARY TABLE `', in_db, '`.`', in_table, '` (id INT PRIMARY KEY)');
        PREPARE stmt_create_table FROM @sys.tmp.table_exists.SQL;
        EXECUTE stmt_create_table;
        DEALLOCATE PREPARE stmt_create_table;
        IF (v_error) THEN
            SET out_exists = 'TEMPORARY';
        ELSE
            -- The temporary table was created, i.e. it didn't exist. Remove it again so we don't leave garbage around.
            SET @sys.tmp.table_exists.SQL = CONCAT('DROP TEMPORARY TABLE `', in_db, '`.`', in_table, '`');
            PREPARE stmt_drop_table FROM @sys.tmp.table_exists.SQL;
            EXECUTE stmt_drop_table;
            DEALLOCATE PREPARE stmt_drop_table;
            SET out_exists = (SELECT TABLE_TYPE FROM information_schema.TABLES WHERE TABLE_SCHEMA = in_db AND TABLE_NAME = in_table);
        END IF;
    ELSE
        -- Check whether a temporary table exists with the same name.
        -- If it does it's possible to SELECT from the table without causing an error.
        -- If it does not exist even a PREPARE using the table will fail.
        SET @sys.tmp.table_exists.SQL = CONCAT('SELECT COUNT(*) FROM `', in_db, '`.`', in_table, '`');
        PREPARE stmt_select FROM @sys.tmp.table_exists.SQL;
        IF (NOT v_error) THEN
            DEALLOCATE PREPARE stmt_select;
            SET out_exists = 'TEMPORARY';
        END IF;
    END IF;
END//
DELIMITER ;

-- Dumping structure for view sys.user_summary
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `user_summary` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`statements` DECIMAL(64,0) NULL,
	`statement_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`statement_avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_scans` DECIMAL(65,0) NULL,
	`file_ios` DECIMAL(64,0) NULL,
	`file_io_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_connections` DECIMAL(41,0) NULL,
	`total_connections` DECIMAL(41,0) NULL,
	`unique_hosts` BIGINT(21) NOT NULL,
	`current_memory` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_memory_allocated` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.user_summary_by_file_io
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `user_summary_by_file_io` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`ios` DECIMAL(42,0) NULL,
	`io_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.user_summary_by_file_io_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `user_summary_by_file_io_type` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.user_summary_by_stages
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `user_summary_by_stages` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.user_summary_by_statement_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `user_summary_by_statement_latency` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`total` DECIMAL(42,0) NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`lock_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_sent` DECIMAL(42,0) NULL,
	`rows_examined` DECIMAL(42,0) NULL,
	`rows_affected` DECIMAL(42,0) NULL,
	`full_scans` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.user_summary_by_statement_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `user_summary_by_statement_type` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`statement` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`lock_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_affected` BIGINT(20) UNSIGNED NOT NULL,
	`full_scans` BIGINT(21) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.version
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `version` (
	`sys_version` VARCHAR(5) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`mysql_version` VARCHAR(6) NOT NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Dumping structure for function sys.version_major
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `version_major`() RETURNS tinyint(3) unsigned
    NO SQL
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturns the major version of MySQL Server.\n\nReturns\n-----------\n\nTINYINT UNSIGNED\n\nExample\n-----------\n\nmysql> SELECT VERSION(), sys.version_major();\n+--------------------------------------+---------------------+\n| VERSION()                            | sys.version_major() |\n+--------------------------------------+---------------------+\n| 5.7.9-enterprise-commercial-advanced | 5                   |\n+--------------------------------------+---------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    RETURN SUBSTRING_INDEX(SUBSTRING_INDEX(VERSION(), '-', 1), '.', 1);
END//
DELIMITER ;

-- Dumping structure for function sys.version_minor
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `version_minor`() RETURNS tinyint(3) unsigned
    NO SQL
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturns the minor (release series) version of MySQL Server.\n\nReturns\n-----------\n\nTINYINT UNSIGNED\n\nExample\n-----------\n\nmysql> SELECT VERSION(), sys.server_minor();\n+--------------------------------------+---------------------+\n| VERSION()                            | sys.version_minor() |\n+--------------------------------------+---------------------+\n| 5.7.9-enterprise-commercial-advanced | 7                   |\n+--------------------------------------+---------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    RETURN SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(VERSION(), '-', 1), '.', 2), '.', -1);
END//
DELIMITER ;

-- Dumping structure for function sys.version_patch
DELIMITER //
CREATE DEFINER=`mysql.sys`@`localhost` FUNCTION `version_patch`() RETURNS tinyint(3) unsigned
    NO SQL
    SQL SECURITY INVOKER
    COMMENT '\nDescription\n-----------\n\nReturns the patch release version of MySQL Server.\n\nReturns\n-----------\n\nTINYINT UNSIGNED\n\nExample\n-----------\n\nmysql> SELECT VERSION(), sys.version_patch();\n+--------------------------------------+---------------------+\n| VERSION()                            | sys.version_patch() |\n+--------------------------------------+---------------------+\n| 5.7.9-enterprise-commercial-advanced | 9                   |\n+--------------------------------------+---------------------+\n1 row in set (0.00 sec)\n'
BEGIN
    RETURN SUBSTRING_INDEX(SUBSTRING_INDEX(VERSION(), '-', 1), '.', -1);
END//
DELIMITER ;

-- Dumping structure for view sys.waits_by_host_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `waits_by_host_by_latency` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`event` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.waits_by_user_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `waits_by_user_by_latency` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`event` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.waits_global_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `waits_global_by_latency` (
	`events` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.wait_classes_global_by_avg_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `wait_classes_global_by_avg_latency` (
	`event_class` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`min_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.wait_classes_global_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `wait_classes_global_by_latency` (
	`event_class` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`min_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`avg_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`max_latency` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$host_summary
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$host_summary` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`statements` DECIMAL(64,0) NULL,
	`statement_latency` DECIMAL(64,0) NULL,
	`statement_avg_latency` DECIMAL(65,4) NULL,
	`table_scans` DECIMAL(65,0) NULL,
	`file_ios` DECIMAL(64,0) NULL,
	`file_io_latency` DECIMAL(64,0) NULL,
	`current_connections` DECIMAL(41,0) NULL,
	`total_connections` DECIMAL(41,0) NULL,
	`unique_users` BIGINT(21) NOT NULL,
	`current_memory` DECIMAL(63,0) NULL,
	`total_memory_allocated` DECIMAL(64,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$host_summary_by_file_io
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$host_summary_by_file_io` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`ios` DECIMAL(42,0) NULL,
	`io_latency` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$host_summary_by_file_io_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$host_summary_by_file_io_type` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$host_summary_by_stages
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$host_summary_by_stages` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$host_summary_by_statement_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$host_summary_by_statement_latency` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` DECIMAL(42,0) NULL,
	`max_latency` BIGINT(20) UNSIGNED NULL,
	`lock_latency` DECIMAL(42,0) NULL,
	`rows_sent` DECIMAL(42,0) NULL,
	`rows_examined` DECIMAL(42,0) NULL,
	`rows_affected` DECIMAL(42,0) NULL,
	`full_scans` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$host_summary_by_statement_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$host_summary_by_statement_type` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`statement` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL,
	`lock_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_affected` BIGINT(20) UNSIGNED NOT NULL,
	`full_scans` BIGINT(21) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$innodb_buffer_stats_by_schema
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$innodb_buffer_stats_by_schema` (
	`object_schema` TEXT NULL COLLATE 'utf8_general_ci',
	`allocated` DECIMAL(43,0) NULL,
	`data` DECIMAL(43,0) NULL,
	`pages` BIGINT(21) NOT NULL,
	`pages_hashed` BIGINT(21) NOT NULL,
	`pages_old` BIGINT(21) NOT NULL,
	`rows_cached` DECIMAL(44,0) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$innodb_buffer_stats_by_table
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$innodb_buffer_stats_by_table` (
	`object_schema` TEXT NULL COLLATE 'utf8_general_ci',
	`object_name` TEXT NULL COLLATE 'utf8_general_ci',
	`allocated` DECIMAL(43,0) NULL,
	`data` DECIMAL(43,0) NULL,
	`pages` BIGINT(21) NOT NULL,
	`pages_hashed` BIGINT(21) NOT NULL,
	`pages_old` BIGINT(21) NOT NULL,
	`rows_cached` DECIMAL(44,0) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$innodb_lock_waits
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$innodb_lock_waits` (
	`wait_started` DATETIME NULL,
	`wait_age` TIME NULL,
	`wait_age_secs` BIGINT(21) NULL,
	`locked_table` MEDIUMTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_partition` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_table_subpartition` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_index` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`locked_type` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_trx_id` VARCHAR(18) NOT NULL COLLATE 'utf8_general_ci',
	`waiting_trx_started` DATETIME NOT NULL,
	`waiting_trx_age` TIME NULL,
	`waiting_trx_rows_locked` BIGINT(21) UNSIGNED NOT NULL,
	`waiting_trx_rows_modified` BIGINT(21) UNSIGNED NOT NULL,
	`waiting_pid` BIGINT(21) UNSIGNED NOT NULL,
	`waiting_query` VARCHAR(1024) NULL COLLATE 'utf8_general_ci',
	`waiting_lock_id` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_lock_mode` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_trx_id` VARCHAR(18) NOT NULL COLLATE 'utf8_general_ci',
	`blocking_pid` BIGINT(21) UNSIGNED NOT NULL,
	`blocking_query` VARCHAR(1024) NULL COLLATE 'utf8_general_ci',
	`blocking_lock_id` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_lock_mode` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_trx_started` DATETIME NOT NULL,
	`blocking_trx_age` TIME NULL,
	`blocking_trx_rows_locked` BIGINT(21) UNSIGNED NOT NULL,
	`blocking_trx_rows_modified` BIGINT(21) UNSIGNED NOT NULL,
	`sql_kill_blocking_query` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sql_kill_blocking_connection` VARCHAR(26) NOT NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$io_by_thread_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$io_by_thread_by_latency` (
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` DECIMAL(42,0) NULL,
	`min_latency` BIGINT(20) UNSIGNED NULL,
	`avg_latency` DECIMAL(24,4) NULL,
	`max_latency` BIGINT(20) UNSIGNED NULL,
	`thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`processlist_id` BIGINT(20) UNSIGNED NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$io_global_by_file_by_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$io_global_by_file_by_bytes` (
	`file` VARCHAR(512) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`total_read` BIGINT(20) NOT NULL,
	`avg_read` DECIMAL(23,4) NOT NULL,
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`total_written` BIGINT(20) NOT NULL,
	`avg_write` DECIMAL(23,4) NOT NULL,
	`total` BIGINT(21) NOT NULL,
	`write_pct` DECIMAL(26,2) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$io_global_by_file_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$io_global_by_file_by_latency` (
	`file` VARCHAR(512) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`read_latency` BIGINT(20) UNSIGNED NOT NULL,
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`write_latency` BIGINT(20) UNSIGNED NOT NULL,
	`count_misc` BIGINT(20) UNSIGNED NOT NULL,
	`misc_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$io_global_by_wait_by_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$io_global_by_wait_by_bytes` (
	`event_name` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`min_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL,
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`total_read` BIGINT(20) NOT NULL,
	`avg_read` DECIMAL(23,4) NOT NULL,
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`total_written` BIGINT(20) NOT NULL,
	`avg_written` DECIMAL(23,4) NOT NULL,
	`total_requested` BIGINT(21) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$io_global_by_wait_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$io_global_by_wait_by_latency` (
	`event_name` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL,
	`read_latency` BIGINT(20) UNSIGNED NOT NULL,
	`write_latency` BIGINT(20) UNSIGNED NOT NULL,
	`misc_latency` BIGINT(20) UNSIGNED NOT NULL,
	`count_read` BIGINT(20) UNSIGNED NOT NULL,
	`total_read` BIGINT(20) NOT NULL,
	`avg_read` DECIMAL(23,4) NOT NULL,
	`count_write` BIGINT(20) UNSIGNED NOT NULL,
	`total_written` BIGINT(20) NOT NULL,
	`avg_written` DECIMAL(23,4) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$latest_file_io
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$latest_file_io` (
	`thread` VARCHAR(316) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`file` VARCHAR(512) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`latency` BIGINT(20) UNSIGNED NULL,
	`operation` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`requested` BIGINT(20) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$memory_by_host_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$memory_by_host_by_current_bytes` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`current_count_used` DECIMAL(41,0) NULL,
	`current_allocated` DECIMAL(41,0) NULL,
	`current_avg_alloc` DECIMAL(45,4) NOT NULL,
	`current_max_alloc` BIGINT(20) NULL,
	`total_allocated` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$memory_by_thread_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$memory_by_thread_by_current_bytes` (
	`thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_count_used` DECIMAL(41,0) NULL,
	`current_allocated` DECIMAL(41,0) NULL,
	`current_avg_alloc` DECIMAL(45,4) NOT NULL,
	`current_max_alloc` BIGINT(20) NULL,
	`total_allocated` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$memory_by_user_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$memory_by_user_by_current_bytes` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`current_count_used` DECIMAL(41,0) NULL,
	`current_allocated` DECIMAL(41,0) NULL,
	`current_avg_alloc` DECIMAL(45,4) NOT NULL,
	`current_max_alloc` BIGINT(20) NULL,
	`total_allocated` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$memory_global_by_current_bytes
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$memory_global_by_current_bytes` (
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`current_count` BIGINT(20) NOT NULL,
	`current_alloc` BIGINT(20) NOT NULL,
	`current_avg_alloc` DECIMAL(23,4) NOT NULL,
	`high_count` BIGINT(20) NOT NULL,
	`high_alloc` BIGINT(20) NOT NULL,
	`high_avg_alloc` DECIMAL(23,4) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$memory_global_total
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$memory_global_total` (
	`total_allocated` DECIMAL(41,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$processlist
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$processlist` (
	`thd_id` BIGINT(20) UNSIGNED NOT NULL,
	`conn_id` BIGINT(20) UNSIGNED NULL,
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`command` VARCHAR(16) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`state` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`time` BIGINT(20) NULL,
	`current_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`statement_latency` BIGINT(20) UNSIGNED NULL,
	`progress` DECIMAL(26,2) NULL,
	`lock_latency` BIGINT(20) UNSIGNED NULL,
	`rows_examined` BIGINT(20) UNSIGNED NULL,
	`rows_sent` BIGINT(20) UNSIGNED NULL,
	`rows_affected` BIGINT(20) UNSIGNED NULL,
	`tmp_tables` BIGINT(20) UNSIGNED NULL,
	`tmp_disk_tables` BIGINT(20) UNSIGNED NULL,
	`full_scan` VARCHAR(3) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement_latency` BIGINT(20) UNSIGNED NULL,
	`current_memory` DECIMAL(41,0) NULL,
	`last_wait` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_wait_latency` VARCHAR(20) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`source` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_latency` BIGINT(20) UNSIGNED NULL,
	`trx_state` ENUM('ACTIVE','COMMITTED','ROLLED BACK') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_autocommit` ENUM('YES','NO') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`pid` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin',
	`program_name` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$ps_digest_95th_percentile_by_avg_us
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$ps_digest_95th_percentile_by_avg_us` (
	`avg_us` DECIMAL(21,0) NULL,
	`percentile` DECIMAL(46,4) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$ps_digest_avg_latency_distribution
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$ps_digest_avg_latency_distribution` (
	`cnt` BIGINT(21) NOT NULL,
	`avg_us` DECIMAL(21,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$ps_schema_table_statistics_io
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$ps_schema_table_statistics_io` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`count_read` DECIMAL(42,0) NULL,
	`sum_number_of_bytes_read` DECIMAL(41,0) NULL,
	`sum_timer_read` DECIMAL(42,0) NULL,
	`count_write` DECIMAL(42,0) NULL,
	`sum_number_of_bytes_write` DECIMAL(41,0) NULL,
	`sum_timer_write` DECIMAL(42,0) NULL,
	`count_misc` DECIMAL(42,0) NULL,
	`sum_timer_misc` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$schema_flattened_keys
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$schema_flattened_keys` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`index_name` VARCHAR(64) NULL COLLATE 'utf8_tolower_ci',
	`non_unique` INT(1) NULL,
	`subpart_exists` BIGINT(1) NULL,
	`index_columns` TEXT NULL COLLATE 'utf8_tolower_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$schema_index_statistics
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$schema_index_statistics` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`index_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_selected` BIGINT(20) UNSIGNED NOT NULL,
	`select_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_inserted` BIGINT(20) UNSIGNED NOT NULL,
	`insert_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_updated` BIGINT(20) UNSIGNED NOT NULL,
	`update_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_deleted` BIGINT(20) UNSIGNED NOT NULL,
	`delete_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$schema_tables_with_full_table_scans
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$schema_tables_with_full_table_scans` (
	`object_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`object_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_full_scanned` BIGINT(20) UNSIGNED NOT NULL,
	`latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$schema_table_lock_waits
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$schema_table_lock_waits` (
	`object_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`object_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`waiting_pid` BIGINT(20) UNSIGNED NULL,
	`waiting_account` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_lock_type` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_lock_duration` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`waiting_query_secs` BIGINT(20) NULL,
	`waiting_query_rows_affected` BIGINT(20) UNSIGNED NULL,
	`waiting_query_rows_examined` BIGINT(20) UNSIGNED NULL,
	`blocking_thread_id` BIGINT(20) UNSIGNED NOT NULL,
	`blocking_pid` BIGINT(20) UNSIGNED NULL,
	`blocking_account` TEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_lock_type` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`blocking_lock_duration` VARCHAR(32) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sql_kill_blocking_query` VARCHAR(31) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`sql_kill_blocking_connection` VARCHAR(25) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$schema_table_statistics
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$schema_table_statistics` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_fetched` BIGINT(20) UNSIGNED NOT NULL,
	`fetch_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_inserted` BIGINT(20) UNSIGNED NOT NULL,
	`insert_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_updated` BIGINT(20) UNSIGNED NOT NULL,
	`update_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_deleted` BIGINT(20) UNSIGNED NOT NULL,
	`delete_latency` BIGINT(20) UNSIGNED NOT NULL,
	`io_read_requests` DECIMAL(42,0) NULL,
	`io_read` DECIMAL(41,0) NULL,
	`io_read_latency` DECIMAL(42,0) NULL,
	`io_write_requests` DECIMAL(42,0) NULL,
	`io_write` DECIMAL(41,0) NULL,
	`io_write_latency` DECIMAL(42,0) NULL,
	`io_misc_requests` DECIMAL(42,0) NULL,
	`io_misc_latency` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$schema_table_statistics_with_buffer
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$schema_table_statistics_with_buffer` (
	`table_schema` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`table_name` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`rows_fetched` BIGINT(20) UNSIGNED NOT NULL,
	`fetch_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_inserted` BIGINT(20) UNSIGNED NOT NULL,
	`insert_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_updated` BIGINT(20) UNSIGNED NOT NULL,
	`update_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_deleted` BIGINT(20) UNSIGNED NOT NULL,
	`delete_latency` BIGINT(20) UNSIGNED NOT NULL,
	`io_read_requests` DECIMAL(42,0) NULL,
	`io_read` DECIMAL(41,0) NULL,
	`io_read_latency` DECIMAL(42,0) NULL,
	`io_write_requests` DECIMAL(42,0) NULL,
	`io_write` DECIMAL(41,0) NULL,
	`io_write_latency` DECIMAL(42,0) NULL,
	`io_misc_requests` DECIMAL(42,0) NULL,
	`io_misc_latency` DECIMAL(42,0) NULL,
	`innodb_buffer_allocated` DECIMAL(43,0) NULL,
	`innodb_buffer_data` DECIMAL(43,0) NULL,
	`innodb_buffer_free` DECIMAL(44,0) NULL,
	`innodb_buffer_pages` BIGINT(21) NULL,
	`innodb_buffer_pages_hashed` BIGINT(21) NULL,
	`innodb_buffer_pages_old` BIGINT(21) NULL,
	`innodb_buffer_rows_cached` DECIMAL(44,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$session
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$session` (
	`thd_id` BIGINT(20) UNSIGNED NOT NULL,
	`conn_id` BIGINT(20) UNSIGNED NULL,
	`user` VARCHAR(288) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`command` VARCHAR(16) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`state` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`time` BIGINT(20) NULL,
	`current_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`statement_latency` BIGINT(20) UNSIGNED NULL,
	`progress` DECIMAL(26,2) NULL,
	`lock_latency` BIGINT(20) UNSIGNED NULL,
	`rows_examined` BIGINT(20) UNSIGNED NULL,
	`rows_sent` BIGINT(20) UNSIGNED NULL,
	`rows_affected` BIGINT(20) UNSIGNED NULL,
	`tmp_tables` BIGINT(20) UNSIGNED NULL,
	`tmp_disk_tables` BIGINT(20) UNSIGNED NULL,
	`full_scan` VARCHAR(3) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_statement_latency` BIGINT(20) UNSIGNED NULL,
	`current_memory` DECIMAL(41,0) NULL,
	`last_wait` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`last_wait_latency` VARCHAR(20) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`source` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_latency` BIGINT(20) UNSIGNED NULL,
	`trx_state` ENUM('ACTIVE','COMMITTED','ROLLED BACK') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`trx_autocommit` ENUM('YES','NO') NULL COLLATE 'utf8mb4_0900_ai_ci',
	`pid` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin',
	`program_name` VARCHAR(1024) NULL COLLATE 'utf8mb4_bin'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$statements_with_errors_or_warnings
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$statements_with_errors_or_warnings` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`errors` BIGINT(20) UNSIGNED NOT NULL,
	`error_pct` DECIMAL(27,4) NOT NULL,
	`warnings` BIGINT(20) UNSIGNED NOT NULL,
	`warning_pct` DECIMAL(27,4) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$statements_with_full_table_scans
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$statements_with_full_table_scans` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`no_index_used_count` BIGINT(20) UNSIGNED NOT NULL,
	`no_good_index_used_count` BIGINT(20) UNSIGNED NOT NULL,
	`no_index_used_pct` DECIMAL(24,0) NOT NULL,
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent_avg` DECIMAL(21,0) UNSIGNED NULL,
	`rows_examined_avg` DECIMAL(21,0) UNSIGNED NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$statements_with_runtimes_in_95th_percentile
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$statements_with_runtimes_in_95th_percentile` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`full_scan` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`err_count` BIGINT(20) UNSIGNED NOT NULL,
	`warn_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent_avg` DECIMAL(21,0) NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined_avg` DECIMAL(21,0) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$statements_with_sorting
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$statements_with_sorting` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`sort_merge_passes` BIGINT(20) UNSIGNED NOT NULL,
	`avg_sort_merges` DECIMAL(21,0) NOT NULL,
	`sorts_using_scans` BIGINT(20) UNSIGNED NOT NULL,
	`sort_using_range` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sorted` BIGINT(20) UNSIGNED NOT NULL,
	`avg_rows_sorted` DECIMAL(21,0) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$statements_with_temp_tables
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$statements_with_temp_tables` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`memory_tmp_tables` BIGINT(20) UNSIGNED NOT NULL,
	`disk_tmp_tables` BIGINT(20) UNSIGNED NOT NULL,
	`avg_tmp_tables_per_query` DECIMAL(21,0) NOT NULL,
	`tmp_tables_to_disk_pct` DECIMAL(24,0) NOT NULL,
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci'
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$statement_analysis
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$statement_analysis` (
	`query` LONGTEXT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`db` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`full_scan` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`exec_count` BIGINT(20) UNSIGNED NOT NULL,
	`err_count` BIGINT(20) UNSIGNED NOT NULL,
	`warn_count` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL,
	`lock_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent_avg` DECIMAL(21,0) NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined_avg` DECIMAL(21,0) NOT NULL,
	`rows_affected` BIGINT(20) UNSIGNED NOT NULL,
	`rows_affected_avg` DECIMAL(21,0) NOT NULL,
	`tmp_tables` BIGINT(20) UNSIGNED NOT NULL,
	`tmp_disk_tables` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sorted` BIGINT(20) UNSIGNED NOT NULL,
	`sort_merge_passes` BIGINT(20) UNSIGNED NOT NULL,
	`digest` VARCHAR(64) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`first_seen` TIMESTAMP(6) NOT NULL,
	`last_seen` TIMESTAMP(6) NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$user_summary
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$user_summary` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`statements` DECIMAL(64,0) NULL,
	`statement_latency` DECIMAL(64,0) NULL,
	`statement_avg_latency` DECIMAL(65,4) NOT NULL,
	`table_scans` DECIMAL(65,0) NULL,
	`file_ios` DECIMAL(64,0) NULL,
	`file_io_latency` DECIMAL(64,0) NULL,
	`current_connections` DECIMAL(41,0) NULL,
	`total_connections` DECIMAL(41,0) NULL,
	`unique_hosts` BIGINT(21) NOT NULL,
	`current_memory` DECIMAL(63,0) NULL,
	`total_memory_allocated` DECIMAL(64,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$user_summary_by_file_io
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$user_summary_by_file_io` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`ios` DECIMAL(42,0) NULL,
	`io_latency` DECIMAL(42,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$user_summary_by_file_io_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$user_summary_by_file_io_type` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$user_summary_by_stages
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$user_summary_by_stages` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`event_name` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$user_summary_by_statement_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$user_summary_by_statement_latency` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`total` DECIMAL(42,0) NULL,
	`total_latency` DECIMAL(42,0) NULL,
	`max_latency` DECIMAL(42,0) NULL,
	`lock_latency` DECIMAL(42,0) NULL,
	`rows_sent` DECIMAL(42,0) NULL,
	`rows_examined` DECIMAL(42,0) NULL,
	`rows_affected` DECIMAL(42,0) NULL,
	`full_scans` DECIMAL(43,0) NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$user_summary_by_statement_type
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$user_summary_by_statement_type` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`statement` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL,
	`lock_latency` BIGINT(20) UNSIGNED NOT NULL,
	`rows_sent` BIGINT(20) UNSIGNED NOT NULL,
	`rows_examined` BIGINT(20) UNSIGNED NOT NULL,
	`rows_affected` BIGINT(20) UNSIGNED NOT NULL,
	`full_scans` BIGINT(21) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$waits_by_host_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$waits_by_host_by_latency` (
	`host` VARCHAR(255) NULL COLLATE 'ascii_general_ci',
	`event` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$waits_by_user_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$waits_by_user_by_latency` (
	`user` VARCHAR(32) NULL COLLATE 'utf8mb4_bin',
	`event` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$waits_global_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$waits_global_by_latency` (
	`events` VARCHAR(128) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` BIGINT(20) UNSIGNED NOT NULL,
	`total_latency` BIGINT(20) UNSIGNED NOT NULL,
	`avg_latency` BIGINT(20) UNSIGNED NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NOT NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$wait_classes_global_by_avg_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$wait_classes_global_by_avg_latency` (
	`event_class` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` DECIMAL(42,0) NULL,
	`min_latency` BIGINT(20) UNSIGNED NULL,
	`avg_latency` DECIMAL(46,4) NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NULL
) ENGINE=MyISAM;

-- Dumping structure for view sys.x$wait_classes_global_by_latency
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `x$wait_classes_global_by_latency` (
	`event_class` VARCHAR(128) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total` DECIMAL(42,0) NULL,
	`total_latency` DECIMAL(42,0) NULL,
	`min_latency` BIGINT(20) UNSIGNED NULL,
	`avg_latency` DECIMAL(46,4) NOT NULL,
	`max_latency` BIGINT(20) UNSIGNED NULL
) ENGINE=MyISAM;

-- Dumping structure for trigger sys.sys_config_insert_set_user
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `sys_config_insert_set_user` BEFORE INSERT ON `sys_config` FOR EACH ROW BEGIN
    IF @sys.ignore_sys_config_triggers != true AND NEW.set_by IS NULL THEN
        SET NEW.set_by = USER();
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for trigger sys.sys_config_update_set_user
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `sys_config_update_set_user` BEFORE UPDATE ON `sys_config` FOR EACH ROW BEGIN
    IF @sys.ignore_sys_config_triggers != true AND NEW.set_by IS NULL THEN
        SET NEW.set_by = USER();
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Dumping structure for view sys.host_summary
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `host_summary`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`host_summary` (`host`,`statements`,`statement_latency`,`statement_avg_latency`,`table_scans`,`file_ios`,`file_io_latency`,`current_connections`,`total_connections`,`unique_users`,`current_memory`,`total_memory_allocated`) AS select if((`performance_schema`.`accounts`.`HOST` is null),'background',`performance_schema`.`accounts`.`HOST`) AS `host`,sum(`stmt`.`total`) AS `statements`,`sys`.`format_time`(sum(`stmt`.`total_latency`)) AS `statement_latency`,`sys`.`format_time`(ifnull((sum(`stmt`.`total_latency`) / nullif(sum(`stmt`.`total`),0)),0)) AS `statement_avg_latency`,sum(`stmt`.`full_scans`) AS `table_scans`,sum(`io`.`ios`) AS `file_ios`,`sys`.`format_time`(sum(`io`.`io_latency`)) AS `file_io_latency`,sum(`performance_schema`.`accounts`.`CURRENT_CONNECTIONS`) AS `current_connections`,sum(`performance_schema`.`accounts`.`TOTAL_CONNECTIONS`) AS `total_connections`,count(distinct `performance_schema`.`accounts`.`USER`) AS `unique_users`,`sys`.`format_bytes`(sum(`mem`.`current_allocated`)) AS `current_memory`,`sys`.`format_bytes`(sum(`mem`.`total_allocated`)) AS `total_memory_allocated` from (((`performance_schema`.`accounts` join `sys`.`x$host_summary_by_statement_latency` `stmt` on((`performance_schema`.`accounts`.`HOST` = `stmt`.`host`))) join `sys`.`x$host_summary_by_file_io` `io` on((`performance_schema`.`accounts`.`HOST` = `io`.`host`))) join `sys`.`x$memory_by_host_by_current_bytes` `mem` on((`performance_schema`.`accounts`.`HOST` = `mem`.`host`))) group by if((`performance_schema`.`accounts`.`HOST` is null),'background',`performance_schema`.`accounts`.`HOST`);

-- Dumping structure for view sys.host_summary_by_file_io
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `host_summary_by_file_io`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`host_summary_by_file_io` (`host`,`ios`,`io_latency`) AS select if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) AS `host`,sum(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR`) AS `ios`,`sys`.`format_time`(sum(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`)) AS `io_latency` from `performance_schema`.`events_waits_summary_by_host_by_event_name` where (`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') group by if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) order by sum(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.host_summary_by_file_io_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `host_summary_by_file_io_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`host_summary_by_file_io_type` (`host`,`event_name`,`total`,`total_latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) AS `host`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency` from `performance_schema`.`events_waits_summary_by_host_by_event_name` where ((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` like 'wait/io/file%') and (`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR` > 0)) order by if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.host_summary_by_stages
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `host_summary_by_stages`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`host_summary_by_stages` (`host`,`event_name`,`total`,`total_latency`,`avg_latency`) AS select if((`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST`) AS `host`,`performance_schema`.`events_stages_summary_by_host_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_stages_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_stages_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_stages_summary_by_host_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency` from `performance_schema`.`events_stages_summary_by_host_by_event_name` where (`performance_schema`.`events_stages_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_stages_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.host_summary_by_statement_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `host_summary_by_statement_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`host_summary_by_statement_latency` (`host`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`) AS `host`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`COUNT_STAR`) AS `total`,`sys`.`format_time`(sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`)) AS `total_latency`,`sys`.`format_time`(max(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`MAX_TIMER_WAIT`)) AS `max_latency`,`sys`.`format_time`(sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_LOCK_TIME`)) AS `lock_latency`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_SENT`) AS `rows_sent`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_EXAMINED`) AS `rows_examined`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_AFFECTED`) AS `rows_affected`,(sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_INDEX_USED`) + sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_GOOD_INDEX_USED`)) AS `full_scans` from `performance_schema`.`events_statements_summary_by_host_by_event_name` group by if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`) order by sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.host_summary_by_statement_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `host_summary_by_statement_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`host_summary_by_statement_type` (`host`,`statement`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`) AS `host`,substring_index(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`EVENT_NAME`,'/',-(1)) AS `statement`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_LOCK_TIME`) AS `lock_latency`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_SENT` AS `rows_sent`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_EXAMINED` AS `rows_examined`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_AFFECTED` AS `rows_affected`,(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_INDEX_USED` + `performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_GOOD_INDEX_USED`) AS `full_scans` from `performance_schema`.`events_statements_summary_by_host_by_event_name` where (`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.innodb_buffer_stats_by_schema
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `innodb_buffer_stats_by_schema`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`innodb_buffer_stats_by_schema` (`object_schema`,`allocated`,`data`,`pages`,`pages_hashed`,`pages_old`,`rows_cached`) AS select if((locate('.',`ibp`.`TABLE_NAME`) = 0),'InnoDB System',replace(substring_index(`ibp`.`TABLE_NAME`,'.',1),'`','')) AS `object_schema`,`sys`.`format_bytes`(sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`))) AS `allocated`,`sys`.`format_bytes`(sum(`ibp`.`DATA_SIZE`)) AS `data`,count(`ibp`.`PAGE_NUMBER`) AS `pages`,count(if((`ibp`.`IS_HASHED` = 'YES'),1,NULL)) AS `pages_hashed`,count(if((`ibp`.`IS_OLD` = 'YES'),1,NULL)) AS `pages_old`,round((sum(`ibp`.`NUMBER_RECORDS`) / count(distinct `ibp`.`INDEX_NAME`)),0) AS `rows_cached` from `information_schema`.`INNODB_BUFFER_PAGE` `ibp` where (`ibp`.`TABLE_NAME` is not null) group by `object_schema` order by sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`)) desc;

-- Dumping structure for view sys.innodb_buffer_stats_by_table
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `innodb_buffer_stats_by_table`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`innodb_buffer_stats_by_table` (`object_schema`,`object_name`,`allocated`,`data`,`pages`,`pages_hashed`,`pages_old`,`rows_cached`) AS select if((locate('.',`ibp`.`TABLE_NAME`) = 0),'InnoDB System',replace(substring_index(`ibp`.`TABLE_NAME`,'.',1),'`','')) AS `object_schema`,replace(substring_index(`ibp`.`TABLE_NAME`,'.',-(1)),'`','') AS `object_name`,`sys`.`format_bytes`(sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`))) AS `allocated`,`sys`.`format_bytes`(sum(`ibp`.`DATA_SIZE`)) AS `data`,count(`ibp`.`PAGE_NUMBER`) AS `pages`,count(if((`ibp`.`IS_HASHED` = 'YES'),1,NULL)) AS `pages_hashed`,count(if((`ibp`.`IS_OLD` = 'YES'),1,NULL)) AS `pages_old`,round((sum(`ibp`.`NUMBER_RECORDS`) / count(distinct `ibp`.`INDEX_NAME`)),0) AS `rows_cached` from `information_schema`.`INNODB_BUFFER_PAGE` `ibp` where (`ibp`.`TABLE_NAME` is not null) group by `object_schema`,`object_name` order by sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`)) desc;

-- Dumping structure for view sys.innodb_lock_waits
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `innodb_lock_waits`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`innodb_lock_waits` (`wait_started`,`wait_age`,`wait_age_secs`,`locked_table`,`locked_table_schema`,`locked_table_name`,`locked_table_partition`,`locked_table_subpartition`,`locked_index`,`locked_type`,`waiting_trx_id`,`waiting_trx_started`,`waiting_trx_age`,`waiting_trx_rows_locked`,`waiting_trx_rows_modified`,`waiting_pid`,`waiting_query`,`waiting_lock_id`,`waiting_lock_mode`,`blocking_trx_id`,`blocking_pid`,`blocking_query`,`blocking_lock_id`,`blocking_lock_mode`,`blocking_trx_started`,`blocking_trx_age`,`blocking_trx_rows_locked`,`blocking_trx_rows_modified`,`sql_kill_blocking_query`,`sql_kill_blocking_connection`) AS select `r`.`trx_wait_started` AS `wait_started`,timediff(now(),`r`.`trx_wait_started`) AS `wait_age`,timestampdiff(SECOND,`r`.`trx_wait_started`,now()) AS `wait_age_secs`,concat(`sys`.`quote_identifier`(`rl`.`OBJECT_SCHEMA`),'.',`sys`.`quote_identifier`(`rl`.`OBJECT_NAME`)) AS `locked_table`,`rl`.`OBJECT_SCHEMA` AS `locked_table_schema`,`rl`.`OBJECT_NAME` AS `locked_table_name`,`rl`.`PARTITION_NAME` AS `locked_table_partition`,`rl`.`SUBPARTITION_NAME` AS `locked_table_subpartition`,`rl`.`INDEX_NAME` AS `locked_index`,`rl`.`LOCK_TYPE` AS `locked_type`,`r`.`trx_id` AS `waiting_trx_id`,`r`.`trx_started` AS `waiting_trx_started`,timediff(now(),`r`.`trx_started`) AS `waiting_trx_age`,`r`.`trx_rows_locked` AS `waiting_trx_rows_locked`,`r`.`trx_rows_modified` AS `waiting_trx_rows_modified`,`r`.`trx_mysql_thread_id` AS `waiting_pid`,`sys`.`format_statement`(`r`.`trx_query`) AS `waiting_query`,`rl`.`ENGINE_LOCK_ID` AS `waiting_lock_id`,`rl`.`LOCK_MODE` AS `waiting_lock_mode`,`b`.`trx_id` AS `blocking_trx_id`,`b`.`trx_mysql_thread_id` AS `blocking_pid`,`sys`.`format_statement`(`b`.`trx_query`) AS `blocking_query`,`bl`.`ENGINE_LOCK_ID` AS `blocking_lock_id`,`bl`.`LOCK_MODE` AS `blocking_lock_mode`,`b`.`trx_started` AS `blocking_trx_started`,timediff(now(),`b`.`trx_started`) AS `blocking_trx_age`,`b`.`trx_rows_locked` AS `blocking_trx_rows_locked`,`b`.`trx_rows_modified` AS `blocking_trx_rows_modified`,concat('KILL QUERY ',`b`.`trx_mysql_thread_id`) AS `sql_kill_blocking_query`,concat('KILL ',`b`.`trx_mysql_thread_id`) AS `sql_kill_blocking_connection` from ((((`performance_schema`.`data_lock_waits` `w` join `information_schema`.`INNODB_TRX` `b` on((convert(`b`.`trx_id` using utf8mb4) = cast(`w`.`BLOCKING_ENGINE_TRANSACTION_ID` as char charset utf8mb4)))) join `information_schema`.`INNODB_TRX` `r` on((convert(`r`.`trx_id` using utf8mb4) = cast(`w`.`REQUESTING_ENGINE_TRANSACTION_ID` as char charset utf8mb4)))) join `performance_schema`.`data_locks` `bl` on((`bl`.`ENGINE_LOCK_ID` = `w`.`BLOCKING_ENGINE_LOCK_ID`))) join `performance_schema`.`data_locks` `rl` on((`rl`.`ENGINE_LOCK_ID` = `w`.`REQUESTING_ENGINE_LOCK_ID`))) order by `r`.`trx_wait_started`;

-- Dumping structure for view sys.io_by_thread_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `io_by_thread_by_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`io_by_thread_by_latency` (`user`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`,`thread_id`,`processlist_id`) AS select if((`performance_schema`.`threads`.`PROCESSLIST_ID` is null),substring_index(`performance_schema`.`threads`.`NAME`,'/',-(1)),concat(`performance_schema`.`threads`.`PROCESSLIST_USER`,'@',convert(`performance_schema`.`threads`.`PROCESSLIST_HOST` using utf8mb4))) AS `user`,sum(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`COUNT_STAR`) AS `total`,`sys`.`format_time`(sum(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`SUM_TIMER_WAIT`)) AS `total_latency`,`sys`.`format_time`(min(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`MIN_TIMER_WAIT`)) AS `min_latency`,`sys`.`format_time`(avg(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`AVG_TIMER_WAIT`)) AS `avg_latency`,`sys`.`format_time`(max(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`MAX_TIMER_WAIT`)) AS `max_latency`,`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`THREAD_ID` AS `thread_id`,`performance_schema`.`threads`.`PROCESSLIST_ID` AS `processlist_id` from (`performance_schema`.`events_waits_summary_by_thread_by_event_name` left join `performance_schema`.`threads` on((`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`THREAD_ID` = `performance_schema`.`threads`.`THREAD_ID`))) where ((`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') and (`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`SUM_TIMER_WAIT` > 0)) group by `performance_schema`.`events_waits_summary_by_thread_by_event_name`.`THREAD_ID`,`performance_schema`.`threads`.`PROCESSLIST_ID`,`user` order by sum(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.io_global_by_file_by_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `io_global_by_file_by_bytes`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`io_global_by_file_by_bytes` (`file`,`count_read`,`total_read`,`avg_read`,`count_write`,`total_written`,`avg_write`,`total`,`write_pct`) AS select `sys`.`format_path`(`performance_schema`.`file_summary_by_instance`.`FILE_NAME`) AS `file`,`performance_schema`.`file_summary_by_instance`.`COUNT_READ` AS `count_read`,`sys`.`format_bytes`(`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ`) AS `total_read`,`sys`.`format_bytes`(ifnull((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` / nullif(`performance_schema`.`file_summary_by_instance`.`COUNT_READ`,0)),0)) AS `avg_read`,`performance_schema`.`file_summary_by_instance`.`COUNT_WRITE` AS `count_write`,`sys`.`format_bytes`(`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`) AS `total_written`,`sys`.`format_bytes`(ifnull((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE` / nullif(`performance_schema`.`file_summary_by_instance`.`COUNT_WRITE`,0)),0.00)) AS `avg_write`,`sys`.`format_bytes`((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` + `performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`)) AS `total`,ifnull(round((100 - ((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` / nullif((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` + `performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`),0)) * 100)),2),0.00) AS `write_pct` from `performance_schema`.`file_summary_by_instance` order by (`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` + `performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`) desc;

-- Dumping structure for view sys.io_global_by_file_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `io_global_by_file_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`io_global_by_file_by_latency` (`file`,`total`,`total_latency`,`count_read`,`read_latency`,`count_write`,`write_latency`,`count_misc`,`misc_latency`) AS select `sys`.`format_path`(`performance_schema`.`file_summary_by_instance`.`FILE_NAME`) AS `file`,`performance_schema`.`file_summary_by_instance`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_WAIT`) AS `total_latency`,`performance_schema`.`file_summary_by_instance`.`COUNT_READ` AS `count_read`,`sys`.`format_time`(`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_READ`) AS `read_latency`,`performance_schema`.`file_summary_by_instance`.`COUNT_WRITE` AS `count_write`,`sys`.`format_time`(`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_WRITE`) AS `write_latency`,`performance_schema`.`file_summary_by_instance`.`COUNT_MISC` AS `count_misc`,`sys`.`format_time`(`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_MISC`) AS `misc_latency` from `performance_schema`.`file_summary_by_instance` order by `performance_schema`.`file_summary_by_instance`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.io_global_by_wait_by_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `io_global_by_wait_by_bytes`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`io_global_by_wait_by_bytes` (`event_name`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`,`count_read`,`total_read`,`avg_read`,`count_write`,`total_written`,`avg_written`,`total_requested`) AS select substring_index(`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME`,'/',-(2)) AS `event_name`,`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`MIN_TIMER_WAIT`) AS `min_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency`,`performance_schema`.`file_summary_by_event_name`.`COUNT_READ` AS `count_read`,`sys`.`format_bytes`(`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ`) AS `total_read`,`sys`.`format_bytes`(ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_READ`,0)),0)) AS `avg_read`,`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE` AS `count_write`,`sys`.`format_bytes`(`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE`) AS `total_written`,`sys`.`format_bytes`(ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE`,0)),0)) AS `avg_written`,`sys`.`format_bytes`((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` + `performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ`)) AS `total_requested` from `performance_schema`.`file_summary_by_event_name` where ((`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') and (`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` > 0)) order by (`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` + `performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ`) desc;

-- Dumping structure for view sys.io_global_by_wait_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `io_global_by_wait_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`io_global_by_wait_by_latency` (`event_name`,`total`,`total_latency`,`avg_latency`,`max_latency`,`read_latency`,`write_latency`,`misc_latency`,`count_read`,`total_read`,`avg_read`,`count_write`,`total_written`,`avg_written`) AS select substring_index(`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME`,'/',-(2)) AS `event_name`,`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_READ`) AS `read_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WRITE`) AS `write_latency`,`sys`.`format_time`(`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_MISC`) AS `misc_latency`,`performance_schema`.`file_summary_by_event_name`.`COUNT_READ` AS `count_read`,`sys`.`format_bytes`(`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ`) AS `total_read`,`sys`.`format_bytes`(ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_READ`,0)),0)) AS `avg_read`,`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE` AS `count_write`,`sys`.`format_bytes`(`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE`) AS `total_written`,`sys`.`format_bytes`(ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE`,0)),0)) AS `avg_written` from `performance_schema`.`file_summary_by_event_name` where ((`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') and (`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` > 0)) order by `performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.latest_file_io
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `latest_file_io`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`latest_file_io` (`thread`,`file`,`latency`,`operation`,`requested`) AS select if((`information_schema`.`processlist`.`ID` is null),concat(substring_index(`performance_schema`.`threads`.`NAME`,'/',-(1)),':',`performance_schema`.`events_waits_history_long`.`THREAD_ID`),convert(concat(`information_schema`.`processlist`.`USER`,'@',`information_schema`.`processlist`.`HOST`,':',`information_schema`.`processlist`.`ID`) using utf8mb4)) AS `thread`,`sys`.`format_path`(`performance_schema`.`events_waits_history_long`.`OBJECT_NAME`) AS `file`,`sys`.`format_time`(`performance_schema`.`events_waits_history_long`.`TIMER_WAIT`) AS `latency`,`performance_schema`.`events_waits_history_long`.`OPERATION` AS `operation`,`sys`.`format_bytes`(`performance_schema`.`events_waits_history_long`.`NUMBER_OF_BYTES`) AS `requested` from ((`performance_schema`.`events_waits_history_long` join `performance_schema`.`threads` on((`performance_schema`.`events_waits_history_long`.`THREAD_ID` = `performance_schema`.`threads`.`THREAD_ID`))) left join `information_schema`.`PROCESSLIST` on((`performance_schema`.`threads`.`PROCESSLIST_ID` = `information_schema`.`processlist`.`ID`))) where ((`performance_schema`.`events_waits_history_long`.`OBJECT_NAME` is not null) and (`performance_schema`.`events_waits_history_long`.`EVENT_NAME` like 'wait/io/file/%')) order by `performance_schema`.`events_waits_history_long`.`TIMER_START`;

-- Dumping structure for view sys.memory_by_host_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `memory_by_host_by_current_bytes`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`memory_by_host_by_current_bytes` (`host`,`current_count_used`,`current_allocated`,`current_avg_alloc`,`current_max_alloc`,`total_allocated`) AS select if((`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST`) AS `host`,sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_COUNT_USED`) AS `current_count_used`,`sys`.`format_bytes`(sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`)) AS `current_allocated`,`sys`.`format_bytes`(ifnull((sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) / nullif(sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_COUNT_USED`),0)),0)) AS `current_avg_alloc`,`sys`.`format_bytes`(max(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`)) AS `current_max_alloc`,`sys`.`format_bytes`(sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`SUM_NUMBER_OF_BYTES_ALLOC`)) AS `total_allocated` from `performance_schema`.`memory_summary_by_host_by_event_name` group by if((`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST`) order by sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) desc;

-- Dumping structure for view sys.memory_by_thread_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `memory_by_thread_by_current_bytes`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`memory_by_thread_by_current_bytes` (`thread_id`,`user`,`current_count_used`,`current_allocated`,`current_avg_alloc`,`current_max_alloc`,`total_allocated`) AS select `mt`.`THREAD_ID` AS `thread_id`,if((`t`.`NAME` = 'thread/sql/one_connection'),concat(`t`.`PROCESSLIST_USER`,'@',convert(`t`.`PROCESSLIST_HOST` using utf8mb4)),replace(`t`.`NAME`,'thread/','')) AS `user`,sum(`mt`.`CURRENT_COUNT_USED`) AS `current_count_used`,`sys`.`format_bytes`(sum(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`)) AS `current_allocated`,`sys`.`format_bytes`(ifnull((sum(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`) / nullif(sum(`mt`.`CURRENT_COUNT_USED`),0)),0)) AS `current_avg_alloc`,`sys`.`format_bytes`(max(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`)) AS `current_max_alloc`,`sys`.`format_bytes`(sum(`mt`.`SUM_NUMBER_OF_BYTES_ALLOC`)) AS `total_allocated` from (`performance_schema`.`memory_summary_by_thread_by_event_name` `mt` join `performance_schema`.`threads` `t` on((`mt`.`THREAD_ID` = `t`.`THREAD_ID`))) group by `mt`.`THREAD_ID`,if((`t`.`NAME` = 'thread/sql/one_connection'),concat(`t`.`PROCESSLIST_USER`,'@',convert(`t`.`PROCESSLIST_HOST` using utf8mb4)),replace(`t`.`NAME`,'thread/','')) order by sum(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`) desc;

-- Dumping structure for view sys.memory_by_user_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `memory_by_user_by_current_bytes`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`memory_by_user_by_current_bytes` (`user`,`current_count_used`,`current_allocated`,`current_avg_alloc`,`current_max_alloc`,`total_allocated`) AS select if((`performance_schema`.`memory_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`memory_summary_by_user_by_event_name`.`USER`) AS `user`,sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_COUNT_USED`) AS `current_count_used`,`sys`.`format_bytes`(sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`)) AS `current_allocated`,`sys`.`format_bytes`(ifnull((sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) / nullif(sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_COUNT_USED`),0)),0)) AS `current_avg_alloc`,`sys`.`format_bytes`(max(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`)) AS `current_max_alloc`,`sys`.`format_bytes`(sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`SUM_NUMBER_OF_BYTES_ALLOC`)) AS `total_allocated` from `performance_schema`.`memory_summary_by_user_by_event_name` group by if((`performance_schema`.`memory_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`memory_summary_by_user_by_event_name`.`USER`) order by sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) desc;

-- Dumping structure for view sys.memory_global_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `memory_global_by_current_bytes`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`memory_global_by_current_bytes` (`event_name`,`current_count`,`current_alloc`,`current_avg_alloc`,`high_count`,`high_alloc`,`high_avg_alloc`) AS select `performance_schema`.`memory_summary_global_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_COUNT_USED` AS `current_count`,`sys`.`format_bytes`(`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `current_alloc`,`sys`.`format_bytes`(ifnull((`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED` / nullif(`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_COUNT_USED`,0)),0)) AS `current_avg_alloc`,`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_COUNT_USED` AS `high_count`,`sys`.`format_bytes`(`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_NUMBER_OF_BYTES_USED`) AS `high_alloc`,`sys`.`format_bytes`(ifnull((`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_NUMBER_OF_BYTES_USED` / nullif(`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_COUNT_USED`,0)),0)) AS `high_avg_alloc` from `performance_schema`.`memory_summary_global_by_event_name` where (`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED` > 0) order by `performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED` desc;

-- Dumping structure for view sys.memory_global_total
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `memory_global_total`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`memory_global_total` (`total_allocated`) AS select `sys`.`format_bytes`(sum(`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`)) AS `total_allocated` from `performance_schema`.`memory_summary_global_by_event_name`;

-- Dumping structure for view sys.metrics
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `metrics`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`metrics` (`Variable_name`,`Variable_value`,`Type`,`Enabled`) AS select lower(`performance_schema`.`global_status`.`VARIABLE_NAME`) AS `Variable_name`,`performance_schema`.`global_status`.`VARIABLE_VALUE` AS `Variable_value`,'Global Status' AS `Type`,'YES' AS `Enabled` from `performance_schema`.`global_status` union all select `information_schema`.`innodb_metrics`.`NAME` AS `Variable_name`,`information_schema`.`innodb_metrics`.`COUNT` AS `Variable_value`,concat('InnoDB Metrics - ',`information_schema`.`innodb_metrics`.`SUBSYSTEM`) AS `Type`,if((`information_schema`.`innodb_metrics`.`STATUS` = 'enabled'),'YES','NO') AS `Enabled` from `information_schema`.`INNODB_METRICS` where (`information_schema`.`innodb_metrics`.`NAME` not in ('lock_row_lock_time','lock_row_lock_time_avg','lock_row_lock_time_max','lock_row_lock_waits','buffer_pool_reads','buffer_pool_read_requests','buffer_pool_write_requests','buffer_pool_wait_free','buffer_pool_read_ahead','buffer_pool_read_ahead_evicted','buffer_pool_pages_total','buffer_pool_pages_misc','buffer_pool_pages_data','buffer_pool_bytes_data','buffer_pool_pages_dirty','buffer_pool_bytes_dirty','buffer_pool_pages_free','buffer_pages_created','buffer_pages_written','buffer_pages_read','buffer_data_reads','buffer_data_written','file_num_open_files','os_log_bytes_written','os_log_fsyncs','os_log_pending_fsyncs','os_log_pending_writes','log_waits','log_write_requests','log_writes','innodb_dblwr_writes','innodb_dblwr_pages_written','innodb_page_size')) union all select 'memory_current_allocated' AS `Variable_name`,sum(`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `Variable_value`,'Performance Schema' AS `Type`,if(((select count(0) from `performance_schema`.`setup_instruments` where ((`performance_schema`.`setup_instruments`.`NAME` like 'memory/%') and (`performance_schema`.`setup_instruments`.`ENABLED` = 'YES'))) = 0),'NO',if(((select count(0) from `performance_schema`.`setup_instruments` where ((`performance_schema`.`setup_instruments`.`NAME` like 'memory/%') and (`performance_schema`.`setup_instruments`.`ENABLED` = 'YES'))) = (select count(0) from `performance_schema`.`setup_instruments` where (`performance_schema`.`setup_instruments`.`NAME` like 'memory/%'))),'YES','PARTIAL')) AS `Enabled` from `performance_schema`.`memory_summary_global_by_event_name` union all select 'memory_total_allocated' AS `Variable_name`,sum(`performance_schema`.`memory_summary_global_by_event_name`.`SUM_NUMBER_OF_BYTES_ALLOC`) AS `Variable_value`,'Performance Schema' AS `Type`,if(((select count(0) from `performance_schema`.`setup_instruments` where ((`performance_schema`.`setup_instruments`.`NAME` like 'memory/%') and (`performance_schema`.`setup_instruments`.`ENABLED` = 'YES'))) = 0),'NO',if(((select count(0) from `performance_schema`.`setup_instruments` where ((`performance_schema`.`setup_instruments`.`NAME` like 'memory/%') and (`performance_schema`.`setup_instruments`.`ENABLED` = 'YES'))) = (select count(0) from `performance_schema`.`setup_instruments` where (`performance_schema`.`setup_instruments`.`NAME` like 'memory/%'))),'YES','PARTIAL')) AS `Enabled` from `performance_schema`.`memory_summary_global_by_event_name` union all select 'NOW()' AS `Variable_name`,now(3) AS `Variable_value`,'System Time' AS `Type`,'YES' AS `Enabled` union all select 'UNIX_TIMESTAMP()' AS `Variable_name`,round(unix_timestamp(now(3)),3) AS `Variable_value`,'System Time' AS `Type`,'YES' AS `Enabled` order by `Type`,`Variable_name`;

-- Dumping structure for view sys.processlist
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `processlist`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`processlist` (`thd_id`,`conn_id`,`user`,`db`,`command`,`state`,`time`,`current_statement`,`statement_latency`,`progress`,`lock_latency`,`rows_examined`,`rows_sent`,`rows_affected`,`tmp_tables`,`tmp_disk_tables`,`full_scan`,`last_statement`,`last_statement_latency`,`current_memory`,`last_wait`,`last_wait_latency`,`source`,`trx_latency`,`trx_state`,`trx_autocommit`,`pid`,`program_name`) AS select `pps`.`THREAD_ID` AS `thd_id`,`pps`.`PROCESSLIST_ID` AS `conn_id`,if((`pps`.`NAME` in ('thread/sql/one_connection','thread/thread_pool/tp_one_connection')),concat(`pps`.`PROCESSLIST_USER`,'@',convert(`pps`.`PROCESSLIST_HOST` using utf8mb4)),replace(`pps`.`NAME`,'thread/','')) AS `user`,`pps`.`PROCESSLIST_DB` AS `db`,`pps`.`PROCESSLIST_COMMAND` AS `command`,`pps`.`PROCESSLIST_STATE` AS `state`,`pps`.`PROCESSLIST_TIME` AS `time`,`sys`.`format_statement`(`pps`.`PROCESSLIST_INFO`) AS `current_statement`,if((`esc`.`END_EVENT_ID` is null),`sys`.`format_time`(`esc`.`TIMER_WAIT`),NULL) AS `statement_latency`,if((`esc`.`END_EVENT_ID` is null),round((100 * (`estc`.`WORK_COMPLETED` / `estc`.`WORK_ESTIMATED`)),2),NULL) AS `progress`,`sys`.`format_time`(`esc`.`LOCK_TIME`) AS `lock_latency`,`esc`.`ROWS_EXAMINED` AS `rows_examined`,`esc`.`ROWS_SENT` AS `rows_sent`,`esc`.`ROWS_AFFECTED` AS `rows_affected`,`esc`.`CREATED_TMP_TABLES` AS `tmp_tables`,`esc`.`CREATED_TMP_DISK_TABLES` AS `tmp_disk_tables`,if(((`esc`.`NO_GOOD_INDEX_USED` > 0) or (`esc`.`NO_INDEX_USED` > 0)),'YES','NO') AS `full_scan`,if((`esc`.`END_EVENT_ID` is not null),`sys`.`format_statement`(`esc`.`SQL_TEXT`),NULL) AS `last_statement`,if((`esc`.`END_EVENT_ID` is not null),`sys`.`format_time`(`esc`.`TIMER_WAIT`),NULL) AS `last_statement_latency`,`sys`.`format_bytes`(`mem`.`current_allocated`) AS `current_memory`,`ewc`.`EVENT_NAME` AS `last_wait`,if(((`ewc`.`END_EVENT_ID` is null) and (`ewc`.`EVENT_NAME` is not null)),'Still Waiting',`sys`.`format_time`(`ewc`.`TIMER_WAIT`)) AS `last_wait_latency`,`ewc`.`SOURCE` AS `source`,`sys`.`format_time`(`etc`.`TIMER_WAIT`) AS `trx_latency`,`etc`.`STATE` AS `trx_state`,`etc`.`AUTOCOMMIT` AS `trx_autocommit`,`conattr_pid`.`ATTR_VALUE` AS `pid`,`conattr_progname`.`ATTR_VALUE` AS `program_name` from (((((((`performance_schema`.`threads` `pps` left join `performance_schema`.`events_waits_current` `ewc` on((`pps`.`THREAD_ID` = `ewc`.`THREAD_ID`))) left join `performance_schema`.`events_stages_current` `estc` on((`pps`.`THREAD_ID` = `estc`.`THREAD_ID`))) left join `performance_schema`.`events_statements_current` `esc` on((`pps`.`THREAD_ID` = `esc`.`THREAD_ID`))) left join `performance_schema`.`events_transactions_current` `etc` on((`pps`.`THREAD_ID` = `etc`.`THREAD_ID`))) left join `sys`.`x$memory_by_thread_by_current_bytes` `mem` on((`pps`.`THREAD_ID` = `mem`.`thread_id`))) left join `performance_schema`.`session_connect_attrs` `conattr_pid` on(((`conattr_pid`.`PROCESSLIST_ID` = `pps`.`PROCESSLIST_ID`) and (`conattr_pid`.`ATTR_NAME` = '_pid')))) left join `performance_schema`.`session_connect_attrs` `conattr_progname` on(((`conattr_progname`.`PROCESSLIST_ID` = `pps`.`PROCESSLIST_ID`) and (`conattr_progname`.`ATTR_NAME` = 'program_name')))) order by `pps`.`PROCESSLIST_TIME` desc,`last_wait_latency` desc;

-- Dumping structure for view sys.ps_check_lost_instrumentation
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `ps_check_lost_instrumentation`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`ps_check_lost_instrumentation` (`variable_name`,`variable_value`) AS select `performance_schema`.`global_status`.`VARIABLE_NAME` AS `variable_name`,`performance_schema`.`global_status`.`VARIABLE_VALUE` AS `variable_value` from `performance_schema`.`global_status` where ((`performance_schema`.`global_status`.`VARIABLE_NAME` like 'perf%lost') and (`performance_schema`.`global_status`.`VARIABLE_VALUE` > 0));

-- Dumping structure for view sys.schema_auto_increment_columns
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_auto_increment_columns`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_auto_increment_columns` (`table_schema`,`table_name`,`column_name`,`data_type`,`column_type`,`is_signed`,`is_unsigned`,`max_value`,`auto_increment`,`auto_increment_ratio`) AS select `columns`.`TABLE_SCHEMA` AS `TABLE_SCHEMA`,`columns`.`TABLE_NAME` AS `TABLE_NAME`,`columns`.`COLUMN_NAME` AS `COLUMN_NAME`,`columns`.`DATA_TYPE` AS `DATA_TYPE`,`columns`.`COLUMN_TYPE` AS `COLUMN_TYPE`,(locate('unsigned',`columns`.`COLUMN_TYPE`) = 0) AS `is_signed`,(locate('unsigned',`columns`.`COLUMN_TYPE`) > 0) AS `is_unsigned`,((case `columns`.`DATA_TYPE` when 'tinyint' then 255 when 'smallint' then 65535 when 'mediumint' then 16777215 when 'int' then 4294967295 when 'bigint' then 18446744073709551615 end) >> if((locate('unsigned',`columns`.`COLUMN_TYPE`) > 0),0,1)) AS `max_value`,`tables`.`AUTO_INCREMENT` AS `AUTO_INCREMENT`,(`tables`.`AUTO_INCREMENT` / ((case `columns`.`DATA_TYPE` when 'tinyint' then 255 when 'smallint' then 65535 when 'mediumint' then 16777215 when 'int' then 4294967295 when 'bigint' then 18446744073709551615 end) >> if((locate('unsigned',`columns`.`COLUMN_TYPE`) > 0),0,1))) AS `auto_increment_ratio` from (`information_schema`.`COLUMNS` join `information_schema`.`TABLES` on(((`columns`.`TABLE_SCHEMA` = `tables`.`TABLE_SCHEMA`) and (`columns`.`TABLE_NAME` = `tables`.`TABLE_NAME`)))) where ((`columns`.`TABLE_SCHEMA` not in ('mysql','sys','INFORMATION_SCHEMA','performance_schema')) and (`tables`.`TABLE_TYPE` = 'BASE TABLE') and (`columns`.`EXTRA` = 'auto_increment')) order by (`tables`.`AUTO_INCREMENT` / ((case `columns`.`DATA_TYPE` when 'tinyint' then 255 when 'smallint' then 65535 when 'mediumint' then 16777215 when 'int' then 4294967295 when 'bigint' then 18446744073709551615 end) >> if((locate('unsigned',`columns`.`COLUMN_TYPE`) > 0),0,1))) desc,((case `columns`.`DATA_TYPE` when 'tinyint' then 255 when 'smallint' then 65535 when 'mediumint' then 16777215 when 'int' then 4294967295 when 'bigint' then 18446744073709551615 end) >> if((locate('unsigned',`columns`.`COLUMN_TYPE`) > 0),0,1));

-- Dumping structure for view sys.schema_index_statistics
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_index_statistics`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_index_statistics` (`table_schema`,`table_name`,`index_name`,`rows_selected`,`select_latency`,`rows_inserted`,`insert_latency`,`rows_updated`,`update_latency`,`rows_deleted`,`delete_latency`) AS select `performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_SCHEMA` AS `table_schema`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_NAME` AS `table_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`INDEX_NAME` AS `index_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_FETCH` AS `rows_selected`,`sys`.`format_time`(`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_FETCH`) AS `select_latency`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_INSERT` AS `rows_inserted`,`sys`.`format_time`(`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_INSERT`) AS `insert_latency`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_UPDATE` AS `rows_updated`,`sys`.`format_time`(`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_UPDATE`) AS `update_latency`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_DELETE` AS `rows_deleted`,`sys`.`format_time`(`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_DELETE`) AS `delete_latency` from `performance_schema`.`table_io_waits_summary_by_index_usage` where (`performance_schema`.`table_io_waits_summary_by_index_usage`.`INDEX_NAME` is not null) order by `performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.schema_object_overview
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_object_overview`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_object_overview` (`db`,`object_type`,`count`) AS select `routines`.`ROUTINE_SCHEMA` AS `db`,`routines`.`ROUTINE_TYPE` AS `object_type`,count(0) AS `count` from `information_schema`.`ROUTINES` group by `routines`.`ROUTINE_SCHEMA`,`routines`.`ROUTINE_TYPE` union select `tables`.`TABLE_SCHEMA` AS `TABLE_SCHEMA`,`tables`.`TABLE_TYPE` AS `TABLE_TYPE`,count(0) AS `COUNT(*)` from `information_schema`.`TABLES` group by `tables`.`TABLE_SCHEMA`,`tables`.`TABLE_TYPE` union select `statistics`.`TABLE_SCHEMA` AS `TABLE_SCHEMA`,concat('INDEX (',`statistics`.`INDEX_TYPE`,')') AS `CONCAT('INDEX (', INDEX_TYPE, ')')`,count(0) AS `COUNT(*)` from `information_schema`.`STATISTICS` group by `statistics`.`TABLE_SCHEMA`,`statistics`.`INDEX_TYPE` union select `triggers`.`TRIGGER_SCHEMA` AS `TRIGGER_SCHEMA`,'TRIGGER' AS `TRIGGER`,count(0) AS `COUNT(*)` from `information_schema`.`TRIGGERS` group by `triggers`.`TRIGGER_SCHEMA` union select `events`.`EVENT_SCHEMA` AS `EVENT_SCHEMA`,'EVENT' AS `EVENT`,count(0) AS `COUNT(*)` from `information_schema`.`EVENTS` group by `events`.`EVENT_SCHEMA` order by `db`,`object_type`;

-- Dumping structure for view sys.schema_redundant_indexes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_redundant_indexes`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_redundant_indexes` (`table_schema`,`table_name`,`redundant_index_name`,`redundant_index_columns`,`redundant_index_non_unique`,`dominant_index_name`,`dominant_index_columns`,`dominant_index_non_unique`,`subpart_exists`,`sql_drop_index`) AS select `redundant_keys`.`table_schema` AS `table_schema`,`redundant_keys`.`table_name` AS `table_name`,`redundant_keys`.`index_name` AS `redundant_index_name`,`redundant_keys`.`index_columns` AS `redundant_index_columns`,`redundant_keys`.`non_unique` AS `redundant_index_non_unique`,`dominant_keys`.`index_name` AS `dominant_index_name`,`dominant_keys`.`index_columns` AS `dominant_index_columns`,`dominant_keys`.`non_unique` AS `dominant_index_non_unique`,if(((0 <> `redundant_keys`.`subpart_exists`) or (0 <> `dominant_keys`.`subpart_exists`)),1,0) AS `subpart_exists`,concat('ALTER TABLE `',`redundant_keys`.`table_schema`,'`.`',`redundant_keys`.`table_name`,'` DROP INDEX `',`redundant_keys`.`index_name`,'`') AS `sql_drop_index` from (`sys`.`x$schema_flattened_keys` `redundant_keys` join `sys`.`x$schema_flattened_keys` `dominant_keys` on(((`redundant_keys`.`table_schema` = `dominant_keys`.`table_schema`) and (`redundant_keys`.`table_name` = `dominant_keys`.`table_name`)))) where ((`redundant_keys`.`index_name` <> `dominant_keys`.`index_name`) and (((`redundant_keys`.`index_columns` = `dominant_keys`.`index_columns`) and ((`redundant_keys`.`non_unique` > `dominant_keys`.`non_unique`) or ((`redundant_keys`.`non_unique` = `dominant_keys`.`non_unique`) and (if((`redundant_keys`.`index_name` = 'PRIMARY'),'',`redundant_keys`.`index_name`) > if((`dominant_keys`.`index_name` = 'PRIMARY'),'',`dominant_keys`.`index_name`))))) or ((locate(concat(`redundant_keys`.`index_columns`,','),`dominant_keys`.`index_columns`) = 1) and (`redundant_keys`.`non_unique` = 1)) or ((locate(concat(`dominant_keys`.`index_columns`,','),`redundant_keys`.`index_columns`) = 1) and (`dominant_keys`.`non_unique` = 0))));

-- Dumping structure for view sys.schema_tables_with_full_table_scans
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_tables_with_full_table_scans`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_tables_with_full_table_scans` (`object_schema`,`object_name`,`rows_full_scanned`,`latency`) AS select `performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_SCHEMA` AS `object_schema`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_NAME` AS `object_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_READ` AS `rows_full_scanned`,`sys`.`format_time`(`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_WAIT`) AS `latency` from `performance_schema`.`table_io_waits_summary_by_index_usage` where ((`performance_schema`.`table_io_waits_summary_by_index_usage`.`INDEX_NAME` is null) and (`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_READ` > 0)) order by `performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_READ` desc;

-- Dumping structure for view sys.schema_table_lock_waits
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_table_lock_waits`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_table_lock_waits` (`object_schema`,`object_name`,`waiting_thread_id`,`waiting_pid`,`waiting_account`,`waiting_lock_type`,`waiting_lock_duration`,`waiting_query`,`waiting_query_secs`,`waiting_query_rows_affected`,`waiting_query_rows_examined`,`blocking_thread_id`,`blocking_pid`,`blocking_account`,`blocking_lock_type`,`blocking_lock_duration`,`sql_kill_blocking_query`,`sql_kill_blocking_connection`) AS select `g`.`OBJECT_SCHEMA` AS `object_schema`,`g`.`OBJECT_NAME` AS `object_name`,`pt`.`THREAD_ID` AS `waiting_thread_id`,`pt`.`PROCESSLIST_ID` AS `waiting_pid`,`sys`.`ps_thread_account`(`p`.`OWNER_THREAD_ID`) AS `waiting_account`,`p`.`LOCK_TYPE` AS `waiting_lock_type`,`p`.`LOCK_DURATION` AS `waiting_lock_duration`,`sys`.`format_statement`(`pt`.`PROCESSLIST_INFO`) AS `waiting_query`,`pt`.`PROCESSLIST_TIME` AS `waiting_query_secs`,`ps`.`ROWS_AFFECTED` AS `waiting_query_rows_affected`,`ps`.`ROWS_EXAMINED` AS `waiting_query_rows_examined`,`gt`.`THREAD_ID` AS `blocking_thread_id`,`gt`.`PROCESSLIST_ID` AS `blocking_pid`,`sys`.`ps_thread_account`(`g`.`OWNER_THREAD_ID`) AS `blocking_account`,`g`.`LOCK_TYPE` AS `blocking_lock_type`,`g`.`LOCK_DURATION` AS `blocking_lock_duration`,concat('KILL QUERY ',`gt`.`PROCESSLIST_ID`) AS `sql_kill_blocking_query`,concat('KILL ',`gt`.`PROCESSLIST_ID`) AS `sql_kill_blocking_connection` from (((((`performance_schema`.`metadata_locks` `g` join `performance_schema`.`metadata_locks` `p` on(((`g`.`OBJECT_TYPE` = `p`.`OBJECT_TYPE`) and (`g`.`OBJECT_SCHEMA` = `p`.`OBJECT_SCHEMA`) and (`g`.`OBJECT_NAME` = `p`.`OBJECT_NAME`) and (`g`.`LOCK_STATUS` = 'GRANTED') and (`p`.`LOCK_STATUS` = 'PENDING')))) join `performance_schema`.`threads` `gt` on((`g`.`OWNER_THREAD_ID` = `gt`.`THREAD_ID`))) join `performance_schema`.`threads` `pt` on((`p`.`OWNER_THREAD_ID` = `pt`.`THREAD_ID`))) left join `performance_schema`.`events_statements_current` `gs` on((`g`.`OWNER_THREAD_ID` = `gs`.`THREAD_ID`))) left join `performance_schema`.`events_statements_current` `ps` on((`p`.`OWNER_THREAD_ID` = `ps`.`THREAD_ID`))) where (`g`.`OBJECT_TYPE` = 'TABLE');

-- Dumping structure for view sys.schema_table_statistics
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_table_statistics`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_table_statistics` (`table_schema`,`table_name`,`total_latency`,`rows_fetched`,`fetch_latency`,`rows_inserted`,`insert_latency`,`rows_updated`,`update_latency`,`rows_deleted`,`delete_latency`,`io_read_requests`,`io_read`,`io_read_latency`,`io_write_requests`,`io_write`,`io_write_latency`,`io_misc_requests`,`io_misc_latency`) AS select `pst`.`OBJECT_SCHEMA` AS `table_schema`,`pst`.`OBJECT_NAME` AS `table_name`,`sys`.`format_time`(`pst`.`SUM_TIMER_WAIT`) AS `total_latency`,`pst`.`COUNT_FETCH` AS `rows_fetched`,`sys`.`format_time`(`pst`.`SUM_TIMER_FETCH`) AS `fetch_latency`,`pst`.`COUNT_INSERT` AS `rows_inserted`,`sys`.`format_time`(`pst`.`SUM_TIMER_INSERT`) AS `insert_latency`,`pst`.`COUNT_UPDATE` AS `rows_updated`,`sys`.`format_time`(`pst`.`SUM_TIMER_UPDATE`) AS `update_latency`,`pst`.`COUNT_DELETE` AS `rows_deleted`,`sys`.`format_time`(`pst`.`SUM_TIMER_DELETE`) AS `delete_latency`,`fsbi`.`count_read` AS `io_read_requests`,`sys`.`format_bytes`(`fsbi`.`sum_number_of_bytes_read`) AS `io_read`,`sys`.`format_time`(`fsbi`.`sum_timer_read`) AS `io_read_latency`,`fsbi`.`count_write` AS `io_write_requests`,`sys`.`format_bytes`(`fsbi`.`sum_number_of_bytes_write`) AS `io_write`,`sys`.`format_time`(`fsbi`.`sum_timer_write`) AS `io_write_latency`,`fsbi`.`count_misc` AS `io_misc_requests`,`sys`.`format_time`(`fsbi`.`sum_timer_misc`) AS `io_misc_latency` from (`performance_schema`.`table_io_waits_summary_by_table` `pst` left join `sys`.`x$ps_schema_table_statistics_io` `fsbi` on(((`pst`.`OBJECT_SCHEMA` = `fsbi`.`table_schema`) and (`pst`.`OBJECT_NAME` = `fsbi`.`table_name`)))) order by `pst`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.schema_table_statistics_with_buffer
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_table_statistics_with_buffer`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_table_statistics_with_buffer` (`table_schema`,`table_name`,`rows_fetched`,`fetch_latency`,`rows_inserted`,`insert_latency`,`rows_updated`,`update_latency`,`rows_deleted`,`delete_latency`,`io_read_requests`,`io_read`,`io_read_latency`,`io_write_requests`,`io_write`,`io_write_latency`,`io_misc_requests`,`io_misc_latency`,`innodb_buffer_allocated`,`innodb_buffer_data`,`innodb_buffer_free`,`innodb_buffer_pages`,`innodb_buffer_pages_hashed`,`innodb_buffer_pages_old`,`innodb_buffer_rows_cached`) AS select `pst`.`OBJECT_SCHEMA` AS `table_schema`,`pst`.`OBJECT_NAME` AS `table_name`,`pst`.`COUNT_FETCH` AS `rows_fetched`,`sys`.`format_time`(`pst`.`SUM_TIMER_FETCH`) AS `fetch_latency`,`pst`.`COUNT_INSERT` AS `rows_inserted`,`sys`.`format_time`(`pst`.`SUM_TIMER_INSERT`) AS `insert_latency`,`pst`.`COUNT_UPDATE` AS `rows_updated`,`sys`.`format_time`(`pst`.`SUM_TIMER_UPDATE`) AS `update_latency`,`pst`.`COUNT_DELETE` AS `rows_deleted`,`sys`.`format_time`(`pst`.`SUM_TIMER_DELETE`) AS `delete_latency`,`fsbi`.`count_read` AS `io_read_requests`,`sys`.`format_bytes`(`fsbi`.`sum_number_of_bytes_read`) AS `io_read`,`sys`.`format_time`(`fsbi`.`sum_timer_read`) AS `io_read_latency`,`fsbi`.`count_write` AS `io_write_requests`,`sys`.`format_bytes`(`fsbi`.`sum_number_of_bytes_write`) AS `io_write`,`sys`.`format_time`(`fsbi`.`sum_timer_write`) AS `io_write_latency`,`fsbi`.`count_misc` AS `io_misc_requests`,`sys`.`format_time`(`fsbi`.`sum_timer_misc`) AS `io_misc_latency`,`sys`.`format_bytes`(`ibp`.`allocated`) AS `innodb_buffer_allocated`,`sys`.`format_bytes`(`ibp`.`data`) AS `innodb_buffer_data`,`sys`.`format_bytes`((`ibp`.`allocated` - `ibp`.`data`)) AS `innodb_buffer_free`,`ibp`.`pages` AS `innodb_buffer_pages`,`ibp`.`pages_hashed` AS `innodb_buffer_pages_hashed`,`ibp`.`pages_old` AS `innodb_buffer_pages_old`,`ibp`.`rows_cached` AS `innodb_buffer_rows_cached` from ((`performance_schema`.`table_io_waits_summary_by_table` `pst` left join `sys`.`x$ps_schema_table_statistics_io` `fsbi` on(((`pst`.`OBJECT_SCHEMA` = `fsbi`.`table_schema`) and (`pst`.`OBJECT_NAME` = `fsbi`.`table_name`)))) left join `sys`.`x$innodb_buffer_stats_by_table` `ibp` on(((`pst`.`OBJECT_SCHEMA` = convert(`ibp`.`object_schema` using utf8mb4)) and (`pst`.`OBJECT_NAME` = convert(`ibp`.`object_name` using utf8mb4))))) order by `pst`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.schema_unused_indexes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `schema_unused_indexes`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`schema_unused_indexes` (`object_schema`,`object_name`,`index_name`) AS select `t`.`OBJECT_SCHEMA` AS `object_schema`,`t`.`OBJECT_NAME` AS `object_name`,`t`.`INDEX_NAME` AS `index_name` from (`performance_schema`.`table_io_waits_summary_by_index_usage` `t` join `information_schema`.`STATISTICS` `s` on(((convert(`t`.`OBJECT_SCHEMA` using utf8) = `s`.`TABLE_SCHEMA`) and (convert(`t`.`OBJECT_NAME` using utf8) = `s`.`TABLE_NAME`) and (convert(`t`.`INDEX_NAME` using utf8) = `s`.`INDEX_NAME`)))) where ((`t`.`INDEX_NAME` is not null) and (`t`.`COUNT_STAR` = 0) and (`t`.`OBJECT_SCHEMA` <> 'mysql') and (`t`.`INDEX_NAME` <> 'PRIMARY') and (`s`.`NON_UNIQUE` = 1) and (`s`.`SEQ_IN_INDEX` = 1)) order by `t`.`OBJECT_SCHEMA`,`t`.`OBJECT_NAME`;

-- Dumping structure for view sys.session
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `session`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`session` AS select `processlist`.`thd_id` AS `thd_id`,`processlist`.`conn_id` AS `conn_id`,`processlist`.`user` AS `user`,`processlist`.`db` AS `db`,`processlist`.`command` AS `command`,`processlist`.`state` AS `state`,`processlist`.`time` AS `time`,`processlist`.`current_statement` AS `current_statement`,`processlist`.`statement_latency` AS `statement_latency`,`processlist`.`progress` AS `progress`,`processlist`.`lock_latency` AS `lock_latency`,`processlist`.`rows_examined` AS `rows_examined`,`processlist`.`rows_sent` AS `rows_sent`,`processlist`.`rows_affected` AS `rows_affected`,`processlist`.`tmp_tables` AS `tmp_tables`,`processlist`.`tmp_disk_tables` AS `tmp_disk_tables`,`processlist`.`full_scan` AS `full_scan`,`processlist`.`last_statement` AS `last_statement`,`processlist`.`last_statement_latency` AS `last_statement_latency`,`processlist`.`current_memory` AS `current_memory`,`processlist`.`last_wait` AS `last_wait`,`processlist`.`last_wait_latency` AS `last_wait_latency`,`processlist`.`source` AS `source`,`processlist`.`trx_latency` AS `trx_latency`,`processlist`.`trx_state` AS `trx_state`,`processlist`.`trx_autocommit` AS `trx_autocommit`,`processlist`.`pid` AS `pid`,`processlist`.`program_name` AS `program_name` from `sys`.`processlist` where ((`processlist`.`conn_id` is not null) and (`processlist`.`command` <> 'Daemon'));

-- Dumping structure for view sys.session_ssl_status
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `session_ssl_status`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`session_ssl_status` (`thread_id`,`ssl_version`,`ssl_cipher`,`ssl_sessions_reused`) AS select `sslver`.`THREAD_ID` AS `thread_id`,`sslver`.`VARIABLE_VALUE` AS `ssl_version`,`sslcip`.`VARIABLE_VALUE` AS `ssl_cipher`,`sslreuse`.`VARIABLE_VALUE` AS `ssl_sessions_reused` from ((`performance_schema`.`status_by_thread` `sslver` left join `performance_schema`.`status_by_thread` `sslcip` on(((`sslcip`.`THREAD_ID` = `sslver`.`THREAD_ID`) and (`sslcip`.`VARIABLE_NAME` = 'Ssl_cipher')))) left join `performance_schema`.`status_by_thread` `sslreuse` on(((`sslreuse`.`THREAD_ID` = `sslver`.`THREAD_ID`) and (`sslreuse`.`VARIABLE_NAME` = 'Ssl_sessions_reused')))) where (`sslver`.`VARIABLE_NAME` = 'Ssl_version');

-- Dumping structure for view sys.statements_with_errors_or_warnings
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `statements_with_errors_or_warnings`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`statements_with_errors_or_warnings` (`query`,`db`,`exec_count`,`errors`,`error_pct`,`warnings`,`warning_pct`,`first_seen`,`last_seen`,`digest`) AS select `sys`.`format_statement`(`performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT`) AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` AS `errors`,(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100) AS `error_pct`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` AS `warnings`,(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100) AS `warning_pct`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where ((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` > 0) or (`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` > 0)) order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` desc,`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` desc;

-- Dumping structure for view sys.statements_with_full_table_scans
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `statements_with_full_table_scans`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`statements_with_full_table_scans` (`query`,`db`,`exec_count`,`total_latency`,`no_index_used_count`,`no_good_index_used_count`,`no_index_used_pct`,`rows_sent`,`rows_examined`,`rows_sent_avg`,`rows_examined_avg`,`first_seen`,`last_seen`,`digest`) AS select `sys`.`format_statement`(`performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT`) AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT`) AS `total_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` AS `no_index_used_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_GOOD_INDEX_USED` AS `no_good_index_used_count`,round((ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100),0) AS `no_index_used_pct`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` AS `rows_sent`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` AS `rows_examined`,round((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` / `performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`),0) AS `rows_sent_avg`,round((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` / `performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`),0) AS `rows_examined_avg`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where (((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` > 0) or (`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_GOOD_INDEX_USED` > 0)) and (not((`performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` like 'SHOW%')))) order by round((ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100),0) desc,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.statements_with_runtimes_in_95th_percentile
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `statements_with_runtimes_in_95th_percentile`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`statements_with_runtimes_in_95th_percentile` (`query`,`db`,`full_scan`,`exec_count`,`err_count`,`warn_count`,`total_latency`,`max_latency`,`avg_latency`,`rows_sent`,`rows_sent_avg`,`rows_examined`,`rows_examined_avg`,`first_seen`,`last_seen`,`digest`) AS select `sys`.`format_statement`(`stmts`.`DIGEST_TEXT`) AS `query`,`stmts`.`SCHEMA_NAME` AS `db`,if(((`stmts`.`SUM_NO_GOOD_INDEX_USED` > 0) or (`stmts`.`SUM_NO_INDEX_USED` > 0)),'*','') AS `full_scan`,`stmts`.`COUNT_STAR` AS `exec_count`,`stmts`.`SUM_ERRORS` AS `err_count`,`stmts`.`SUM_WARNINGS` AS `warn_count`,`sys`.`format_time`(`stmts`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`stmts`.`MAX_TIMER_WAIT`) AS `max_latency`,`sys`.`format_time`(`stmts`.`AVG_TIMER_WAIT`) AS `avg_latency`,`stmts`.`SUM_ROWS_SENT` AS `rows_sent`,round(ifnull((`stmts`.`SUM_ROWS_SENT` / nullif(`stmts`.`COUNT_STAR`,0)),0),0) AS `rows_sent_avg`,`stmts`.`SUM_ROWS_EXAMINED` AS `rows_examined`,round(ifnull((`stmts`.`SUM_ROWS_EXAMINED` / nullif(`stmts`.`COUNT_STAR`,0)),0),0) AS `rows_examined_avg`,`stmts`.`FIRST_SEEN` AS `first_seen`,`stmts`.`LAST_SEEN` AS `last_seen`,`stmts`.`DIGEST` AS `digest` from (`performance_schema`.`events_statements_summary_by_digest` `stmts` join `sys`.`x$ps_digest_95th_percentile_by_avg_us` `top_percentile` on((round((`stmts`.`AVG_TIMER_WAIT` / 1000000),0) >= `top_percentile`.`avg_us`))) order by `stmts`.`AVG_TIMER_WAIT` desc;

-- Dumping structure for view sys.statements_with_sorting
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `statements_with_sorting`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`statements_with_sorting` (`query`,`db`,`exec_count`,`total_latency`,`sort_merge_passes`,`avg_sort_merges`,`sorts_using_scans`,`sort_using_range`,`rows_sorted`,`avg_rows_sorted`,`first_seen`,`last_seen`,`digest`) AS select `sys`.`format_statement`(`performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT`) AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT`) AS `total_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_MERGE_PASSES` AS `sort_merge_passes`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_MERGE_PASSES` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `avg_sort_merges`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_SCAN` AS `sorts_using_scans`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_RANGE` AS `sort_using_range`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` AS `rows_sorted`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `avg_rows_sorted`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where (`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` > 0) order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.statements_with_temp_tables
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `statements_with_temp_tables`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`statements_with_temp_tables` (`query`,`db`,`exec_count`,`total_latency`,`memory_tmp_tables`,`disk_tmp_tables`,`avg_tmp_tables_per_query`,`tmp_tables_to_disk_pct`,`first_seen`,`last_seen`,`digest`) AS select `sys`.`format_statement`(`performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT`) AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT`) AS `total_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` AS `memory_tmp_tables`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` AS `disk_tmp_tables`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `avg_tmp_tables_per_query`,round((ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES`,0)),0) * 100),0) AS `tmp_tables_to_disk_pct`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where (`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` > 0) order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` desc,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` desc;

-- Dumping structure for view sys.statement_analysis
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `statement_analysis`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`statement_analysis` (`query`,`db`,`full_scan`,`exec_count`,`err_count`,`warn_count`,`total_latency`,`max_latency`,`avg_latency`,`lock_latency`,`rows_sent`,`rows_sent_avg`,`rows_examined`,`rows_examined_avg`,`rows_affected`,`rows_affected_avg`,`tmp_tables`,`tmp_disk_tables`,`rows_sorted`,`sort_merge_passes`,`digest`,`first_seen`,`last_seen`) AS select `sys`.`format_statement`(`performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT`) AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,if(((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_GOOD_INDEX_USED` > 0) or (`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` > 0)),'*','') AS `full_scan`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` AS `err_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` AS `warn_count`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`MAX_TIMER_WAIT`) AS `max_latency`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`AVG_TIMER_WAIT`) AS `avg_latency`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_digest`.`SUM_LOCK_TIME`) AS `lock_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` AS `rows_sent`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `rows_sent_avg`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` AS `rows_examined`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `rows_examined_avg`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_AFFECTED` AS `rows_affected`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_AFFECTED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `rows_affected_avg`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` AS `tmp_tables`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` AS `tmp_disk_tables`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` AS `rows_sorted`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_MERGE_PASSES` AS `sort_merge_passes`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen` from `performance_schema`.`events_statements_summary_by_digest` order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.user_summary
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `user_summary`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`user_summary` (`user`,`statements`,`statement_latency`,`statement_avg_latency`,`table_scans`,`file_ios`,`file_io_latency`,`current_connections`,`total_connections`,`unique_hosts`,`current_memory`,`total_memory_allocated`) AS select if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) AS `user`,sum(`stmt`.`total`) AS `statements`,`sys`.`format_time`(sum(`stmt`.`total_latency`)) AS `statement_latency`,`sys`.`format_time`(ifnull((sum(`stmt`.`total_latency`) / nullif(sum(`stmt`.`total`),0)),0)) AS `statement_avg_latency`,sum(`stmt`.`full_scans`) AS `table_scans`,sum(`io`.`ios`) AS `file_ios`,`sys`.`format_time`(sum(`io`.`io_latency`)) AS `file_io_latency`,sum(`performance_schema`.`accounts`.`CURRENT_CONNECTIONS`) AS `current_connections`,sum(`performance_schema`.`accounts`.`TOTAL_CONNECTIONS`) AS `total_connections`,count(distinct `performance_schema`.`accounts`.`HOST`) AS `unique_hosts`,`sys`.`format_bytes`(sum(`mem`.`current_allocated`)) AS `current_memory`,`sys`.`format_bytes`(sum(`mem`.`total_allocated`)) AS `total_memory_allocated` from (((`performance_schema`.`accounts` left join `sys`.`x$user_summary_by_statement_latency` `stmt` on((if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) = `stmt`.`user`))) left join `sys`.`x$user_summary_by_file_io` `io` on((if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) = `io`.`user`))) left join `sys`.`x$memory_by_user_by_current_bytes` `mem` on((if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) = `mem`.`user`))) group by if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) order by sum(`stmt`.`total_latency`) desc;

-- Dumping structure for view sys.user_summary_by_file_io
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `user_summary_by_file_io`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`user_summary_by_file_io` (`user`,`ios`,`io_latency`) AS select if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) AS `user`,sum(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR`) AS `ios`,`sys`.`format_time`(sum(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`)) AS `io_latency` from `performance_schema`.`events_waits_summary_by_user_by_event_name` where (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') group by if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) order by sum(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.user_summary_by_file_io_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `user_summary_by_file_io_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`user_summary_by_file_io_type` (`user`,`event_name`,`total`,`latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) AS `user`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) AS `latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency` from `performance_schema`.`events_waits_summary_by_user_by_event_name` where ((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` like 'wait/io/file%') and (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR` > 0)) order by if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.user_summary_by_stages
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `user_summary_by_stages`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`user_summary_by_stages` (`user`,`event_name`,`total`,`total_latency`,`avg_latency`) AS select if((`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER`) AS `user`,`performance_schema`.`events_stages_summary_by_user_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_stages_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_stages_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_stages_summary_by_user_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency` from `performance_schema`.`events_stages_summary_by_user_by_event_name` where (`performance_schema`.`events_stages_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_stages_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.user_summary_by_statement_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `user_summary_by_statement_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`user_summary_by_statement_latency` (`user`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`) AS `user`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`COUNT_STAR`) AS `total`,`sys`.`format_time`(sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`)) AS `total_latency`,`sys`.`format_time`(sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`MAX_TIMER_WAIT`)) AS `max_latency`,`sys`.`format_time`(sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_LOCK_TIME`)) AS `lock_latency`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_SENT`) AS `rows_sent`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_EXAMINED`) AS `rows_examined`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_AFFECTED`) AS `rows_affected`,(sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_INDEX_USED`) + sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_GOOD_INDEX_USED`)) AS `full_scans` from `performance_schema`.`events_statements_summary_by_user_by_event_name` group by if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`) order by sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.user_summary_by_statement_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `user_summary_by_statement_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`user_summary_by_statement_type` (`user`,`statement`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`) AS `user`,substring_index(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`EVENT_NAME`,'/',-(1)) AS `statement`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency`,`sys`.`format_time`(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_LOCK_TIME`) AS `lock_latency`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_SENT` AS `rows_sent`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_EXAMINED` AS `rows_examined`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_AFFECTED` AS `rows_affected`,(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_INDEX_USED` + `performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_GOOD_INDEX_USED`) AS `full_scans` from `performance_schema`.`events_statements_summary_by_user_by_event_name` where (`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.version
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `version`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`version` (`sys_version`,`mysql_version`) AS select '2.1.1' AS `sys_version`,version() AS `mysql_version`;

-- Dumping structure for view sys.waits_by_host_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `waits_by_host_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`waits_by_host_by_latency` (`host`,`event`,`total`,`total_latency`,`avg_latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) AS `host`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` AS `event`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency` from `performance_schema`.`events_waits_summary_by_host_by_event_name` where ((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` <> 'idle') and (`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` > 0)) order by if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.waits_by_user_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `waits_by_user_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`waits_by_user_by_latency` (`user`,`event`,`total`,`total_latency`,`avg_latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) AS `user`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` AS `event`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency` from `performance_schema`.`events_waits_summary_by_user_by_event_name` where ((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` <> 'idle') and (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is not null) and (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` > 0)) order by if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.waits_global_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `waits_global_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`waits_global_by_latency` (`events`,`total`,`total_latency`,`avg_latency`,`max_latency`) AS select `performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` AS `event`,`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR` AS `total`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_global_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency`,`sys`.`format_time`(`performance_schema`.`events_waits_summary_global_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency` from `performance_schema`.`events_waits_summary_global_by_event_name` where ((`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` <> 'idle') and (`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` > 0)) order by `performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.wait_classes_global_by_avg_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `wait_classes_global_by_avg_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`wait_classes_global_by_avg_latency` (`event_class`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`) AS select substring_index(`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME`,'/',3) AS `event_class`,sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`) AS `total`,`sys`.`format_time`(cast(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) as unsigned)) AS `total_latency`,`sys`.`format_time`(min(`performance_schema`.`events_waits_summary_global_by_event_name`.`MIN_TIMER_WAIT`)) AS `min_latency`,`sys`.`format_time`(ifnull((sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) / nullif(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`),0)),0)) AS `avg_latency`,`sys`.`format_time`(cast(max(`performance_schema`.`events_waits_summary_global_by_event_name`.`MAX_TIMER_WAIT`) as unsigned)) AS `max_latency` from `performance_schema`.`events_waits_summary_global_by_event_name` where ((`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` > 0) and (`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` <> 'idle')) group by `event_class` order by ifnull((sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) / nullif(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`),0)),0) desc;

-- Dumping structure for view sys.wait_classes_global_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `wait_classes_global_by_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`wait_classes_global_by_latency` (`event_class`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`) AS select substring_index(`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME`,'/',3) AS `event_class`,sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`) AS `total`,`sys`.`format_time`(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`)) AS `total_latency`,`sys`.`format_time`(min(`performance_schema`.`events_waits_summary_global_by_event_name`.`MIN_TIMER_WAIT`)) AS `min_latency`,`sys`.`format_time`(ifnull((sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) / nullif(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`),0)),0)) AS `avg_latency`,`sys`.`format_time`(max(`performance_schema`.`events_waits_summary_global_by_event_name`.`MAX_TIMER_WAIT`)) AS `max_latency` from `performance_schema`.`events_waits_summary_global_by_event_name` where ((`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` > 0) and (`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` <> 'idle')) group by substring_index(`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME`,'/',3) order by sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.x$host_summary
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$host_summary`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$host_summary` (`host`,`statements`,`statement_latency`,`statement_avg_latency`,`table_scans`,`file_ios`,`file_io_latency`,`current_connections`,`total_connections`,`unique_users`,`current_memory`,`total_memory_allocated`) AS select if((`performance_schema`.`accounts`.`HOST` is null),'background',`performance_schema`.`accounts`.`HOST`) AS `host`,sum(`stmt`.`total`) AS `statements`,sum(`stmt`.`total_latency`) AS `statement_latency`,(sum(`stmt`.`total_latency`) / sum(`stmt`.`total`)) AS `statement_avg_latency`,sum(`stmt`.`full_scans`) AS `table_scans`,sum(`io`.`ios`) AS `file_ios`,sum(`io`.`io_latency`) AS `file_io_latency`,sum(`performance_schema`.`accounts`.`CURRENT_CONNECTIONS`) AS `current_connections`,sum(`performance_schema`.`accounts`.`TOTAL_CONNECTIONS`) AS `total_connections`,count(distinct `performance_schema`.`accounts`.`USER`) AS `unique_users`,sum(`mem`.`current_allocated`) AS `current_memory`,sum(`mem`.`total_allocated`) AS `total_memory_allocated` from (((`performance_schema`.`accounts` join `sys`.`x$host_summary_by_statement_latency` `stmt` on((`performance_schema`.`accounts`.`HOST` = `stmt`.`host`))) join `sys`.`x$host_summary_by_file_io` `io` on((`performance_schema`.`accounts`.`HOST` = `io`.`host`))) join `sys`.`x$memory_by_host_by_current_bytes` `mem` on((`performance_schema`.`accounts`.`HOST` = `mem`.`host`))) group by if((`performance_schema`.`accounts`.`HOST` is null),'background',`performance_schema`.`accounts`.`HOST`);

-- Dumping structure for view sys.x$host_summary_by_file_io
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$host_summary_by_file_io`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$host_summary_by_file_io` (`host`,`ios`,`io_latency`) AS select if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) AS `host`,sum(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR`) AS `ios`,sum(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) AS `io_latency` from `performance_schema`.`events_waits_summary_by_host_by_event_name` where (`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') group by if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) order by sum(`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.x$host_summary_by_file_io_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$host_summary_by_file_io_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$host_summary_by_file_io_type` (`host`,`event_name`,`total`,`total_latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) AS `host`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency` from `performance_schema`.`events_waits_summary_by_host_by_event_name` where ((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` like 'wait/io/file%') and (`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR` > 0)) order by if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$host_summary_by_stages
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$host_summary_by_stages`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$host_summary_by_stages` (`host`,`event_name`,`total`,`total_latency`,`avg_latency`) AS select if((`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST`) AS `host`,`performance_schema`.`events_stages_summary_by_host_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_stages_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_stages_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_stages_summary_by_host_by_event_name`.`AVG_TIMER_WAIT` AS `avg_latency` from `performance_schema`.`events_stages_summary_by_host_by_event_name` where (`performance_schema`.`events_stages_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_stages_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_stages_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$host_summary_by_statement_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$host_summary_by_statement_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$host_summary_by_statement_latency` (`host`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`) AS `host`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`COUNT_STAR`) AS `total`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,max(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_LOCK_TIME`) AS `lock_latency`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_SENT`) AS `rows_sent`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_EXAMINED`) AS `rows_examined`,sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_AFFECTED`) AS `rows_affected`,(sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_INDEX_USED`) + sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_GOOD_INDEX_USED`)) AS `full_scans` from `performance_schema`.`events_statements_summary_by_host_by_event_name` group by if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`) order by sum(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.x$host_summary_by_statement_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$host_summary_by_statement_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$host_summary_by_statement_type` (`host`,`statement`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`) AS `host`,substring_index(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`EVENT_NAME`,'/',-(1)) AS `statement`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_LOCK_TIME` AS `lock_latency`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_SENT` AS `rows_sent`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_EXAMINED` AS `rows_examined`,`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_ROWS_AFFECTED` AS `rows_affected`,(`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_INDEX_USED` + `performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_NO_GOOD_INDEX_USED`) AS `full_scans` from `performance_schema`.`events_statements_summary_by_host_by_event_name` where (`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_statements_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_statements_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$innodb_buffer_stats_by_schema
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$innodb_buffer_stats_by_schema`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$innodb_buffer_stats_by_schema` (`object_schema`,`allocated`,`data`,`pages`,`pages_hashed`,`pages_old`,`rows_cached`) AS select if((locate('.',`ibp`.`TABLE_NAME`) = 0),'InnoDB System',replace(substring_index(`ibp`.`TABLE_NAME`,'.',1),'`','')) AS `object_schema`,sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`)) AS `allocated`,sum(`ibp`.`DATA_SIZE`) AS `data`,count(`ibp`.`PAGE_NUMBER`) AS `pages`,count(if((`ibp`.`IS_HASHED` = 'YES'),1,NULL)) AS `pages_hashed`,count(if((`ibp`.`IS_OLD` = 'YES'),1,NULL)) AS `pages_old`,round(ifnull((sum(`ibp`.`NUMBER_RECORDS`) / nullif(count(distinct `ibp`.`INDEX_NAME`),0)),0),0) AS `rows_cached` from `information_schema`.`INNODB_BUFFER_PAGE` `ibp` where (`ibp`.`TABLE_NAME` is not null) group by `object_schema` order by sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`)) desc;

-- Dumping structure for view sys.x$innodb_buffer_stats_by_table
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$innodb_buffer_stats_by_table`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$innodb_buffer_stats_by_table` (`object_schema`,`object_name`,`allocated`,`data`,`pages`,`pages_hashed`,`pages_old`,`rows_cached`) AS select if((locate('.',`ibp`.`TABLE_NAME`) = 0),'InnoDB System',replace(substring_index(`ibp`.`TABLE_NAME`,'.',1),'`','')) AS `object_schema`,replace(substring_index(`ibp`.`TABLE_NAME`,'.',-(1)),'`','') AS `object_name`,sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`)) AS `allocated`,sum(`ibp`.`DATA_SIZE`) AS `data`,count(`ibp`.`PAGE_NUMBER`) AS `pages`,count(if((`ibp`.`IS_HASHED` = 'YES'),1,NULL)) AS `pages_hashed`,count(if((`ibp`.`IS_OLD` = 'YES'),1,NULL)) AS `pages_old`,round(ifnull((sum(`ibp`.`NUMBER_RECORDS`) / nullif(count(distinct `ibp`.`INDEX_NAME`),0)),0),0) AS `rows_cached` from `information_schema`.`INNODB_BUFFER_PAGE` `ibp` where (`ibp`.`TABLE_NAME` is not null) group by `object_schema`,`object_name` order by sum(if((`ibp`.`COMPRESSED_SIZE` = 0),16384,`ibp`.`COMPRESSED_SIZE`)) desc;

-- Dumping structure for view sys.x$innodb_lock_waits
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$innodb_lock_waits`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$innodb_lock_waits` (`wait_started`,`wait_age`,`wait_age_secs`,`locked_table`,`locked_table_schema`,`locked_table_name`,`locked_table_partition`,`locked_table_subpartition`,`locked_index`,`locked_type`,`waiting_trx_id`,`waiting_trx_started`,`waiting_trx_age`,`waiting_trx_rows_locked`,`waiting_trx_rows_modified`,`waiting_pid`,`waiting_query`,`waiting_lock_id`,`waiting_lock_mode`,`blocking_trx_id`,`blocking_pid`,`blocking_query`,`blocking_lock_id`,`blocking_lock_mode`,`blocking_trx_started`,`blocking_trx_age`,`blocking_trx_rows_locked`,`blocking_trx_rows_modified`,`sql_kill_blocking_query`,`sql_kill_blocking_connection`) AS select `r`.`trx_wait_started` AS `wait_started`,timediff(now(),`r`.`trx_wait_started`) AS `wait_age`,timestampdiff(SECOND,`r`.`trx_wait_started`,now()) AS `wait_age_secs`,concat(`sys`.`quote_identifier`(`rl`.`OBJECT_SCHEMA`),'.',`sys`.`quote_identifier`(`rl`.`OBJECT_NAME`)) AS `locked_table`,`rl`.`OBJECT_SCHEMA` AS `locked_table_schema`,`rl`.`OBJECT_NAME` AS `locked_table_name`,`rl`.`PARTITION_NAME` AS `locked_table_partition`,`rl`.`SUBPARTITION_NAME` AS `locked_table_subpartition`,`rl`.`INDEX_NAME` AS `locked_index`,`rl`.`LOCK_TYPE` AS `locked_type`,`r`.`trx_id` AS `waiting_trx_id`,`r`.`trx_started` AS `waiting_trx_started`,timediff(now(),`r`.`trx_started`) AS `waiting_trx_age`,`r`.`trx_rows_locked` AS `waiting_trx_rows_locked`,`r`.`trx_rows_modified` AS `waiting_trx_rows_modified`,`r`.`trx_mysql_thread_id` AS `waiting_pid`,`r`.`trx_query` AS `waiting_query`,`rl`.`ENGINE_LOCK_ID` AS `waiting_lock_id`,`rl`.`LOCK_MODE` AS `waiting_lock_mode`,`b`.`trx_id` AS `blocking_trx_id`,`b`.`trx_mysql_thread_id` AS `blocking_pid`,`b`.`trx_query` AS `blocking_query`,`bl`.`ENGINE_LOCK_ID` AS `blocking_lock_id`,`bl`.`LOCK_MODE` AS `blocking_lock_mode`,`b`.`trx_started` AS `blocking_trx_started`,timediff(now(),`b`.`trx_started`) AS `blocking_trx_age`,`b`.`trx_rows_locked` AS `blocking_trx_rows_locked`,`b`.`trx_rows_modified` AS `blocking_trx_rows_modified`,concat('KILL QUERY ',`b`.`trx_mysql_thread_id`) AS `sql_kill_blocking_query`,concat('KILL ',`b`.`trx_mysql_thread_id`) AS `sql_kill_blocking_connection` from ((((`performance_schema`.`data_lock_waits` `w` join `information_schema`.`INNODB_TRX` `b` on((convert(`b`.`trx_id` using utf8mb4) = cast(`w`.`BLOCKING_ENGINE_TRANSACTION_ID` as char charset utf8mb4)))) join `information_schema`.`INNODB_TRX` `r` on((convert(`r`.`trx_id` using utf8mb4) = cast(`w`.`REQUESTING_ENGINE_TRANSACTION_ID` as char charset utf8mb4)))) join `performance_schema`.`data_locks` `bl` on((`bl`.`ENGINE_LOCK_ID` = `w`.`BLOCKING_ENGINE_LOCK_ID`))) join `performance_schema`.`data_locks` `rl` on((`rl`.`ENGINE_LOCK_ID` = `w`.`REQUESTING_ENGINE_LOCK_ID`))) order by `r`.`trx_wait_started`;

-- Dumping structure for view sys.x$io_by_thread_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$io_by_thread_by_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$io_by_thread_by_latency` (`user`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`,`thread_id`,`processlist_id`) AS select if((`performance_schema`.`threads`.`PROCESSLIST_ID` is null),substring_index(`performance_schema`.`threads`.`NAME`,'/',-(1)),concat(`performance_schema`.`threads`.`PROCESSLIST_USER`,'@',convert(`performance_schema`.`threads`.`PROCESSLIST_HOST` using utf8mb4))) AS `user`,sum(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`COUNT_STAR`) AS `total`,sum(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,min(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`MIN_TIMER_WAIT`) AS `min_latency`,avg(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`AVG_TIMER_WAIT`) AS `avg_latency`,max(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency`,`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`THREAD_ID` AS `thread_id`,`performance_schema`.`threads`.`PROCESSLIST_ID` AS `processlist_id` from (`performance_schema`.`events_waits_summary_by_thread_by_event_name` left join `performance_schema`.`threads` on((`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`THREAD_ID` = `performance_schema`.`threads`.`THREAD_ID`))) where ((`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') and (`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`SUM_TIMER_WAIT` > 0)) group by `performance_schema`.`events_waits_summary_by_thread_by_event_name`.`THREAD_ID`,`performance_schema`.`threads`.`PROCESSLIST_ID`,`user` order by sum(`performance_schema`.`events_waits_summary_by_thread_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.x$io_global_by_file_by_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$io_global_by_file_by_bytes`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$io_global_by_file_by_bytes` (`file`,`count_read`,`total_read`,`avg_read`,`count_write`,`total_written`,`avg_write`,`total`,`write_pct`) AS select `performance_schema`.`file_summary_by_instance`.`FILE_NAME` AS `file`,`performance_schema`.`file_summary_by_instance`.`COUNT_READ` AS `count_read`,`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` AS `total_read`,ifnull((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` / nullif(`performance_schema`.`file_summary_by_instance`.`COUNT_READ`,0)),0) AS `avg_read`,`performance_schema`.`file_summary_by_instance`.`COUNT_WRITE` AS `count_write`,`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE` AS `total_written`,ifnull((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE` / nullif(`performance_schema`.`file_summary_by_instance`.`COUNT_WRITE`,0)),0.00) AS `avg_write`,(`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` + `performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`) AS `total`,ifnull(round((100 - ((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` / nullif((`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` + `performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`),0)) * 100)),2),0.00) AS `write_pct` from `performance_schema`.`file_summary_by_instance` order by (`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ` + `performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`) desc;

-- Dumping structure for view sys.x$io_global_by_file_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$io_global_by_file_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$io_global_by_file_by_latency` (`file`,`total`,`total_latency`,`count_read`,`read_latency`,`count_write`,`write_latency`,`count_misc`,`misc_latency`) AS select `performance_schema`.`file_summary_by_instance`.`FILE_NAME` AS `file`,`performance_schema`.`file_summary_by_instance`.`COUNT_STAR` AS `total`,`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`file_summary_by_instance`.`COUNT_READ` AS `count_read`,`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_READ` AS `read_latency`,`performance_schema`.`file_summary_by_instance`.`COUNT_WRITE` AS `count_write`,`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_WRITE` AS `write_latency`,`performance_schema`.`file_summary_by_instance`.`COUNT_MISC` AS `count_misc`,`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_MISC` AS `misc_latency` from `performance_schema`.`file_summary_by_instance` order by `performance_schema`.`file_summary_by_instance`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$io_global_by_wait_by_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$io_global_by_wait_by_bytes`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$io_global_by_wait_by_bytes` (`event_name`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`,`count_read`,`total_read`,`avg_read`,`count_write`,`total_written`,`avg_written`,`total_requested`) AS select substring_index(`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME`,'/',-(2)) AS `event_name`,`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`file_summary_by_event_name`.`MIN_TIMER_WAIT` AS `min_latency`,`performance_schema`.`file_summary_by_event_name`.`AVG_TIMER_WAIT` AS `avg_latency`,`performance_schema`.`file_summary_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency`,`performance_schema`.`file_summary_by_event_name`.`COUNT_READ` AS `count_read`,`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ` AS `total_read`,ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_READ`,0)),0) AS `avg_read`,`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE` AS `count_write`,`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` AS `total_written`,ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE`,0)),0) AS `avg_written`,(`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` + `performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ`) AS `total_requested` from `performance_schema`.`file_summary_by_event_name` where ((`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') and (`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` > 0)) order by (`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` + `performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ`) desc;

-- Dumping structure for view sys.x$io_global_by_wait_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$io_global_by_wait_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$io_global_by_wait_by_latency` (`event_name`,`total`,`total_latency`,`avg_latency`,`max_latency`,`read_latency`,`write_latency`,`misc_latency`,`count_read`,`total_read`,`avg_read`,`count_write`,`total_written`,`avg_written`) AS select substring_index(`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME`,'/',-(2)) AS `event_name`,`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`file_summary_by_event_name`.`AVG_TIMER_WAIT` AS `avg_latency`,`performance_schema`.`file_summary_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency`,`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_READ` AS `read_latency`,`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WRITE` AS `write_latency`,`performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_MISC` AS `misc_latency`,`performance_schema`.`file_summary_by_event_name`.`COUNT_READ` AS `count_read`,`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ` AS `total_read`,ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_READ` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_READ`,0)),0) AS `avg_read`,`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE` AS `count_write`,`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` AS `total_written`,ifnull((`performance_schema`.`file_summary_by_event_name`.`SUM_NUMBER_OF_BYTES_WRITE` / nullif(`performance_schema`.`file_summary_by_event_name`.`COUNT_WRITE`,0)),0) AS `avg_written` from `performance_schema`.`file_summary_by_event_name` where ((`performance_schema`.`file_summary_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') and (`performance_schema`.`file_summary_by_event_name`.`COUNT_STAR` > 0)) order by `performance_schema`.`file_summary_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$latest_file_io
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$latest_file_io`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$latest_file_io` (`thread`,`file`,`latency`,`operation`,`requested`) AS select if((`information_schema`.`processlist`.`ID` is null),concat(substring_index(`performance_schema`.`threads`.`NAME`,'/',-(1)),':',`performance_schema`.`events_waits_history_long`.`THREAD_ID`),convert(concat(`information_schema`.`processlist`.`USER`,'@',`information_schema`.`processlist`.`HOST`,':',`information_schema`.`processlist`.`ID`) using utf8mb4)) AS `thread`,`performance_schema`.`events_waits_history_long`.`OBJECT_NAME` AS `file`,`performance_schema`.`events_waits_history_long`.`TIMER_WAIT` AS `latency`,`performance_schema`.`events_waits_history_long`.`OPERATION` AS `operation`,`performance_schema`.`events_waits_history_long`.`NUMBER_OF_BYTES` AS `requested` from ((`performance_schema`.`events_waits_history_long` join `performance_schema`.`threads` on((`performance_schema`.`events_waits_history_long`.`THREAD_ID` = `performance_schema`.`threads`.`THREAD_ID`))) left join `information_schema`.`PROCESSLIST` on((`performance_schema`.`threads`.`PROCESSLIST_ID` = `information_schema`.`processlist`.`ID`))) where ((`performance_schema`.`events_waits_history_long`.`OBJECT_NAME` is not null) and (`performance_schema`.`events_waits_history_long`.`EVENT_NAME` like 'wait/io/file/%')) order by `performance_schema`.`events_waits_history_long`.`TIMER_START`;

-- Dumping structure for view sys.x$memory_by_host_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$memory_by_host_by_current_bytes`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$memory_by_host_by_current_bytes` (`host`,`current_count_used`,`current_allocated`,`current_avg_alloc`,`current_max_alloc`,`total_allocated`) AS select if((`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST`) AS `host`,sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_COUNT_USED`) AS `current_count_used`,sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `current_allocated`,ifnull((sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) / nullif(sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_COUNT_USED`),0)),0) AS `current_avg_alloc`,max(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `current_max_alloc`,sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`SUM_NUMBER_OF_BYTES_ALLOC`) AS `total_allocated` from `performance_schema`.`memory_summary_by_host_by_event_name` group by if((`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`memory_summary_by_host_by_event_name`.`HOST`) order by sum(`performance_schema`.`memory_summary_by_host_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) desc;

-- Dumping structure for view sys.x$memory_by_thread_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$memory_by_thread_by_current_bytes`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$memory_by_thread_by_current_bytes` (`thread_id`,`user`,`current_count_used`,`current_allocated`,`current_avg_alloc`,`current_max_alloc`,`total_allocated`) AS select `t`.`THREAD_ID` AS `thread_id`,if((`t`.`NAME` = 'thread/sql/one_connection'),concat(`t`.`PROCESSLIST_USER`,'@',convert(`t`.`PROCESSLIST_HOST` using utf8mb4)),replace(`t`.`NAME`,'thread/','')) AS `user`,sum(`mt`.`CURRENT_COUNT_USED`) AS `current_count_used`,sum(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `current_allocated`,ifnull((sum(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`) / nullif(sum(`mt`.`CURRENT_COUNT_USED`),0)),0) AS `current_avg_alloc`,max(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `current_max_alloc`,sum(`mt`.`SUM_NUMBER_OF_BYTES_ALLOC`) AS `total_allocated` from (`performance_schema`.`memory_summary_by_thread_by_event_name` `mt` join `performance_schema`.`threads` `t` on((`mt`.`THREAD_ID` = `t`.`THREAD_ID`))) group by `t`.`THREAD_ID`,if((`t`.`NAME` = 'thread/sql/one_connection'),concat(`t`.`PROCESSLIST_USER`,'@',convert(`t`.`PROCESSLIST_HOST` using utf8mb4)),replace(`t`.`NAME`,'thread/','')) order by sum(`mt`.`CURRENT_NUMBER_OF_BYTES_USED`) desc;

-- Dumping structure for view sys.x$memory_by_user_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$memory_by_user_by_current_bytes`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$memory_by_user_by_current_bytes` (`user`,`current_count_used`,`current_allocated`,`current_avg_alloc`,`current_max_alloc`,`total_allocated`) AS select if((`performance_schema`.`memory_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`memory_summary_by_user_by_event_name`.`USER`) AS `user`,sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_COUNT_USED`) AS `current_count_used`,sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `current_allocated`,ifnull((sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) / nullif(sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_COUNT_USED`),0)),0) AS `current_avg_alloc`,max(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `current_max_alloc`,sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`SUM_NUMBER_OF_BYTES_ALLOC`) AS `total_allocated` from `performance_schema`.`memory_summary_by_user_by_event_name` group by if((`performance_schema`.`memory_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`memory_summary_by_user_by_event_name`.`USER`) order by sum(`performance_schema`.`memory_summary_by_user_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) desc;

-- Dumping structure for view sys.x$memory_global_by_current_bytes
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$memory_global_by_current_bytes`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$memory_global_by_current_bytes` (`event_name`,`current_count`,`current_alloc`,`current_avg_alloc`,`high_count`,`high_alloc`,`high_avg_alloc`) AS select `performance_schema`.`memory_summary_global_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_COUNT_USED` AS `current_count`,`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED` AS `current_alloc`,ifnull((`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED` / nullif(`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_COUNT_USED`,0)),0) AS `current_avg_alloc`,`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_COUNT_USED` AS `high_count`,`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_NUMBER_OF_BYTES_USED` AS `high_alloc`,ifnull((`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_NUMBER_OF_BYTES_USED` / nullif(`performance_schema`.`memory_summary_global_by_event_name`.`HIGH_COUNT_USED`,0)),0) AS `high_avg_alloc` from `performance_schema`.`memory_summary_global_by_event_name` where (`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED` > 0) order by `performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED` desc;

-- Dumping structure for view sys.x$memory_global_total
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$memory_global_total`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$memory_global_total` (`total_allocated`) AS select sum(`performance_schema`.`memory_summary_global_by_event_name`.`CURRENT_NUMBER_OF_BYTES_USED`) AS `total_allocated` from `performance_schema`.`memory_summary_global_by_event_name`;

-- Dumping structure for view sys.x$processlist
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$processlist`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$processlist` (`thd_id`,`conn_id`,`user`,`db`,`command`,`state`,`time`,`current_statement`,`statement_latency`,`progress`,`lock_latency`,`rows_examined`,`rows_sent`,`rows_affected`,`tmp_tables`,`tmp_disk_tables`,`full_scan`,`last_statement`,`last_statement_latency`,`current_memory`,`last_wait`,`last_wait_latency`,`source`,`trx_latency`,`trx_state`,`trx_autocommit`,`pid`,`program_name`) AS select `pps`.`THREAD_ID` AS `thd_id`,`pps`.`PROCESSLIST_ID` AS `conn_id`,if((`pps`.`NAME` in ('thread/sql/one_connection','thread/thread_pool/tp_one_connection')),concat(`pps`.`PROCESSLIST_USER`,'@',convert(`pps`.`PROCESSLIST_HOST` using utf8mb4)),replace(`pps`.`NAME`,'thread/','')) AS `user`,`pps`.`PROCESSLIST_DB` AS `db`,`pps`.`PROCESSLIST_COMMAND` AS `command`,`pps`.`PROCESSLIST_STATE` AS `state`,`pps`.`PROCESSLIST_TIME` AS `time`,`pps`.`PROCESSLIST_INFO` AS `current_statement`,if((`esc`.`END_EVENT_ID` is null),`esc`.`TIMER_WAIT`,NULL) AS `statement_latency`,if((`esc`.`END_EVENT_ID` is null),round((100 * (`estc`.`WORK_COMPLETED` / `estc`.`WORK_ESTIMATED`)),2),NULL) AS `progress`,`esc`.`LOCK_TIME` AS `lock_latency`,`esc`.`ROWS_EXAMINED` AS `rows_examined`,`esc`.`ROWS_SENT` AS `rows_sent`,`esc`.`ROWS_AFFECTED` AS `rows_affected`,`esc`.`CREATED_TMP_TABLES` AS `tmp_tables`,`esc`.`CREATED_TMP_DISK_TABLES` AS `tmp_disk_tables`,if(((`esc`.`NO_GOOD_INDEX_USED` > 0) or (`esc`.`NO_INDEX_USED` > 0)),'YES','NO') AS `full_scan`,if((`esc`.`END_EVENT_ID` is not null),`esc`.`SQL_TEXT`,NULL) AS `last_statement`,if((`esc`.`END_EVENT_ID` is not null),`esc`.`TIMER_WAIT`,NULL) AS `last_statement_latency`,`mem`.`current_allocated` AS `current_memory`,`ewc`.`EVENT_NAME` AS `last_wait`,if(((`ewc`.`END_EVENT_ID` is null) and (`ewc`.`EVENT_NAME` is not null)),'Still Waiting',`ewc`.`TIMER_WAIT`) AS `last_wait_latency`,`ewc`.`SOURCE` AS `source`,`etc`.`TIMER_WAIT` AS `trx_latency`,`etc`.`STATE` AS `trx_state`,`etc`.`AUTOCOMMIT` AS `trx_autocommit`,`conattr_pid`.`ATTR_VALUE` AS `pid`,`conattr_progname`.`ATTR_VALUE` AS `program_name` from (((((((`performance_schema`.`threads` `pps` left join `performance_schema`.`events_waits_current` `ewc` on((`pps`.`THREAD_ID` = `ewc`.`THREAD_ID`))) left join `performance_schema`.`events_stages_current` `estc` on((`pps`.`THREAD_ID` = `estc`.`THREAD_ID`))) left join `performance_schema`.`events_statements_current` `esc` on((`pps`.`THREAD_ID` = `esc`.`THREAD_ID`))) left join `performance_schema`.`events_transactions_current` `etc` on((`pps`.`THREAD_ID` = `etc`.`THREAD_ID`))) left join `sys`.`x$memory_by_thread_by_current_bytes` `mem` on((`pps`.`THREAD_ID` = `mem`.`thread_id`))) left join `performance_schema`.`session_connect_attrs` `conattr_pid` on(((`conattr_pid`.`PROCESSLIST_ID` = `pps`.`PROCESSLIST_ID`) and (`conattr_pid`.`ATTR_NAME` = '_pid')))) left join `performance_schema`.`session_connect_attrs` `conattr_progname` on(((`conattr_progname`.`PROCESSLIST_ID` = `pps`.`PROCESSLIST_ID`) and (`conattr_progname`.`ATTR_NAME` = 'program_name')))) order by `pps`.`PROCESSLIST_TIME` desc,`last_wait_latency` desc;

-- Dumping structure for view sys.x$ps_digest_95th_percentile_by_avg_us
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$ps_digest_95th_percentile_by_avg_us`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$ps_digest_95th_percentile_by_avg_us` (`avg_us`,`percentile`) AS select `s2`.`avg_us` AS `avg_us`,ifnull((sum(`s1`.`cnt`) / nullif((select count(0) from `performance_schema`.`events_statements_summary_by_digest`),0)),0) AS `percentile` from (`sys`.`x$ps_digest_avg_latency_distribution` `s1` join `sys`.`x$ps_digest_avg_latency_distribution` `s2` on((`s1`.`avg_us` <= `s2`.`avg_us`))) group by `s2`.`avg_us` having (ifnull((sum(`s1`.`cnt`) / nullif((select count(0) from `performance_schema`.`events_statements_summary_by_digest`),0)),0) > 0.95) order by `percentile` limit 1;

-- Dumping structure for view sys.x$ps_digest_avg_latency_distribution
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$ps_digest_avg_latency_distribution`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$ps_digest_avg_latency_distribution` (`cnt`,`avg_us`) AS select count(0) AS `cnt`,round((`performance_schema`.`events_statements_summary_by_digest`.`AVG_TIMER_WAIT` / 1000000),0) AS `avg_us` from `performance_schema`.`events_statements_summary_by_digest` group by `avg_us`;

-- Dumping structure for view sys.x$ps_schema_table_statistics_io
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$ps_schema_table_statistics_io`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$ps_schema_table_statistics_io` (`table_schema`,`table_name`,`count_read`,`sum_number_of_bytes_read`,`sum_timer_read`,`count_write`,`sum_number_of_bytes_write`,`sum_timer_write`,`count_misc`,`sum_timer_misc`) AS select `extract_schema_from_file_name`(`performance_schema`.`file_summary_by_instance`.`FILE_NAME`) AS `table_schema`,`extract_table_from_file_name`(`performance_schema`.`file_summary_by_instance`.`FILE_NAME`) AS `table_name`,sum(`performance_schema`.`file_summary_by_instance`.`COUNT_READ`) AS `count_read`,sum(`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_READ`) AS `sum_number_of_bytes_read`,sum(`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_READ`) AS `sum_timer_read`,sum(`performance_schema`.`file_summary_by_instance`.`COUNT_WRITE`) AS `count_write`,sum(`performance_schema`.`file_summary_by_instance`.`SUM_NUMBER_OF_BYTES_WRITE`) AS `sum_number_of_bytes_write`,sum(`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_WRITE`) AS `sum_timer_write`,sum(`performance_schema`.`file_summary_by_instance`.`COUNT_MISC`) AS `count_misc`,sum(`performance_schema`.`file_summary_by_instance`.`SUM_TIMER_MISC`) AS `sum_timer_misc` from `performance_schema`.`file_summary_by_instance` group by `table_schema`,`table_name`;

-- Dumping structure for view sys.x$schema_flattened_keys
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$schema_flattened_keys`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$schema_flattened_keys` (`table_schema`,`table_name`,`index_name`,`non_unique`,`subpart_exists`,`index_columns`) AS select `statistics`.`TABLE_SCHEMA` AS `TABLE_SCHEMA`,`statistics`.`TABLE_NAME` AS `TABLE_NAME`,`statistics`.`INDEX_NAME` AS `INDEX_NAME`,max(`statistics`.`NON_UNIQUE`) AS `non_unique`,max(if((`statistics`.`SUB_PART` is null),0,1)) AS `subpart_exists`,group_concat(`statistics`.`COLUMN_NAME` order by `statistics`.`SEQ_IN_INDEX` ASC separator ',') AS `index_columns` from `information_schema`.`STATISTICS` where ((`statistics`.`INDEX_TYPE` = 'BTREE') and (`statistics`.`TABLE_SCHEMA` not in ('mysql','sys','INFORMATION_SCHEMA','PERFORMANCE_SCHEMA'))) group by `statistics`.`TABLE_SCHEMA`,`statistics`.`TABLE_NAME`,`statistics`.`INDEX_NAME`;

-- Dumping structure for view sys.x$schema_index_statistics
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$schema_index_statistics`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$schema_index_statistics` (`table_schema`,`table_name`,`index_name`,`rows_selected`,`select_latency`,`rows_inserted`,`insert_latency`,`rows_updated`,`update_latency`,`rows_deleted`,`delete_latency`) AS select `performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_SCHEMA` AS `table_schema`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_NAME` AS `table_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`INDEX_NAME` AS `index_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_FETCH` AS `rows_selected`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_FETCH` AS `select_latency`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_INSERT` AS `rows_inserted`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_INSERT` AS `insert_latency`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_UPDATE` AS `rows_updated`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_UPDATE` AS `update_latency`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_DELETE` AS `rows_deleted`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_DELETE` AS `delete_latency` from `performance_schema`.`table_io_waits_summary_by_index_usage` where (`performance_schema`.`table_io_waits_summary_by_index_usage`.`INDEX_NAME` is not null) order by `performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$schema_tables_with_full_table_scans
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$schema_tables_with_full_table_scans`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$schema_tables_with_full_table_scans` (`object_schema`,`object_name`,`rows_full_scanned`,`latency`) AS select `performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_SCHEMA` AS `object_schema`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`OBJECT_NAME` AS `object_name`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_READ` AS `rows_full_scanned`,`performance_schema`.`table_io_waits_summary_by_index_usage`.`SUM_TIMER_WAIT` AS `latency` from `performance_schema`.`table_io_waits_summary_by_index_usage` where ((`performance_schema`.`table_io_waits_summary_by_index_usage`.`INDEX_NAME` is null) and (`performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_READ` > 0)) order by `performance_schema`.`table_io_waits_summary_by_index_usage`.`COUNT_READ` desc;

-- Dumping structure for view sys.x$schema_table_lock_waits
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$schema_table_lock_waits`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$schema_table_lock_waits` (`object_schema`,`object_name`,`waiting_thread_id`,`waiting_pid`,`waiting_account`,`waiting_lock_type`,`waiting_lock_duration`,`waiting_query`,`waiting_query_secs`,`waiting_query_rows_affected`,`waiting_query_rows_examined`,`blocking_thread_id`,`blocking_pid`,`blocking_account`,`blocking_lock_type`,`blocking_lock_duration`,`sql_kill_blocking_query`,`sql_kill_blocking_connection`) AS select `g`.`OBJECT_SCHEMA` AS `object_schema`,`g`.`OBJECT_NAME` AS `object_name`,`pt`.`THREAD_ID` AS `waiting_thread_id`,`pt`.`PROCESSLIST_ID` AS `waiting_pid`,`sys`.`ps_thread_account`(`p`.`OWNER_THREAD_ID`) AS `waiting_account`,`p`.`LOCK_TYPE` AS `waiting_lock_type`,`p`.`LOCK_DURATION` AS `waiting_lock_duration`,`pt`.`PROCESSLIST_INFO` AS `waiting_query`,`pt`.`PROCESSLIST_TIME` AS `waiting_query_secs`,`ps`.`ROWS_AFFECTED` AS `waiting_query_rows_affected`,`ps`.`ROWS_EXAMINED` AS `waiting_query_rows_examined`,`gt`.`THREAD_ID` AS `blocking_thread_id`,`gt`.`PROCESSLIST_ID` AS `blocking_pid`,`sys`.`ps_thread_account`(`g`.`OWNER_THREAD_ID`) AS `blocking_account`,`g`.`LOCK_TYPE` AS `blocking_lock_type`,`g`.`LOCK_DURATION` AS `blocking_lock_duration`,concat('KILL QUERY ',`gt`.`PROCESSLIST_ID`) AS `sql_kill_blocking_query`,concat('KILL ',`gt`.`PROCESSLIST_ID`) AS `sql_kill_blocking_connection` from (((((`performance_schema`.`metadata_locks` `g` join `performance_schema`.`metadata_locks` `p` on(((`g`.`OBJECT_TYPE` = `p`.`OBJECT_TYPE`) and (`g`.`OBJECT_SCHEMA` = `p`.`OBJECT_SCHEMA`) and (`g`.`OBJECT_NAME` = `p`.`OBJECT_NAME`) and (`g`.`LOCK_STATUS` = 'GRANTED') and (`p`.`LOCK_STATUS` = 'PENDING')))) join `performance_schema`.`threads` `gt` on((`g`.`OWNER_THREAD_ID` = `gt`.`THREAD_ID`))) join `performance_schema`.`threads` `pt` on((`p`.`OWNER_THREAD_ID` = `pt`.`THREAD_ID`))) left join `performance_schema`.`events_statements_current` `gs` on((`g`.`OWNER_THREAD_ID` = `gs`.`THREAD_ID`))) left join `performance_schema`.`events_statements_current` `ps` on((`p`.`OWNER_THREAD_ID` = `ps`.`THREAD_ID`))) where (`g`.`OBJECT_TYPE` = 'TABLE');

-- Dumping structure for view sys.x$schema_table_statistics
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$schema_table_statistics`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$schema_table_statistics` (`table_schema`,`table_name`,`total_latency`,`rows_fetched`,`fetch_latency`,`rows_inserted`,`insert_latency`,`rows_updated`,`update_latency`,`rows_deleted`,`delete_latency`,`io_read_requests`,`io_read`,`io_read_latency`,`io_write_requests`,`io_write`,`io_write_latency`,`io_misc_requests`,`io_misc_latency`) AS select `pst`.`OBJECT_SCHEMA` AS `table_schema`,`pst`.`OBJECT_NAME` AS `table_name`,`pst`.`SUM_TIMER_WAIT` AS `total_latency`,`pst`.`COUNT_FETCH` AS `rows_fetched`,`pst`.`SUM_TIMER_FETCH` AS `fetch_latency`,`pst`.`COUNT_INSERT` AS `rows_inserted`,`pst`.`SUM_TIMER_INSERT` AS `insert_latency`,`pst`.`COUNT_UPDATE` AS `rows_updated`,`pst`.`SUM_TIMER_UPDATE` AS `update_latency`,`pst`.`COUNT_DELETE` AS `rows_deleted`,`pst`.`SUM_TIMER_DELETE` AS `delete_latency`,`fsbi`.`count_read` AS `io_read_requests`,`fsbi`.`sum_number_of_bytes_read` AS `io_read`,`fsbi`.`sum_timer_read` AS `io_read_latency`,`fsbi`.`count_write` AS `io_write_requests`,`fsbi`.`sum_number_of_bytes_write` AS `io_write`,`fsbi`.`sum_timer_write` AS `io_write_latency`,`fsbi`.`count_misc` AS `io_misc_requests`,`fsbi`.`sum_timer_misc` AS `io_misc_latency` from (`performance_schema`.`table_io_waits_summary_by_table` `pst` left join `sys`.`x$ps_schema_table_statistics_io` `fsbi` on(((`pst`.`OBJECT_SCHEMA` = `fsbi`.`table_schema`) and (`pst`.`OBJECT_NAME` = `fsbi`.`table_name`)))) order by `pst`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$schema_table_statistics_with_buffer
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$schema_table_statistics_with_buffer`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$schema_table_statistics_with_buffer` (`table_schema`,`table_name`,`rows_fetched`,`fetch_latency`,`rows_inserted`,`insert_latency`,`rows_updated`,`update_latency`,`rows_deleted`,`delete_latency`,`io_read_requests`,`io_read`,`io_read_latency`,`io_write_requests`,`io_write`,`io_write_latency`,`io_misc_requests`,`io_misc_latency`,`innodb_buffer_allocated`,`innodb_buffer_data`,`innodb_buffer_free`,`innodb_buffer_pages`,`innodb_buffer_pages_hashed`,`innodb_buffer_pages_old`,`innodb_buffer_rows_cached`) AS select `pst`.`OBJECT_SCHEMA` AS `table_schema`,`pst`.`OBJECT_NAME` AS `table_name`,`pst`.`COUNT_FETCH` AS `rows_fetched`,`pst`.`SUM_TIMER_FETCH` AS `fetch_latency`,`pst`.`COUNT_INSERT` AS `rows_inserted`,`pst`.`SUM_TIMER_INSERT` AS `insert_latency`,`pst`.`COUNT_UPDATE` AS `rows_updated`,`pst`.`SUM_TIMER_UPDATE` AS `update_latency`,`pst`.`COUNT_DELETE` AS `rows_deleted`,`pst`.`SUM_TIMER_DELETE` AS `delete_latency`,`fsbi`.`count_read` AS `io_read_requests`,`fsbi`.`sum_number_of_bytes_read` AS `io_read`,`fsbi`.`sum_timer_read` AS `io_read_latency`,`fsbi`.`count_write` AS `io_write_requests`,`fsbi`.`sum_number_of_bytes_write` AS `io_write`,`fsbi`.`sum_timer_write` AS `io_write_latency`,`fsbi`.`count_misc` AS `io_misc_requests`,`fsbi`.`sum_timer_misc` AS `io_misc_latency`,`ibp`.`allocated` AS `innodb_buffer_allocated`,`ibp`.`data` AS `innodb_buffer_data`,(`ibp`.`allocated` - `ibp`.`data`) AS `innodb_buffer_free`,`ibp`.`pages` AS `innodb_buffer_pages`,`ibp`.`pages_hashed` AS `innodb_buffer_pages_hashed`,`ibp`.`pages_old` AS `innodb_buffer_pages_old`,`ibp`.`rows_cached` AS `innodb_buffer_rows_cached` from ((`performance_schema`.`table_io_waits_summary_by_table` `pst` left join `sys`.`x$ps_schema_table_statistics_io` `fsbi` on(((`pst`.`OBJECT_SCHEMA` = `fsbi`.`table_schema`) and (`pst`.`OBJECT_NAME` = `fsbi`.`table_name`)))) left join `sys`.`x$innodb_buffer_stats_by_table` `ibp` on(((`pst`.`OBJECT_SCHEMA` = convert(`ibp`.`object_schema` using utf8mb4)) and (`pst`.`OBJECT_NAME` = convert(`ibp`.`object_name` using utf8mb4))))) order by `pst`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$session
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$session`;
CREATE ALGORITHM=UNDEFINED DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$session` AS select `x$processlist`.`thd_id` AS `thd_id`,`x$processlist`.`conn_id` AS `conn_id`,`x$processlist`.`user` AS `user`,`x$processlist`.`db` AS `db`,`x$processlist`.`command` AS `command`,`x$processlist`.`state` AS `state`,`x$processlist`.`time` AS `time`,`x$processlist`.`current_statement` AS `current_statement`,`x$processlist`.`statement_latency` AS `statement_latency`,`x$processlist`.`progress` AS `progress`,`x$processlist`.`lock_latency` AS `lock_latency`,`x$processlist`.`rows_examined` AS `rows_examined`,`x$processlist`.`rows_sent` AS `rows_sent`,`x$processlist`.`rows_affected` AS `rows_affected`,`x$processlist`.`tmp_tables` AS `tmp_tables`,`x$processlist`.`tmp_disk_tables` AS `tmp_disk_tables`,`x$processlist`.`full_scan` AS `full_scan`,`x$processlist`.`last_statement` AS `last_statement`,`x$processlist`.`last_statement_latency` AS `last_statement_latency`,`x$processlist`.`current_memory` AS `current_memory`,`x$processlist`.`last_wait` AS `last_wait`,`x$processlist`.`last_wait_latency` AS `last_wait_latency`,`x$processlist`.`source` AS `source`,`x$processlist`.`trx_latency` AS `trx_latency`,`x$processlist`.`trx_state` AS `trx_state`,`x$processlist`.`trx_autocommit` AS `trx_autocommit`,`x$processlist`.`pid` AS `pid`,`x$processlist`.`program_name` AS `program_name` from `sys`.`x$processlist` where ((`x$processlist`.`conn_id` is not null) and (`x$processlist`.`command` <> 'Daemon'));

-- Dumping structure for view sys.x$statements_with_errors_or_warnings
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$statements_with_errors_or_warnings`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$statements_with_errors_or_warnings` (`query`,`db`,`exec_count`,`errors`,`error_pct`,`warnings`,`warning_pct`,`first_seen`,`last_seen`,`digest`) AS select `performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` AS `errors`,(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100) AS `error_pct`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` AS `warnings`,(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100) AS `warning_pct`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where ((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` > 0) or (`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` > 0)) order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` desc,`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` desc;

-- Dumping structure for view sys.x$statements_with_full_table_scans
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$statements_with_full_table_scans`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$statements_with_full_table_scans` (`query`,`db`,`exec_count`,`total_latency`,`no_index_used_count`,`no_good_index_used_count`,`no_index_used_pct`,`rows_sent`,`rows_examined`,`rows_sent_avg`,`rows_examined_avg`,`first_seen`,`last_seen`,`digest`) AS select `performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` AS `no_index_used_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_GOOD_INDEX_USED` AS `no_good_index_used_count`,round((ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100),0) AS `no_index_used_pct`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` AS `rows_sent`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` AS `rows_examined`,round((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` / `performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`),0) AS `rows_sent_avg`,round((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` / `performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`),0) AS `rows_examined_avg`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where (((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` > 0) or (`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_GOOD_INDEX_USED` > 0)) and (not((`performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` like 'SHOW%')))) order by round((ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0) * 100),0) desc,`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$statements_with_runtimes_in_95th_percentile
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$statements_with_runtimes_in_95th_percentile`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$statements_with_runtimes_in_95th_percentile` (`query`,`db`,`full_scan`,`exec_count`,`err_count`,`warn_count`,`total_latency`,`max_latency`,`avg_latency`,`rows_sent`,`rows_sent_avg`,`rows_examined`,`rows_examined_avg`,`first_seen`,`last_seen`,`digest`) AS select `stmts`.`DIGEST_TEXT` AS `query`,`stmts`.`SCHEMA_NAME` AS `db`,if(((`stmts`.`SUM_NO_GOOD_INDEX_USED` > 0) or (`stmts`.`SUM_NO_INDEX_USED` > 0)),'*','') AS `full_scan`,`stmts`.`COUNT_STAR` AS `exec_count`,`stmts`.`SUM_ERRORS` AS `err_count`,`stmts`.`SUM_WARNINGS` AS `warn_count`,`stmts`.`SUM_TIMER_WAIT` AS `total_latency`,`stmts`.`MAX_TIMER_WAIT` AS `max_latency`,`stmts`.`AVG_TIMER_WAIT` AS `avg_latency`,`stmts`.`SUM_ROWS_SENT` AS `rows_sent`,round(ifnull((`stmts`.`SUM_ROWS_SENT` / nullif(`stmts`.`COUNT_STAR`,0)),0),0) AS `rows_sent_avg`,`stmts`.`SUM_ROWS_EXAMINED` AS `rows_examined`,round(ifnull((`stmts`.`SUM_ROWS_EXAMINED` / nullif(`stmts`.`COUNT_STAR`,0)),0),0) AS `rows_examined_avg`,`stmts`.`FIRST_SEEN` AS `first_seen`,`stmts`.`LAST_SEEN` AS `last_seen`,`stmts`.`DIGEST` AS `digest` from (`performance_schema`.`events_statements_summary_by_digest` `stmts` join `sys`.`x$ps_digest_95th_percentile_by_avg_us` `top_percentile` on((round((`stmts`.`AVG_TIMER_WAIT` / 1000000),0) >= `top_percentile`.`avg_us`))) order by `stmts`.`AVG_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$statements_with_sorting
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$statements_with_sorting`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$statements_with_sorting` (`query`,`db`,`exec_count`,`total_latency`,`sort_merge_passes`,`avg_sort_merges`,`sorts_using_scans`,`sort_using_range`,`rows_sorted`,`avg_rows_sorted`,`first_seen`,`last_seen`,`digest`) AS select `performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_MERGE_PASSES` AS `sort_merge_passes`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_MERGE_PASSES` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `avg_sort_merges`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_SCAN` AS `sorts_using_scans`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_RANGE` AS `sort_using_range`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` AS `rows_sorted`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `avg_rows_sorted`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where (`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` > 0) order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$statements_with_temp_tables
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$statements_with_temp_tables`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$statements_with_temp_tables` (`query`,`db`,`exec_count`,`total_latency`,`memory_tmp_tables`,`disk_tmp_tables`,`avg_tmp_tables_per_query`,`tmp_tables_to_disk_pct`,`first_seen`,`last_seen`,`digest`) AS select `performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` AS `memory_tmp_tables`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` AS `disk_tmp_tables`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `avg_tmp_tables_per_query`,round((ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES`,0)),0) * 100),0) AS `tmp_tables_to_disk_pct`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest` from `performance_schema`.`events_statements_summary_by_digest` where (`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` > 0) order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` desc,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` desc;

-- Dumping structure for view sys.x$statement_analysis
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$statement_analysis`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$statement_analysis` (`query`,`db`,`full_scan`,`exec_count`,`err_count`,`warn_count`,`total_latency`,`max_latency`,`avg_latency`,`lock_latency`,`rows_sent`,`rows_sent_avg`,`rows_examined`,`rows_examined_avg`,`rows_affected`,`rows_affected_avg`,`tmp_tables`,`tmp_disk_tables`,`rows_sorted`,`sort_merge_passes`,`digest`,`first_seen`,`last_seen`) AS select `performance_schema`.`events_statements_summary_by_digest`.`DIGEST_TEXT` AS `query`,`performance_schema`.`events_statements_summary_by_digest`.`SCHEMA_NAME` AS `db`,if(((`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_GOOD_INDEX_USED` > 0) or (`performance_schema`.`events_statements_summary_by_digest`.`SUM_NO_INDEX_USED` > 0)),'*','') AS `full_scan`,`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR` AS `exec_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ERRORS` AS `err_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_WARNINGS` AS `warn_count`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_statements_summary_by_digest`.`MAX_TIMER_WAIT` AS `max_latency`,`performance_schema`.`events_statements_summary_by_digest`.`AVG_TIMER_WAIT` AS `avg_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_LOCK_TIME` AS `lock_latency`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` AS `rows_sent`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_SENT` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `rows_sent_avg`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` AS `rows_examined`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_EXAMINED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `rows_examined_avg`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_AFFECTED` AS `rows_affected`,round(ifnull((`performance_schema`.`events_statements_summary_by_digest`.`SUM_ROWS_AFFECTED` / nullif(`performance_schema`.`events_statements_summary_by_digest`.`COUNT_STAR`,0)),0),0) AS `rows_affected_avg`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_TABLES` AS `tmp_tables`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_CREATED_TMP_DISK_TABLES` AS `tmp_disk_tables`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_ROWS` AS `rows_sorted`,`performance_schema`.`events_statements_summary_by_digest`.`SUM_SORT_MERGE_PASSES` AS `sort_merge_passes`,`performance_schema`.`events_statements_summary_by_digest`.`DIGEST` AS `digest`,`performance_schema`.`events_statements_summary_by_digest`.`FIRST_SEEN` AS `first_seen`,`performance_schema`.`events_statements_summary_by_digest`.`LAST_SEEN` AS `last_seen` from `performance_schema`.`events_statements_summary_by_digest` order by `performance_schema`.`events_statements_summary_by_digest`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$user_summary
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$user_summary`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$user_summary` (`user`,`statements`,`statement_latency`,`statement_avg_latency`,`table_scans`,`file_ios`,`file_io_latency`,`current_connections`,`total_connections`,`unique_hosts`,`current_memory`,`total_memory_allocated`) AS select if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) AS `user`,sum(`stmt`.`total`) AS `statements`,sum(`stmt`.`total_latency`) AS `statement_latency`,ifnull((sum(`stmt`.`total_latency`) / nullif(sum(`stmt`.`total`),0)),0) AS `statement_avg_latency`,sum(`stmt`.`full_scans`) AS `table_scans`,sum(`io`.`ios`) AS `file_ios`,sum(`io`.`io_latency`) AS `file_io_latency`,sum(`performance_schema`.`accounts`.`CURRENT_CONNECTIONS`) AS `current_connections`,sum(`performance_schema`.`accounts`.`TOTAL_CONNECTIONS`) AS `total_connections`,count(distinct `performance_schema`.`accounts`.`HOST`) AS `unique_hosts`,sum(`mem`.`current_allocated`) AS `current_memory`,sum(`mem`.`total_allocated`) AS `total_memory_allocated` from (((`performance_schema`.`accounts` left join `sys`.`x$user_summary_by_statement_latency` `stmt` on((if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) = `stmt`.`user`))) left join `sys`.`x$user_summary_by_file_io` `io` on((if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) = `io`.`user`))) left join `sys`.`x$memory_by_user_by_current_bytes` `mem` on((if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) = `mem`.`user`))) group by if((`performance_schema`.`accounts`.`USER` is null),'background',`performance_schema`.`accounts`.`USER`) order by sum(`stmt`.`total_latency`) desc;

-- Dumping structure for view sys.x$user_summary_by_file_io
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$user_summary_by_file_io`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$user_summary_by_file_io` (`user`,`ios`,`io_latency`) AS select if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) AS `user`,sum(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR`) AS `ios`,sum(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) AS `io_latency` from `performance_schema`.`events_waits_summary_by_user_by_event_name` where (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` like 'wait/io/file/%') group by if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) order by sum(`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.x$user_summary_by_file_io_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$user_summary_by_file_io_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$user_summary_by_file_io_type` (`user`,`event_name`,`total`,`latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) AS `user`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` AS `latency`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency` from `performance_schema`.`events_waits_summary_by_user_by_event_name` where ((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` like 'wait/io/file%') and (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR` > 0)) order by if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$user_summary_by_stages
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$user_summary_by_stages`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$user_summary_by_stages` (`user`,`event_name`,`total`,`total_latency`,`avg_latency`) AS select if((`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER`) AS `user`,`performance_schema`.`events_stages_summary_by_user_by_event_name`.`EVENT_NAME` AS `event_name`,`performance_schema`.`events_stages_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_stages_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_stages_summary_by_user_by_event_name`.`AVG_TIMER_WAIT` AS `avg_latency` from `performance_schema`.`events_stages_summary_by_user_by_event_name` where (`performance_schema`.`events_stages_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_stages_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_stages_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$user_summary_by_statement_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$user_summary_by_statement_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$user_summary_by_statement_latency` (`user`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`) AS `user`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`COUNT_STAR`) AS `total`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_LOCK_TIME`) AS `lock_latency`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_SENT`) AS `rows_sent`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_EXAMINED`) AS `rows_examined`,sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_AFFECTED`) AS `rows_affected`,(sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_INDEX_USED`) + sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_GOOD_INDEX_USED`)) AS `full_scans` from `performance_schema`.`events_statements_summary_by_user_by_event_name` group by if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`) order by sum(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT`) desc;

-- Dumping structure for view sys.x$user_summary_by_statement_type
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$user_summary_by_statement_type`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$user_summary_by_statement_type` (`user`,`statement`,`total`,`total_latency`,`max_latency`,`lock_latency`,`rows_sent`,`rows_examined`,`rows_affected`,`full_scans`) AS select if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`) AS `user`,substring_index(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`EVENT_NAME`,'/',-(1)) AS `statement`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_LOCK_TIME` AS `lock_latency`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_SENT` AS `rows_sent`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_EXAMINED` AS `rows_examined`,`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_ROWS_AFFECTED` AS `rows_affected`,(`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_INDEX_USED` + `performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_NO_GOOD_INDEX_USED`) AS `full_scans` from `performance_schema`.`events_statements_summary_by_user_by_event_name` where (`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` <> 0) order by if((`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_statements_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_statements_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$waits_by_host_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$waits_by_host_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$waits_by_host_by_latency` (`host`,`event`,`total`,`total_latency`,`avg_latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`) AS `host`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` AS `event`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`AVG_TIMER_WAIT` AS `avg_latency`,`performance_schema`.`events_waits_summary_by_host_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency` from `performance_schema`.`events_waits_summary_by_host_by_event_name` where ((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`EVENT_NAME` <> 'idle') and (`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` > 0)) order by if((`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST` is null),'background',`performance_schema`.`events_waits_summary_by_host_by_event_name`.`HOST`),`performance_schema`.`events_waits_summary_by_host_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$waits_by_user_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$waits_by_user_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$waits_by_user_by_latency` (`user`,`event`,`total`,`total_latency`,`avg_latency`,`max_latency`) AS select if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`) AS `user`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` AS `event`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`AVG_TIMER_WAIT` AS `avg_latency`,`performance_schema`.`events_waits_summary_by_user_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency` from `performance_schema`.`events_waits_summary_by_user_by_event_name` where ((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`EVENT_NAME` <> 'idle') and (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is not null) and (`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` > 0)) order by if((`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER` is null),'background',`performance_schema`.`events_waits_summary_by_user_by_event_name`.`USER`),`performance_schema`.`events_waits_summary_by_user_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$waits_global_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$waits_global_by_latency`;
CREATE ALGORITHM=MERGE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$waits_global_by_latency` (`events`,`total`,`total_latency`,`avg_latency`,`max_latency`) AS select `performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` AS `event`,`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR` AS `total`,`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` AS `total_latency`,`performance_schema`.`events_waits_summary_global_by_event_name`.`AVG_TIMER_WAIT` AS `avg_latency`,`performance_schema`.`events_waits_summary_global_by_event_name`.`MAX_TIMER_WAIT` AS `max_latency` from `performance_schema`.`events_waits_summary_global_by_event_name` where ((`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` <> 'idle') and (`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` > 0)) order by `performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` desc;

-- Dumping structure for view sys.x$wait_classes_global_by_avg_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$wait_classes_global_by_avg_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$wait_classes_global_by_avg_latency` (`event_class`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`) AS select substring_index(`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME`,'/',3) AS `event_class`,sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`) AS `total`,sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,min(`performance_schema`.`events_waits_summary_global_by_event_name`.`MIN_TIMER_WAIT`) AS `min_latency`,ifnull((sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) / nullif(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`),0)),0) AS `avg_latency`,max(`performance_schema`.`events_waits_summary_global_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency` from `performance_schema`.`events_waits_summary_global_by_event_name` where ((`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` > 0) and (`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` <> 'idle')) group by `event_class` order by ifnull((sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) / nullif(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`),0)),0) desc;

-- Dumping structure for view sys.x$wait_classes_global_by_latency
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `x$wait_classes_global_by_latency`;
CREATE ALGORITHM=TEMPTABLE DEFINER=`mysql.sys`@`localhost` SQL SECURITY INVOKER VIEW `sys`.`x$wait_classes_global_by_latency` (`event_class`,`total`,`total_latency`,`min_latency`,`avg_latency`,`max_latency`) AS select substring_index(`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME`,'/',3) AS `event_class`,sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`) AS `total`,sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) AS `total_latency`,min(`performance_schema`.`events_waits_summary_global_by_event_name`.`MIN_TIMER_WAIT`) AS `min_latency`,ifnull((sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) / nullif(sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`COUNT_STAR`),0)),0) AS `avg_latency`,max(`performance_schema`.`events_waits_summary_global_by_event_name`.`MAX_TIMER_WAIT`) AS `max_latency` from `performance_schema`.`events_waits_summary_global_by_event_name` where ((`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT` > 0) and (`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME` <> 'idle')) group by substring_index(`performance_schema`.`events_waits_summary_global_by_event_name`.`EVENT_NAME`,'/',3) order by sum(`performance_schema`.`events_waits_summary_global_by_event_name`.`SUM_TIMER_WAIT`) desc;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
