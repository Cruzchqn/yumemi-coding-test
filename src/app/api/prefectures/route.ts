import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.RESAS_API_KEY

  if (!API_KEY) {
    console.error('Error: RESAS_API_KEY is not configured in .env.local')
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    )
  }

  try {
    // ★★★ URLを正しいゆめみAPIのものに変更 ★★★
    const res = await fetch(
      'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',
      {
        headers: {
          'X-API-KEY': API_KEY,
        },
        next: { revalidate: 3600 }, // 1時間キャッシュする
      }
    )

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(
        `Error from Yumemi API: ${res.status} ${res.statusText}`,
        errorBody
      )
      return NextResponse.json(
        { error: 'Failed to fetch data from Yumemi API' },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Internal Server Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

