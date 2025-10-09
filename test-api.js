// .env.localファイルから環境変数を読み込む
require('dotenv').config({ path: './.env.local' });

// 非同期関数を定義して実行
async function testApiConnection() {
  console.log('API接続テストを開始します...');

  // .env.localからAPIキーを取得
  // ゆめみAPIでは変数名を `YUMEMI_API_KEY` に変更することを推奨しますが、
  // ここでは既存の設定を活かすため `RESAS_API_KEY` のまま進めます。
  const API_KEY = process.env.RESAS_API_KEY;

  if (!API_KEY) {
    console.error('エラー: .env.localファイルにRESAS_API_KEYが設定されていません。');
    return;
  }

  console.log('APIキーを正常に読み込みました。');

  try {
    console.log('ゆめみAPIに都道府県データをリクエストします...');
    // ★★★ URLを正しいゆめみAPIのものに変更 ★★★
    const res = await fetch(
      'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',
      {
        headers: {
          'X-API-KEY': API_KEY,
        },
      }
    );

    console.log(`ゆめみAPIからの応答ステータス: ${res.status}`);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('ゆめみAPIからエラー応答がありました:', errorBody);
      return;
    }

    const data = await res.json();

    console.log('テスト成功！ APIからデータを取得できました。');
    // @ts-ignore
    console.log('取得データ:', data.result.map(p => p.prefName).join(', ')); // 都道府県名だけを一覧表示

  } catch (error) {
    console.error('テスト中に予期せぬエラーが発生しました:', error);
  }
}

// テストを実行
testApiConnection();

