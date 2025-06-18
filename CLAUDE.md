# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは、Cloudflare Workers上で動作するDiscord botで、`discord-hono`フレームワークを使用しています。サーバーレス環境でDiscordのインタラクション（スラッシュコマンド）を処理するように設計されています。

### 主な特徴
- **サーバーレスアーキテクチャ**: Cloudflare Workersで動作し、インフラ管理が不要
- **エッジコンピューティング**: 世界300以上のロケーションから低レイテンシで応答
- **TypeScript**: 型安全な開発環境を提供
- **discord-hono**: Cloudflare Workers向けに最適化されたDiscordフレームワーク

## 開発コマンド

```bash
npm install      # 依存関係のインストール
npm run dev      # Wranglerを使用してローカル開発サーバーを起動
npm run deploy   # Cloudflare Workersにデプロイ
npm run register # Discordスラッシュコマンドを登録（初回セットアップ時とコマンド変更時に必要）
wrangler tail    # デプロイ済みWorkerのリアルタイムログを表示
```

**注意**: 本プロジェクトにはlinter、formatter、テストフレームワークは設定されていません。TypeScriptのコンパイラチェックのみが利用可能です。

## アーキテクチャ

### コア構造
- **エントリーポイント**: `src/index.ts` - `DiscordHono`インスタンスを作成し、すべてのコマンドハンドラーを定義
- **型定義**: `src/types.ts` - 環境変数のインターフェース（`Env`）を定義
- **コマンド登録**: `scripts/register-commands.js` - Discord APIを使用してスラッシュコマンドを登録するNode.jsスクリプト
- **ライセンス**: `LICENSE` - MITライセンスファイル

### フレームワークの特徴
- `discord-hono`はCloudflare Workers向けに最適化されたDiscord botフレームワーク
- Interactions Endpointモデルを使用（WebSocketではなくHTTPベース）
- リクエストごとに最大10ms、バックグラウンド処理は30秒の制限
- `nodejs_compat`互換性フラグにより、Node.js APIのサポートが有効化

### 実装されているコマンド
```typescript
.command('ping', ...)      // ヘルスチェック - ボットの応答性を確認
.command('hello', ...)     // ユーザー名を含む挨拶 - フレンドリーな挨拶を返す
.command('echo', ...)      // メッセージエコー（オプション付き）- 入力をそのまま返す
.command('serverinfo', ...) // サーバー情報表示（埋め込みメッセージ）
.command('help', ...)      // ヘルプメッセージ（埋め込みメッセージ）- 利用可能なコマンド一覧
```

## 環境変数設定

開発時は`.dev.vars`ファイルに以下を設定：
```
DISCORD_APPLICATION_ID=<アプリケーションID>
DISCORD_PUBLIC_KEY=<公開鍵>
DISCORD_BOT_TOKEN=<ボットトークン>
```

本番環境では`wrangler secret`コマンドまたはCloudflareダッシュボードで設定：
```bash
wrangler secret put DISCORD_APPLICATION_ID
wrangler secret put DISCORD_PUBLIC_KEY
wrangler secret put DISCORD_BOT_TOKEN
```

## 新機能追加時の注意点

### 1. 新しいコマンドを追加する場合
- `src/index.ts`にコマンドハンドラーを追加（メソッドチェーンで`.command()`を追加）
- `scripts/register-commands.js`のcommands配列に定義を追加（name、description、optionsを指定）
- `npm run register`を実行してDiscordに登録
- オプションのtype値: 3=STRING, 4=INTEGER, 5=BOOLEAN, 6=USER, 7=CHANNEL, 8=ROLE

### 2. 埋め込みメッセージを使用する場合
- `c.res()`に埋め込みオブジェクトを含むレスポンスを返す
- 色は16進数値で指定（例: `0x5865F2` = Discord Blurple）
- フィールドは`{ name, value, inline }`の形式
- タイムスタンプは`new Date().toISOString()`で追加可能

### 3. 型安全性
- すべての環境変数は`src/types.ts`の`Env`インターフェースに追加
- `DiscordHono<Env>`でジェネリクスを使用して型安全性を確保
- `c.interaction`から利用可能なプロパティ: `member`, `user`, `guild`など
- discord-honoは`c.get()`メソッドでコマンドオプションを取得

### 4. エラーハンドリング
- ギルド専用コマンドは`c.interaction.guild`の存在をチェック
- 必須オプションは`c.get('<option_name>')`で取得し、nullチェックを実施
- ユーザーフレンドリーなエラーメッセージを返す

## 既知の問題と回避策

### 1. discord-honoの型定義
- 一部のメソッドや プロパティがTypeScriptの型定義に含まれていない場合がある
- 必要に応じて型アサーションを使用

### 2. Discord API型定義
- `APIPartialInteractionGuild`型では一部のプロパティ（`name`、`member_count`など）が欠けている場合がある
- オプショナルチェーニング（`?.`）を使用して安全にアクセス

### 3. Cloudflare Workers制限
- CPU実行時間: 10ms（無料プラン）/ 30ms（有料プラン）
- メモリ: 128MB
- リクエストサイズ: 最大100MB

## デプロイメントフロー

1. **開発環境でテスト**
   - `npm run dev`でローカルサーバーを起動
   - ngrokなどでトンネリング（オプション）

2. **本番環境へのデプロイ**
   - 環境変数が正しく設定されていることを確認
   - `npm run deploy`でCloudflare Workersにデプロイ
   - WorkerのURLをコピー（例: `https://your-worker.your-subdomain.workers.dev`）

3. **Discord設定**
   - Discord Developer PortalでInteractions Endpoint URLを設定
   - エンドポイントの検証が成功することを確認

4. **ボットの招待**
   - OAuth2 URL Generatorで招待リンクを生成
   - 必要な権限を選択（最低限: Send Messages）
   - サーバーに招待

## プロジェクト構成の詳細

### TypeScript設定（tsconfig.json）
- **target**: ES2022 - 最新のJavaScript機能を使用
- **module**: ESNext - ESモジュール形式
- **strict**: true - 厳格な型チェックを有効化
- **moduleResolution**: Bundler - Cloudflare Workers向けの設定

### Wrangler設定（wrangler.toml）
- **name**: my-1st-discord-bot-cfw - Worker名
- **main**: src/index.ts - エントリーポイント
- **compatibility_date**: 2024-06-18 - Workers APIの互換性日付
- **node_compat**: true - Node.js API互換性を有効化

### 依存関係
- **discord-hono**: ^0.19.3 - Discord bot フレームワーク
- **hono**: ^4.8.0 - Webフレームワーク（discord-honoの基盤）
- **@cloudflare/workers-types**: 開発時の型定義
- **discord.js**: コマンド登録スクリプト用
- **wrangler**: Cloudflare CLIツール

## 重要なファイルと役割

- `src/index.ts`: Discord botのメインロジック。すべてのコマンドハンドラーが定義されている
- `src/types.ts`: 環境変数の型定義。新しい環境変数を追加する際はここを更新
- `scripts/register-commands.js`: Discord APIにコマンドを登録するスクリプト。コマンドの定義を変更した場合は必ず実行
- `wrangler.toml`: Cloudflare Workersの設定ファイル。プロジェクト名やエントリーポイントを定義
- `.dev.vars.example`: 環境変数のテンプレート。新規開発者向けのドキュメント
- `LICENSE`: MITライセンスファイル
- `README.md`: プロジェクトのメインドキュメント

## デバッグとトラブルシューティング

### ローカル開発時
- **TypeScriptエラー**: `npm run dev`実行時のエラーは型定義の問題が多い
- **環境変数エラー**: `.dev.vars`ファイルの設定を確認
- **コンソールログ**: 開発サーバーのターミナルで確認

### 本番環境
- **リアルタイムログ**: `wrangler tail`でストリーミングログを確認
- **Cloudflareダッシュボード**: Workers & Pages → 該当のWorker → Logsタブ
- **エラートラッキング**: Workers Analyticsでエラー率を監視

### よくある問題
1. **「Invalid Interaction」エラー**
   - Public Keyの設定ミス
   - 環境変数が正しく設定されていない

2. **コマンドが表示されない**
   - `npm run register`の実行忘れ
   - グローバル登録の場合、反映まで最大1時間かかる

3. **「Application did not respond」エラー**
   - 3秒以内に応答していない
   - Workerがクラッシュしている
   - エンドポイントURLが間違っている

## ベストプラクティス

### コード品質
- すべてのコマンドに日本語コメントを追加
- エラーハンドリングを適切に実装
- 型安全性を維持（anyの使用を避ける）

### パフォーマンス
- 重い処理は避ける（10ms制限）
- 必要最小限のAPIコールに留める
- キャッシュの活用を検討

### セキュリティ
- 環境変数にセンシティブな情報を保存
- ユーザー入力の検証を実施
- 権限チェックを適切に行う

### メンテナンス
- 定期的な依存関係の更新
- ログの監視とアラート設定
- ドキュメントの最新化
