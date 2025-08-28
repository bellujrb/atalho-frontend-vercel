"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], item: T) => ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
}

export function DataTable<T>({ data, columns, className }: DataTableProps<T>) {
  return (
    <div className={cn("w-full", className)}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className={`grid gap-4 px-6 py-4`} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
            {columns.map((column) => (
              <div key={String(column.key)} className="text-sm font-medium text-gray-900">
                {column.header}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <div
              key={index}
              className={`grid gap-4 px-6 py-4 hover:bg-gray-50 transition-colors`}
              style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
            >
              {columns.map((column) => (
                <div key={String(column.key)} className="text-sm text-gray-900">
                  {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
