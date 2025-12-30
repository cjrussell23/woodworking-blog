'use client'

import React from 'react'

interface FileSizeCellProps {
  cellData?: number
}

const FileSizeCell: React.FC<FileSizeCellProps> = ({ cellData }) => {
  if (!cellData) return <span>—</span>

  const sizeInMB = (cellData / (1024 * 1024)).toFixed(2)
  return <span>{sizeInMB} MB</span>
}

export default FileSizeCell
