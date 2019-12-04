-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.14 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for notifies
DROP DATABASE IF EXISTS `notifies`;
CREATE DATABASE IF NOT EXISTS `notifies` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `notifies`;

-- Dumping structure for table notifies.accounts
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE IF NOT EXISTS `accounts` (
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `twitch_token` varchar(100) DEFAULT NULL,
  `youtube_token` varchar(250) DEFAULT NULL,
  `profile_img` blob,
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table notifies.accounts: ~3 rows (approximately)
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`username`, `email`, `password`, `twitch_token`, `youtube_token`, `profile_img`) VALUES
	('denis', 'denbnis@dennis.com', 'denisasdasd', NULL, NULL, NULL),
	('mambans', 'perssons1996@gmail.com', 'merpler23995', '', 'ya29.GluOB4_u4WkyVMu9Sbmwa9lh06JQ0v6Q4UMvaDMlrq42qLWhUBiZQlq_daqcTgbhOSL7Q7q0ynP-78yPtw2gPJppW6hIECX2wzumSGoIQt845PZoYbg7V2ARpFZ2', NULL),
	('mamkor', 'mamkor@something.com', 'ghjghj', NULL, NULL, NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Dumping structure for procedure notifies.Account_Login
DROP PROCEDURE IF EXISTS `Account_Login`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Account_Login`(
	IN `usernameD` VARCHAR(50),
	IN `passwordD` VARCHAR(50)



)
    READS SQL DATA
    DETERMINISTIC
BEGIN
	-- VARIABLE usernameD VARCHAR(30);
	-- VARIABLE ASDF VARCHAR(30);
	-- EXEC :usernameD := 'usernameD_bind1';
	
	SELECT username, email, twitch_token, youtube_token FROM accounts where username = usernameD AND password = passwordD;
	-- SELECT * FROM accounts where username = usernameD AND password = passwordD;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.add_channel
DROP PROCEDURE IF EXISTS `add_channel`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_channel`(
	IN `channelName` VARCHAR(50)


)
    COMMENT 'Adds a channel to get vods from.'
BEGIN
	INSERT into followed_vods(name) values(channelName);
END//
DELIMITER ;

-- Dumping structure for procedure notifies.Create_Account
DROP PROCEDURE IF EXISTS `Create_Account`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `Create_Account`(
	IN `username` VARCHAR(50),
	IN `email` VARCHAR(50),
	IN `password` VARCHAR(50)

)
BEGIN
	INSERT into accounts(username, email, password) values(username, email, password);
END//
DELIMITER ;

-- Dumping structure for table notifies.followed_vods
DROP TABLE IF EXISTS `followed_vods`;
CREATE TABLE IF NOT EXISTS `followed_vods` (
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Twitch channels to show vods from.';

-- Dumping data for table notifies.followed_vods: ~10 rows (approximately)
/*!40000 ALTER TABLE `followed_vods` DISABLE KEYS */;
INSERT INTO `followed_vods` (`name`) VALUES
	('sodapoppin'),
	('dizzykitten'),
	('yourpelagea'),
	('jakenbakelive'),
	('malena'),
	('gggibi'),
	('mayahiga'),
	('mizkif'),
	('hachubby'),
	('angelskimi'),
	('nymn');
/*!40000 ALTER TABLE `followed_vods` ENABLE KEYS */;

-- Dumping structure for procedure notifies.remove_channel
DROP PROCEDURE IF EXISTS `remove_channel`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `remove_channel`(
	IN `channelName` VARCHAR(50)
)
    COMMENT 'Removes a channel to not get vods from anymore.'
BEGIN
	DELETE from followed_vods where name = channelName;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.show_vod_channels
DROP PROCEDURE IF EXISTS `show_vod_channels`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `show_vod_channels`()
    COMMENT 'Show all channels for vods.'
BEGIN
	SELECT * FROM followed_vods;
END//
DELIMITER ;

-- Dumping structure for procedure notifies.Update_TwitchToken
DROP PROCEDURE IF EXISTS `Update_TwitchToken`;
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
DROP PROCEDURE IF EXISTS `Update_YoutubeToken`;
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

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
