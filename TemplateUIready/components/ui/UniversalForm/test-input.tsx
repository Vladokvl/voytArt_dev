'use client'

import { useState } from 'react'
import type { FormConfig } from './types'
import UniversalForm from './UniversalForm'

const simpleConfig: FormConfig = {
  inputs: [
    {
      name: 'name',
      type: 'text',
      label: 'Назва',
      placeholder: 'Введіть назву',
      required: true,
    },
    {
      name: 'active',
      type: 'switch',
      label: 'Активний',
      checkedValue: true,
      uncheckedValue: false,
      defaultValue: true,
    },
  ],
  layout: 'vertical',
  size: 'md',
}

const TestInput = () => {
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (values: Record<string, any>) => {
    console.log('Form submitted:', values)
    setFormData(values)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Тест введення UniversalForm</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <UniversalForm
          config={simpleConfig}
          onSubmit={handleSubmit}
          submitText="Зберегти"
          cancelText="Скасувати"
        />
      </div>

      {Object.keys(formData).length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Отримані дані:</h2>
          <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default TestInput
