'use client'

import React from 'react'
import { PopulationCategory } from '@/types'

// 親から渡されるデータの型を定義
interface Props {
  populationData: {
    prefName: string
    data: PopulationCategory[]
  }[]
}

const PopulationGraph: React.FC<Props> = ({ populationData = [] }) => {
  // 受け取ったデータをブラウザのコンソールに出力して確認できます
  console.log('Received data for graph:', populationData);

  return (
    <section className="w-full max-w-4xl h-96">
      <h2 className="text-xl font-bold mb-4 text-gray-700">人口推移グラフ</h2>
      <div className="w-full h-full p-4 border rounded-lg bg-gray-50 flex justify-center items-center">
        {populationData.length === 0 ? (
          <p className="text-gray-500">都道府県を選択すると、ここにグラフが表示されます。</p>
        ) : (
          <p className="text-gray-500">グラフを描画する準備ができました！</p>
        )}
      </div>
    </section>
  )
}

export default PopulationGraph

