/*
 Navicat Premium Data Transfer

 Source Server         : SQLite
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 18/03/2024 03:17:51
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for tbl_setting
-- ----------------------------
DROP TABLE IF EXISTS "tbl_setting";
CREATE TABLE "tbl_setting" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "b_count" integer(11),
  "b_row" integer(11),
  "b_col" integer(11),
  "price" integer(11),
  "p_rate" integer(11),
  "p_real_amount" integer(11),
  "status" integer(2)
);

-- ----------------------------
-- Auto increment value for tbl_setting
-- ----------------------------

PRAGMA foreign_keys = true;
