/*
 Navicat Premium Data Transfer

 Source Server         : SQLite
 Source Server Type    : SQLite
 Source Server Version : 3030001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3030001
 File Encoding         : 65001

 Date: 18/03/2024 03:17:39
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for tbl_sealed
-- ----------------------------
DROP TABLE IF EXISTS "tbl_sealed";
CREATE TABLE "tbl_sealed" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "square_id " INTEGER(11),
  "setting_id" INTEGER(11),
  "name" text(255)
);

-- ----------------------------
-- Auto increment value for tbl_sealed
-- ----------------------------

PRAGMA foreign_keys = true;
