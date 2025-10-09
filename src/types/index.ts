// 都道府県APIのレスポンスの型
export interface Prefecture {
  prefCode: number
  prefName: string
}

// 人口構成APIのレスポンスの型（"総人口"など、カテゴリごとのデータ）
export interface PopulationCategory {
  label: string
  data: {
    year: number
    value: number
  }[]
}

// グラフ描画用に整形したデータの型
export interface ChartDataPoint {
  year: number
  [key: string]: number // 例: { year: 1980, "北海道": 5575989, "東京都": 11618281 }
}

