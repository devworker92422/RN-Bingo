/*
 Navicat Premium Data Transfer

 Source Server         : SQLite
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 18/03/2024 03:17:29
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for tbl_board
-- ----------------------------
DROP TABLE IF EXISTS "tbl_board";
CREATE TABLE "tbl_board" (
  "id" INTEGER NOT NULL DEFAULT '' PRIMARY KEY AUTOINCREMENT,
  "setting_id" INTEGER(11),
  "isEverted" integer(11),
  "isWinner" integer(11),
  "isSealed" integer(11),
  "value" integer(11),
  "square_id" INTEGER(11)
);

PRAGMA foreign_keys = true;
