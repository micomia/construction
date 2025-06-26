# React + TypeScript + Vite

このリポジトリは、React と TypeScript を Vite 上で動かすための最小テンプレートです。HMR (Hot Module Replacement) が有効になっており、基本的な ESLint 設定も含まれています。

## はじめに

このプロジェクトは React と TypeScript を利用した Web アプリケーション開発のスターターテンプレートです。新しくアサインされた開発者は、下記の手順で環境を構築し、作業の進捗やメモを `dev_log.md` に記録してください。

## 開発用サーバーの起動
```bash
npm install
npm run dev
```
上記コマンドでローカルサーバーが起動します。ブラウザで http://localhost:5173 などの URL にアクセスすると動作を確認できます。

## 主な Vite プラグイン

現在、公式から次の 2 つのプラグインが提供されています。

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) : Babel を利用した Fast Refresh 対応
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) : SWC を利用した Fast Refresh 対応

## ESLint 設定を拡張する

本番アプリケーションの開発時には、型情報を利用したルールを有効にすることをおすすめします。

```js
export default tseslint.config({
  extends: [
    // ...tseslint.configs.recommended を削除してこちらを利用
    ...tseslint.configs.recommendedTypeChecked,
    // さらに厳しくしたい場合はこちら
    ...tseslint.configs.strictTypeChecked,
    // コードスタイルを統一したい場合はこちらも追加
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // その他のオプション
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

React 特有のルールを追加する場合は、以下のプラグインを導入できます。

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // react-x と react-dom プラグインを追加
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // そのほかのルール...
    // 推奨 TypeScript ルールを有効化
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
