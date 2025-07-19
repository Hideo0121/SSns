-- SSns データベース初期化スクリプト

-- データベースが存在しない場合のみ作成
CREATE DATABASE IF NOT EXISTS ssns CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 権限設定
GRANT ALL PRIVILEGES ON ssns.* TO 'ssns_user'@'%';
GRANT ALL PRIVILEGES ON ssns.* TO 'root'@'%';
FLUSH PRIVILEGES;

-- デフォルトデータベースに切り替え
USE ssns;