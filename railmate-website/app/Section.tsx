import React from 'react'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
  as?: keyof JSX.IntrinsicElements
}

export default function Section({ children, className = '', id, as: Tag = 'section' }: SectionProps) {
  return (
    <Tag id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </Tag>
  )
}
