# Discord Bot on Cloudflare Workers

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/r3-yamauchi/my-1st-discord-bot-cfw)

Cloudflare Workers上で動作するDiscord botのテンプレートプロジェクトです。
`discord-hono`フレームワークを使用し、サーバーレス環境でDiscordのスラッシュコマンドを処理します。

## 🚀 特徴

- **サーバーレスアーキテクチャ**: Cloudflare Workersで動作し、インフラ管理が不要
- **高速レスポンス**: エッジコンピューティングによる低レイテンシ（全世界300+のロケーション）
- **TypeScript対応**: 型安全な開発が可能
- **簡単なデプロイ**: Wranglerを使用したワンコマンドデプロイ
- **スケーラブル**: Cloudflareのグローバルネットワークで自動スケーリング
- **コスト効率**: 1日10万リクエストまで無料（Workers Free Plan）
- **discord-hono**: Cloudflare Workers向けに最適化されたDiscordフレームワーク
- **Interactions Endpoint**: WebSocketではなくHTTPベースの通信方式を採用

## 📋 前提条件

- Node.js 18以上
- npm（または他のパッケージマネージャー）
- Cloudflareアカウント
- Discord開発者アカウント

## 🛠️ セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/r3-yamauchi/my-1st-discord-bot-cfw.git
cd my-1st-discord-bot-cfw
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Discord アプリケーションの作成

1. [Discord Developer Portal](https://discord.com/developers/applications)にアクセス
2. 「New Application」をクリックしてアプリケーションを作成
3. 「Bot」セクションでボットを作成
4. 以下の情報をメモ:
   - Application ID（General Information）
   - Public Key（General Information）
   - Bot Token（Bot セクション）

### 4. 環境変数の設定

`.dev.vars.example`を`.dev.vars`にコピーして、取得した値を設定:

```bash
cp .dev.vars.example .dev.vars
```

`.dev.vars`を編集:
```
DISCORD_APPLICATION_ID=あなたのアプリケーションID
DISCORD_PUBLIC_KEY=あなたの公開鍵
DISCORD_BOT_TOKEN=あなたのボットトークン
```

### 5. スラッシュコマンドの登録

```bash
npm run register
```

## 🔧 開発

### ローカル開発サーバーの起動

```bash
npm run dev
```

Wranglerがローカル開発サーバーを起動します。変更は自動的に反映されます。

### 利用可能なコマンド

- `/ping` - ボットの応答性を確認
- `/hello` - フレンドリーな挨拶を返す
- `/echo <メッセージ>` - 入力したメッセージをそのまま返す
- `/serverinfo` - 現在のサーバーの情報を表示
- `/help` - 利用可能なコマンドを表示

## 📦 デプロイ

### 1. Cloudflare Workersへのデプロイ

```bash
npm run deploy
```

### 2. 環境変数の設定（本番環境）

```bash
wrangler secret put DISCORD_APPLICATION_ID
wrangler secret put DISCORD_PUBLIC_KEY
wrangler secret put DISCORD_BOT_TOKEN
```

### 3. Discord Interactions Endpointの設定

1. Discord Developer Portalに戻る
2. 「General Information」タブを開く
3. 「Interactions Endpoint URL」にWorkerのURLを設定
   - 形式: `https://my-1st-discord-bot.your-subdomain.workers.dev`
4. 「Save Changes」をクリック

### 4. ボットをサーバーに招待

1. 「OAuth2」→「URL Generator」に移動
2. Scopes: `bot`と`applications.commands`を選択
3. Bot Permissions: 必要な権限を選択
4. 生成されたURLでボットをサーバーに招待

## 📂 プロジェクト構造

```
my-1st-discord-bot-cfw/
├── src/
│   ├── index.ts          # メインアプリケーション
│   └── types.ts          # TypeScript型定義
├── scripts/
│   └── register-commands.js  # コマンド登録スクリプト
├── .dev.vars.example     # 環境変数テンプレート
├── .dev.vars            # 環境変数（gitignoreされています）
├── package.json         # プロジェクト設定
├── package-lock.json    # 依存関係のロックファイル
├── tsconfig.json        # TypeScript設定
├── wrangler.toml        # Cloudflare Workers設定
├── LICENSE              # MITライセンス
├── CLAUDE.md            # Claude Code用ドキュメント
├── .gitignore           # Git除外設定
└── README.md            # このファイル
```

## 🧩 新しいコマンドの追加

### 1. コマンドハンドラーの追加（`src/index.ts`）

```typescript
.command('mycommand', (c) => {
  // コマンドのロジック
  const parameter = c.get('parameter'); // オプションの取得
  return c.res(`受け取ったパラメータ: ${parameter}`);
})
```

### 2. コマンド定義の追加（`scripts/register-commands.js`）

```javascript
{
  name: 'mycommand',
  description: 'コマンドの説明',
  options: [
    {
      name: 'parameter',
      type: 3, // STRING
      description: 'パラメータの説明',
      required: true,
    },
  ],
}
```

### 3. コマンドの再登録

```bash
npm run register
```

### オプションのタイプ

- `3` - STRING（文字列）
- `4` - INTEGER（整数）
- `5` - BOOLEAN（真偽値）
- `6` - USER（ユーザー）
- `7` - CHANNEL（チャンネル）
- `8` - ROLE（ロール）
- `9` - MENTIONABLE（メンション可能）
- `10` - NUMBER（数値）
- `11` - ATTACHMENT（添付ファイル）

## 🔍 デバッグ

### ローカルログの確認

開発サーバー実行中のコンソール出力を確認

### 本番環境のログ

```bash
wrangler tail
```

またはCloudflareダッシュボードから:
1. Workers & Pages → 該当のWorker
2. 「Logs」タブで確認

### よくあるエラー

1. **「Invalid Interaction」エラー**
   - 環境変数が正しく設定されているか確認
   - Public Keyが正しいか確認

2. **コマンドが表示されない**
   - `npm run register`を実行したか確認
   - ボットに必要な権限があるか確認

3. **「Application did not respond」エラー**
   - Workerが正しくデプロイされているか確認
   - エンドポイントURLが正しいか確認
   - 3秒以内に応答を返しているか確認

## 🚧 制限事項

### Cloudflare Workersの制限
- **CPU時間**: 1リクエストあたり最大10ms（無料プラン）/ 30ms（有料プラン）
- **バックグラウンド処理**: 最大30秒
- **メモリ**: 128MB
- **リクエストサイズ**: 最大100MB
- **リクエスト数**: 1日10万リクエストまで無料

### Discord Botの制限
- **WebSocket**: 非対応（音声機能などは使用不可）
- **ファイルストレージ**: 永続的なファイル保存は不可
- **インタラクション応答**: 3秒以内に初回応答が必須

## 📄 ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 🔗 参考リンク

- [Discord Developer Documentation](https://discord.com/developers/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [discord-hono Documentation](https://github.com/holic/discord-hono)
- [Hono Documentation](https://hono.dev/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Discord.js Documentation](https://discord.js.org/)
