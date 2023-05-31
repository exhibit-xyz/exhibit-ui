import React, { useEffect, useState } from 'react'
import style from './PaginationControls.module.css'
import LeftArrowIcon from '@/icons/LeftArrowIcon'
import RightArrowIcon from '@/icons/RightArrowIcon'

export interface PaginationControlsProps {
  page: number
  onPage: (page: number) => void
  pages: number
}

export default function PaginationControls ({
  page,
  onPage,
  pages
}: PaginationControlsProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(String(page + 1))
  }, [page])

  return (
    <div className={`${style.paginationBtns} mb-4`}>
      <button
        className={style.paginationBtn}
        onClick={() => onPage(page - 1)}
        disabled={page <= 0}
      >
        <LeftArrowIcon />
      </button>
      <div className={style.paginationText}>
        <input
          className={`${style.pageNumber} bg-gray-100 dark:bg-gray-900 text-black dark:text-white`}
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          value={value}
          onChange={e => {
            setValue(e.currentTarget.value)
            const page = +e.currentTarget.value - 1
            if (Number.isInteger(page) && page >= 0 && page < pages) {
              onPage(page)
            }
          }}
        />
        <span>of</span>
        <span className={style.pageNumber}>{pages}</span>
      </div>
      <button
        className={style.paginationBtn}
        onClick={() => onPage(page + 1)}
        disabled={page >= pages - 1}
      >
        <RightArrowIcon />
      </button>
    </div>
  )
}
