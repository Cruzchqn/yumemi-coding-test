// APIから返ってくる都道府県データの型
export interface Prefecture {
  prefCode: number
  prefName: string
}

// APIから返ってくる人口構成のデータカテゴリの型
export interface PopulationCategory {
  label: string
  data: {
    year: number
    value: number
  }[]
}

