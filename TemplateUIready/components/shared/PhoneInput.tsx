'use client'

import type { CommonProps } from '@/@types/common'
import { useForm, useFormItem } from '@/components/ui/Form/context'
import classNames from 'classnames'
import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import type { TypeAttributes } from '../ui/@types/common'
import { useConfig } from '../ui/ConfigProvider/ConfigProvider'
import { useInputGroup } from '../ui/InputGroup/context'
import { CONTROL_SIZES } from '../ui/utils/constants'

interface PhoneInputProps extends CommonProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
  label?: string
  required?: boolean
  size?: TypeAttributes.ControlSize
}

const PhoneInputComponent: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter phone number',
  disabled = false,
  invalid = false,
  errorMessage,
  label,
  required = false,
  className,
  size,
}) => {
  const { controlSize } = useConfig()
  const inputGroupSize = useInputGroup()?.size
  const formItemInvalid = useFormItem()?.invalid
  const formControlSize = useForm()?.size
  const inputSize = size || inputGroupSize || formControlSize || controlSize
  const isInputInvalid = invalid || formItemInvalid

  const inputDefaultClass = 'input'
  const inputSizeClass = `input-${inputSize} ${CONTROL_SIZES[inputSize].h}`
  const inputFocusClass = `focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary`
  const inputClass = classNames(
    inputDefaultClass,
    inputSizeClass,
    !isInputInvalid && inputFocusClass,
    disabled && 'input-disabled',
    isInputInvalid && 'input-invalid'
  )

  const containerClass = classNames(`react-tel-input-container`)

  const handleChange = (phone: string) => {
    if (onChange) {
      onChange(phone)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={`relative ${isInputInvalid ? 'PhoneInput--invalid' : ''}`}>
        <PhoneInput
          country={'gb'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          containerClass={containerClass}
          inputClass={inputClass}
          buttonClass="PhoneInputButton"
          dropdownClass="PhoneInputDropdown"
          searchClass="PhoneInputSearch"
          enableSearch={true}
          searchPlaceholder="Search country..."
          autoFormat={true}
          disableSearchIcon={true}
          disableDropdown={false}
          preferredCountries={['gb', 'us', 'ua']}
          excludeCountries={[]}
          // isValid={(value, country) => {
          //     if (value.length < 4) {
          //         return 'Phone number is too short'
          //     }
          //     return true
          // }}
        />
      </div>
      {isInputInvalid && errorMessage && <p className="form-error">{errorMessage}</p>}
    </div>
  )
}

export default PhoneInputComponent
