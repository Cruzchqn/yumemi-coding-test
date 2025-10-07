'use client'

import React from 'react'
import { Prefecture } from '@/types'

// 親から渡されるデータの型を定義
interface Props {
  prefectures: Prefecture[]
  onPrefectureChange: (
    prefCode: number,
    prefName: string,
    isChecked: boolean
  ) => void
}

const PrefectureSelector: React.FC<Props> = ({
  prefectures,
  onPrefectureChange,
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-700 border-b-2 pb-2">
        都道府県
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {prefectures.map((prefecture) => (
          <div key={prefecture.prefCode} className="flex items-center">
            <input
              type="checkbox"
              id={`pref-${prefecture.prefCode}`}
              className="mr-2 h-4 w-4"
              onChange={(e) =>
                onPrefectureChange(
                  prefecture.prefCode,
                  prefecture.prefName,
                  e.target.checked
                )
              }
            />
            <label
              htmlFor={`pref-${prefecture.prefCode}`}
              className="text-gray-800"
            >
              {prefecture.prefName}
            </label>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PrefectureSelector

