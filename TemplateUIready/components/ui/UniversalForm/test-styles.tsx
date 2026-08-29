'use client'

import type { FormConfig } from './types'
import UniversalForm from './UniversalForm'

const testConfig: FormConfig = {
  inputs: [
    {
      name: 'name',
      type: 'text',
      label: 'Назва',
      placeholder: 'Введіть назву',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Опис',
      placeholder: 'Введіть опис',
      rows: 3,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Категорія',
      placeholder: 'Оберіть категорію',
      options: [
        { value: 'cat1', label: 'Категорія 1' },
        { value: 'cat2', label: 'Категорія 2' },
      ],
    },
    {
      name: 'active',
      type: 'switch',
      label: 'Активний',
      defaultValue: true,
    },
  ],
  layout: 'vertical',
  size: 'md',
  spacing: 'md',
}

const TestStyles = () => {
  const handleSubmit = (values: Record<string, any>) => {
    console.log('Form values:', values)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Тест стилізації UniversalForm</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <UniversalForm
          config={testConfig}
          onSubmit={handleSubmit}
          submitText="Зберегти"
          cancelText="Скасувати"
        />
      </div>
    </div>
  )
}

export default TestStyles
