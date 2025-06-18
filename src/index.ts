/**
 * Discord Bot for Cloudflare Workers
 * 
 * このファイルは、Cloudflare Workers上で動作するDiscord botのメインエントリーポイントです。
 * discord-honoフレームワークを使用して、Discordのインタラクション（スラッシュコマンド）を処理します。
 */

import { DiscordHono } from 'discord-hono';
import { Env } from './types';

// DiscordHonoアプリケーションのインスタンスを作成
// Env型を使用して環境変数の型安全性を確保
const app = new DiscordHono<Env>();

// コマンドハンドラーの定義
// メソッドチェーンを使用して複数のコマンドを登録
app
  // /ping コマンド: ボットの応答性を確認するための基本的なコマンド
  .command('ping', (c) => {
    return c.res('Pong! 🏓');
  })
  
  // /hello コマンド: ユーザーに対して個人的な挨拶を返す
  .command('hello', (c) => {
    // ユーザー名の取得優先順位:
    // 1. サーバーメンバーのグローバル名
    // 2. ユーザーのグローバル名
    // 3. デフォルト値 'there'
    const name = c.interaction.member?.user.global_name || c.interaction.user?.global_name || 'there';
    return c.res(`こんにちは、${name}さん! 👋`);
  })
  
  // /echo コマンド: ユーザーが入力したメッセージをそのまま返す
  .command('echo', (c) => {
    // コマンドオプションから'message'パラメータを取得
    // discord-honoではc.get()を使用してオプション値を取得
    const message = c.get('message');
    
    // メッセージが提供されていない場合のエラーハンドリング
    if (!message) {
      return c.res('エコーするメッセージを入力してください！');
    }
    
    return c.res(`あなたは言いました: ${message}`);
  })
  
  // /serverinfo コマンド: 現在のサーバーの情報を表示
  .command('serverinfo', (c) => {
    // ギルド（サーバー）情報の取得
    const guild = c.interaction.guild;
    
    // DM（ダイレクトメッセージ）での使用を防ぐためのチェック
    if (!guild) {
      return c.res('このコマンドはサーバー内でのみ使用できます！');
    }
    
    // 埋め込みメッセージを使用してサーバー情報を表示
    return c.res({
      embeds: [{
        title: `サーバー情報: ${guild.name}`,
        fields: [
          { name: 'サーバーID', value: guild.id, inline: true },
          { name: 'メンバー数', value: guild.member_count?.toString() || '不明', inline: true },
        ],
        color: 0x5865F2, // Discord Blurple（Discord公式の紫色）
        timestamp: new Date().toISOString(),
      }],
    });
  })
  
  // /help コマンド: 利用可能なコマンド一覧を表示
  .command('help', (c) => {
    // 埋め込みメッセージを使用してヘルプ情報を表示
    return c.res({
      embeds: [{
        title: '📋 利用可能なコマンド',
        description: '以下のコマンドが使用できます:',
        fields: [
          { name: '/ping', value: 'ボットの応答性を確認', inline: false },
          { name: '/hello', value: 'フレンドリーな挨拶を返す', inline: false },
          { name: '/echo <メッセージ>', value: 'あなたのメッセージをそのまま返す', inline: false },
          { name: '/serverinfo', value: '現在のサーバーの情報を表示', inline: false },
          { name: '/help', value: 'このヘルプメッセージを表示', inline: false },
        ],
        color: 0x00FF00, // 緑色（成功を示す色）
        footer: {
          text: 'Discord Bot on Cloudflare Workers',
        },
      }],
    });
  });

// Cloudflare Workersのエントリーポイントとしてエクスポート
export default app;