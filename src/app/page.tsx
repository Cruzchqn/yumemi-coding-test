'use client'

import { useEffect, useState } from 'react'
import PrefectureSelector from '@/components/PrefectureSelector'
import PopulationGraph from '@/components/PopulationGraph'
import { Prefecture, PopulationCategory } from '@/types'

// APIレスポンス全体の型
interface ApiResponse<T> {
  message: null | string
  result: T
}

// 人口構成APIのレスポンスの型
interface PopulationCompositionResponse {
  boundaryYear: number
  data: PopulationCategory[]
}

const POPULATION_LABELS = [
  '総人口',
  '年少人口',
  '生産年齢人口',
  '老年人口',
] as const

type PopulationLabel = (typeof POPULATION_LABELS)[number]

export default function Home() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([])
  const [selectedPrefectures, setSelectedPrefectures] = useState<
    Map<number, string>
  >(new Map())
  const [populationData, setPopulationData] = useState<
    {
      prefName: string
      data: PopulationCategory[]
    }[]
  >([])
  const [selectedLabel, setSelectedLabel] =
    useState<PopulationLabel>('総人口')

  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const res = await fetch('/api/prefectures')
        const data: ApiResponse<Prefecture[]> = await res.json()
        if (data.result) {
          setPrefectures(data.result)
        }
      } catch (error) {
        console.error('Failed to fetch prefectures:', error)
      }
    }
    fetchPrefectures()
  }, [])

  const handlePrefectureChange = async (
    prefCode: number,
    prefName: string,
    isChecked: boolean
  ) => {
    const newSelected = new Map(selectedPrefectures)
    if (isChecked) {
      newSelected.set(prefCode, prefName)
      // すでに人口データがある場合はAPIを叩かない
      if (populationData.some((p) => p.prefName === prefName)) {
        setSelectedPrefectures(newSelected)
        return
      }
      try {
        const res = await fetch(`/api/population?prefCode=${prefCode}`)
        const data: ApiResponse<PopulationCompositionResponse> =
          await res.json()

        if (data.result) {
          setPopulationData((prevData) => [
            ...prevData,
            { prefName, data: data.result.data },
          ])
        }
      } catch (error) {
        console.error(`Failed to fetch population for ${prefName}:`, error)
      }
    } else {
      newSelected.delete(prefCode)
    }
    setSelectedPrefectures(newSelected)
  }

  const filteredPopulationData = populationData.filter((p) =>
    Array.from(selectedPrefectures.values()).includes(p.prefName)
  )

  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="text-center my-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
          都道府県別総人口推移グラフ
        </h1>
      </header>

      <PrefectureSelector
        prefectures={prefectures}
        onPrefectureChange={handlePrefectureChange}
      />

      <section className="mt-8 text-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {POPULATION_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedLabel(label)}
              className={`px-4 py-2 text-sm font-medium border ${
                selectedLabel === label
                  ? 'bg-blue-600 text-white border-blue-600 z-10'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
              } first:rounded-l-lg last:rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-500`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <PopulationGraph
        populationData={filteredPopulationData}
        selectedLabel={selectedLabel}
      />
    </main>
  )
}

