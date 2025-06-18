/**
 * Discord スラッシュコマンド登録スクリプト
 * 
 * このスクリプトは、Discord APIを使用してボットのスラッシュコマンドを登録します。
 * 実行前に.dev.varsファイルに必要な環境変数を設定する必要があります。
 * 
 * 使用方法: npm run register
 */

const { REST, Routes } = require('discord.js');
// .dev.varsファイルから環境変数を読み込む（dotenvの代替設定）
require('dotenv').config({ path: '.dev.vars' });

/**
 * 登録するスラッシュコマンドの定義
 * 各コマンドはnameとdescriptionを必須で持ち、
 * オプションでパラメータ（options）を定義できます
 */
const commands = [
  {
    name: 'ping',
    description: 'ボットの応答性を確認',
  },
  {
    name: 'hello',
    description: 'フレンドリーな挨拶を返す',
  },
  {
    name: 'echo',
    description: 'あなたのメッセージをそのまま返す',
    options: [
      {
        name: 'message',
        type: 3, // STRING型を示す定数
        description: 'エコーするメッセージ',
        required: true, // 必須パラメータ
      },
    ],
  },
  {
    name: 'serverinfo',
    description: '現在のサーバーの情報を表示',
  },
  {
    name: 'help',
    description: '利用可能なコマンドを表示',
  },
];

// Discord REST APIクライアントの初期化
// バージョン10のAPIを使用し、ボットトークンで認証
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

/**
 * コマンド登録の実行
 * 非同期関数を即時実行（IIFE: Immediately Invoked Function Expression）
 */
(async () => {
  try {
    console.log('アプリケーションコマンド（/）の更新を開始しました。');

    // Discord APIにコマンドを登録
    // グローバルコマンドとして登録（全サーバーで利用可能）
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
      { body: commands },
    );

    console.log('アプリケーションコマンド（/）の更新が正常に完了しました。');
  } catch (error) {
    // エラーが発生した場合は詳細を表示
    console.error('コマンドの登録中にエラーが発生しました:', error);
  }
})();