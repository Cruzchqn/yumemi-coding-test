'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { PopulationCategory, ChartDataPoint } from '@/types'

type PopulationLabel = '総人口' | '年少人口' | '生産年齢人口' | '老年人口'

// 親から渡されるデータの型を定義
interface Props {
  populationData: {
    prefName: string
    data: PopulationCategory[]
  }[]
  selectedLabel: PopulationLabel
}

// 人口数を読みやすい形式にフォーマットする関数
const formatPopulation = (value: number) => {
  if (value >= 10000) {
    return `${(value / 10000).toLocaleString()}万`
  }
  return value.toLocaleString()
}

const PopulationGraph: React.FC<Props> = ({
  populationData = [],
  selectedLabel,
}) => {
  // データをRechartsが扱いやすい形式に変換する
  const transformData = (): ChartDataPoint[] => {
    if (populationData.length === 0) {
      return []
    }

    const allYears = new Set<number>()
    const dataByYear: { [year: number]: { [prefName: string]: number } } = {}

    // 全ての都道府県の選択されたラベルのデータから年を収集
    populationData.forEach(({ data }) => {
      const targetData = data.find((d) => d.label === selectedLabel)
      if (targetData) {
        targetData.data.forEach((point) => {
          allYears.add(point.year)
        })
      }
    })

    const sortedYears = Array.from(allYears).sort()

    // Recharts用のデータ構造を初期化
    sortedYears.forEach((year) => {
      dataByYear[year] = {}
    })

    // 各都道府県の人口を年ごとに追加
    populationData.forEach(({ prefName, data }) => {
      const targetData = data.find((d) => d.label === selectedLabel)
      if (targetData) {
        targetData.data.forEach((point) => {
          if (sortedYears.includes(point.year)) {
            dataByYear[point.year][prefName] = point.value
          }
        })
      }
    })

    return sortedYears.map((year) => ({
      year,
      ...dataByYear[year],
    }))
  }

  const chartData = transformData()
  const prefectureNames = populationData.map((p) => p.prefName)

  // グラフの色を動的に生成
  const COLORS = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#0088fe',
    '#00c49f',
    '#ffbb28',
    '#e91e63',
    '#673ab7',
    '#2196f3',
  ]

  return (
    <section className="w-full max-w-5xl h-[500px] mx-auto mt-8">
      {populationData.length === 0 ? (
        <div className="w-full h-full p-4 border rounded-lg bg-gray-50 flex justify-center items-center">
          <p className="text-gray-500">
            都道府県を選択すると、ここにグラフが表示されます。
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{ value: '年度', position: 'insideBottomRight', offset: 0 }}
            />
            <YAxis
              tickFormatter={formatPopulation}
              label={{
                value: '人口数',
                angle: -90,
                position: 'insideLeft',
                dx: -10,
              }}
            />
            <Tooltip
              formatter={(value: number) => `${value.toLocaleString()}人`}
            />
            <Legend />
            {prefectureNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                connectNulls // データがない年があっても線を繋げる
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}

export default PopulationGraph

