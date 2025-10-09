import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'

// `fetch`関数がテスト中にエラーを起こさないように、偽の応答を返すように設定（モック化）
global.fetch = jest.fn((url) => {
  if (String(url).includes('/api/prefectures')) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          message: null,
          result: [
            { prefCode: 1, prefName: '北海道' },
            { prefCode: 2, prefName: '青森県' },
          ],
        }),
      ok: true,
    })
  }
  return Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
  })
}) as jest.Mock

describe('Home Page', () => {
  // テストケース1: メインの見出しが正しく表示されるか
  // findByRole を使って非同期に要素を待つように修正
  it('renders the main heading', async () => {
    render(<Home />)

    // "都道府県別総人口推移グラフ"というテキストを持つh1要素を探す
    // getByRoleからfindByRoleに変更
    const heading = await screen.findByRole('heading', {
      name: /都道府県別総人口推移グラフ/i,
    })

    // 見出しが画面に存在することを期待する
    expect(heading).toBeInTheDocument()
  })

  // テストケース2: APIから取得した都道府県のチェックボックスが表示されるか
  it('fetches and displays prefecture checkboxes', async () => {
    render(<Home />)

    // findByLabelTextは元々非同期なので、このままでOK
    const checkboxHokkaido = await screen.findByLabelText('北海道')
    const checkboxAomori = await screen.findByLabelText('青森県')

    expect(checkboxHokkaido).toBeInTheDocument()
    expect(checkboxAomori).toBeInTheDocument()
  })
})

