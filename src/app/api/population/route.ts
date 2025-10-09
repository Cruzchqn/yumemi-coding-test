import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const prefCode = searchParams.get('prefCode')

  if (!prefCode) {
    return NextResponse.json(
      { error: 'prefCode is required' },
      { status: 400 }
    )
  }

  const API_KEY = process.env.RESAS_API_KEY
  if (!API_KEY) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    )
  }

  try {
    // ★★★ URLを正しいゆめみAPIのものに変更 ★★★
    const res = await fetch(
      `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`,
      {
        headers: {
          'X-API-KEY': API_KEY,
        },
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

