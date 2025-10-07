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
    const res = await fetch(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`,
      {
        headers: {
          'X-API-KEY': API_KEY,
        },
      }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data from RESAS API' },
      { status: 500 }
    )
  }
}
