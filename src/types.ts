/**
 * 環境変数の型定義
 * 
 * Cloudflare Workersで使用される環境変数のインターフェースを定義します。
 * これらの値は、開発時は.dev.varsファイルから、
 * 本番環境ではCloudflareのダッシュボードまたはwrangler secretコマンドで設定されます。
 */
export interface Env {
  /**
   * Discord アプリケーションID
   * Discord Developer Portalで作成したアプリケーションのID
   */
  DISCORD_APPLICATION_ID: string;
  
  /**
   * Discord 公開鍵
   * インタラクションの検証に使用される公開鍵
   * Discord Developer Portalのアプリケーション設定から取得
   */
  DISCORD_PUBLIC_KEY: string;
  
  /**
   * Discord ボットトークン
   * ボットの認証に使用されるトークン
   * コマンドの登録やAPIアクセスに必要
   */
  DISCORD_BOT_TOKEN: string;
}