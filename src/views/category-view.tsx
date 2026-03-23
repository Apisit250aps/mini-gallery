'use client'

import { CategoryCreateAction } from '@/components/app/category/category-actions';
import CategoryDataTable from '@/components/app/category/category-data-table'
import React from 'react'

export default function CategoryView() {
  return (
    <div>
      <div className="flex justify-end">
        <CategoryCreateAction />
      </div>
      <CategoryDataTable />
    </div>
  )
}
