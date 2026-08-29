import { z } from 'zod'
import { InputConfig, ValidationRule } from './types'

// Базові валідаційні правила
const createBaseValidation = (config: InputConfig): z.ZodType<any> => {
  // Перевіряємо, чи config існує
  if (!config) {
    console.warn('Config is undefined')
    return z.any()
  }
  let schema: z.ZodType<any> = z.any()

  // Визначаємо базовий тип на основі типу інпута
  switch (config.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
      schema = z.string()
      break
    case 'number':
      schema = z.union([z.string(), z.number()]).transform(val => {
        if (typeof val === 'string') {
          const num = parseFloat(val)
          return isNaN(num) ? 0 : num
        }
        return val
      })
      break
    case 'textarea':
      schema = z.string()
      break
    case 'select':
      schema = z.string()
      break
    case 'multiselect':
      schema = z.array(z.union([z.string(), z.number()]))
      break
    case 'checkbox':
      if (config.options) {
        schema = z.array(z.union([z.string(), z.number()]))
      } else {
        schema = z.boolean()
      }
      break
    case 'radio':
      schema = z.string()
      break
    case 'date':
      schema = z.union([z.string(), z.date()])
      break
    case 'file':
      schema = z.any() // File об'єкт
      break
    case 'switch':
      schema = z.union([z.boolean(), z.string(), z.number()])
      break
    default:
      schema = z.string()
  }

  // Додаємо обов'язковість
  if (config.required) {
    schema = schema.refine(
      val => {
        if (val === null || val === undefined) return false
        if (typeof val === 'string' && val.trim() === '') return false
        if (Array.isArray(val) && val.length === 0) return false
        return true
      },
      { message: `${config.label || config.name} is required!` }
    )
  } else {
    schema = schema.optional()
  }

  return schema
}

// Додаємо специфічні валідації
const addSpecificValidation = (schema: z.ZodType<any>, config: InputConfig): z.ZodType<any> => {
  // Перевіряємо, чи config існує
  if (!config) {
    console.warn('Config is undefined in addSpecificValidation')
    return schema
  }
  switch (config.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
      // Перевіряємо, чи це ZodString перед використанням методів
      if (schema instanceof z.ZodString) {
        let stringSchema = schema
        if (config.minLength) {
          stringSchema = stringSchema.min(config.minLength, {
            message: `Minimum length is ${config.minLength} characters!`,
          })
        }
        if (config.maxLength) {
          stringSchema = stringSchema.max(config.maxLength, {
            message: `Maximum length is ${config.maxLength} characters!`,
          })
        }
        if (config.pattern) {
          stringSchema = stringSchema.regex(new RegExp(config.pattern), {
            message: 'Invalid format!',
          })
        }
        if (config.type === 'email') {
          stringSchema = stringSchema.email({ message: 'Invalid email format!' })
        }
        if (config.type === 'url') {
          stringSchema = stringSchema.url({ message: 'Invalid URL format!' })
        }
        schema = stringSchema
      }
      break

    case 'number':
      schema = schema.refine(
        val => {
          const num = typeof val === 'string' ? parseFloat(val) : val
          return !isNaN(num)
        },
        { message: 'Must be a valid number!' }
      )

      if (config.min !== undefined) {
        schema = schema.refine(
          val => {
            const num = typeof val === 'string' ? parseFloat(val) : val
            return num >= config.min!
          },
          { message: `Minimum value is ${config.min}!` }
        )
      }

      if (config.max !== undefined) {
        schema = schema.refine(
          val => {
            const num = typeof val === 'string' ? parseFloat(val) : val
            return num <= config.max!
          },
          { message: `Maximum value is ${config.max}!` }
        )
      }
      break

    case 'textarea':
      if (schema instanceof z.ZodString) {
        let textareaSchema = schema
        if (config.minLength) {
          textareaSchema = textareaSchema.min(config.minLength, {
            message: `Minimum length is ${config.minLength} characters!`,
          })
        }
        if (config.maxLength) {
          textareaSchema = textareaSchema.max(config.maxLength, {
            message: `Maximum length is ${config.maxLength} characters!`,
          })
        }
        schema = textareaSchema
      }
      break

    case 'select':
      if (config.options) {
        const validValues = config.options.map(opt => opt.value)
        schema = schema.refine(val => validValues.includes(val), {
          message: 'Please select a valid option!',
        })
      }
      break

    case 'multiselect':
      if (config.options) {
        const validValues = config.options.map(opt => opt.value)
        schema = schema.refine(
          val => {
            if (!Array.isArray(val)) return false
            return val.every(v => validValues.includes(v))
          },
          {
            message: 'Please select valid options!',
          }
        )
      }
      break

    case 'checkbox':
      if (config.options) {
        const validValues = config.options.map(opt => opt.value)
        schema = schema.refine(
          val => {
            if (!Array.isArray(val)) return false
            return val.every(v => validValues.includes(v))
          },
          {
            message: 'Please select valid options!',
          }
        )
      }
      break

    case 'radio':
      if (config.options) {
        const validValues = config.options.map(opt => opt.value)
        schema = schema.refine(val => validValues.includes(val), {
          message: 'Please select a valid option!',
        })
      }
      break

    case 'date':
      schema = schema.refine(
        val => {
          if (typeof val === 'string') {
            const date = new Date(val)
            return !isNaN(date.getTime())
          }
          return val instanceof Date
        },
        { message: 'Invalid date format!' }
      )

      if (config.minDate) {
        schema = schema.refine(
          val => {
            const date = typeof val === 'string' ? new Date(val) : val
            return date >= config.minDate!
          },
          { message: `Date must be after ${config.minDate.toLocaleDateString()}!` }
        )
      }

      if (config.maxDate) {
        schema = schema.refine(
          val => {
            const date = typeof val === 'string' ? new Date(val) : val
            return date <= config.maxDate!
          },
          { message: `Date must be before ${config.maxDate.toLocaleDateString()}!` }
        )
      }
      break

    case 'file':
      if (config.maxSize) {
        schema = schema.refine(
          val => {
            if (!val || !(val instanceof File)) return true
            return val.size <= config.maxSize!
          },
          { message: `File size must be less than ${config.maxSize} bytes!` }
        )
      }
      break
  }

  return schema
}

// Генеруємо Zod схему для всієї форми
export const generateValidationSchema = (inputs: InputConfig[]): z.ZodObject<any> => {
  const schemaObject: Record<string, z.ZodType<any>> = {}

  inputs.forEach(input => {
    // Перевіряємо, чи input існує і має name
    if (!input || !input.name) {
      console.warn('Invalid input config:', input)
      return
    }

    let schema = createBaseValidation(input)
    schema = addSpecificValidation(schema, input)

    // Додаємо кастомну валідацію якщо є
    if (input.customValidation) {
      schema = schema.refine(input.customValidation, {
        message: input.errorMessage || 'Invalid value!',
      })
    }

    // Додаємо Zod схему якщо є
    if (input.validation) {
      schema = input.validation
    }

    schemaObject[input.name] = schema
  })

  return z.object(schemaObject)
}

// Генеруємо схему валідації з ValidationRule
export const generateSchemaFromRules = (
  rules: Record<string, ValidationRule>
): z.ZodObject<any> => {
  const schemaObject: Record<string, z.ZodType<any>> = {}

  Object.entries(rules).forEach(([fieldName, rule]) => {
    let schema: any = z.string()

    if (rule.required) {
      schema = schema.min(1, { message: `${fieldName} is required!` })
    } else {
      schema = schema.optional()
    }

    if (rule.minLength) {
      schema = schema.min(rule.minLength, {
        message: `Minimum length is ${rule.minLength} characters!`,
      })
    }

    if (rule.maxLength) {
      schema = schema.max(rule.maxLength, {
        message: `Maximum length is ${rule.maxLength} characters!`,
      })
    }

    if (rule.min !== undefined) {
      schema = schema.refine((val: any) => Number(val) >= rule.min!, {
        message: `Minimum value is ${rule.min}!`,
      })
    }

    if (rule.max !== undefined) {
      schema = schema.refine((val: any) => Number(val) <= rule.max!, {
        message: `Maximum value is ${rule.max}!`,
      })
    }

    if (rule.pattern) {
      schema = schema.regex(rule.pattern, { message: 'Invalid format!' })
    }

    if (rule.email) {
      schema = schema.email({ message: 'Invalid email format!' })
    }

    if (rule.url) {
      schema = schema.url({ message: 'Invalid URL format!' })
    }

    if (rule.custom) {
      schema = schema.refine(rule.custom, { message: 'Invalid value!' })
    }

    schemaObject[fieldName] = schema
  })

  return z.object(schemaObject)
}

// Утиліта для перевірки залежностей
export const checkDependencies = (values: Record<string, any>, dependencies: string[]): boolean => {
  return dependencies.every(dep => values[dep] !== undefined && values[dep] !== null)
}

// Утиліта для обробки умовного відображення
export const shouldShowField = (config: InputConfig, values: Record<string, any>): boolean => {
  if (!config.conditional) return true

  const { field, value, operator = 'equals' } = config.conditional
  const conditionalValue = values[field]

  switch (operator) {
    case 'equals':
      return conditionalValue === value
    case 'not_equals':
      return conditionalValue !== value
    case 'contains':
      return Array.isArray(conditionalValue)
        ? conditionalValue.includes(value)
        : String(conditionalValue).includes(String(value))
    case 'greater_than':
      return Number(conditionalValue) > Number(value)
    case 'less_than':
      return Number(conditionalValue) < Number(value)
    default:
      return true
  }
}
