import type { InputProps } from '@/components/ui'
import Input from '@/components/ui/Input'
import type { ComponentType, ReactNode } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

interface InputAffix {
  inputSuffix?: string | ReactNode
  inputPrefix?: string | ReactNode
}

type NumberInputProps = Omit<InputProps, 'prefix' | 'suffix'> & InputAffix

type NumberFormatInputProps = Omit<NumericFormatProps, 'form'> & InputAffix

type NumericInputProps = NumberInputProps & NumberFormatInputProps

const NumberInput = ({ inputSuffix, inputPrefix, ...props }: NumberInputProps) => {
  return <Input {...props} value={props.value} suffix={inputSuffix} prefix={inputPrefix} />
}

const NumberFormatInput = ({ onValueChange, ...rest }: NumberFormatInputProps) => {
  return (
    <NumericFormat
      customInput={NumberInput as ComponentType}
      onValueChange={onValueChange}
      {...rest}
    />
  )
}

const NumericInput = ({ inputSuffix, inputPrefix, onValueChange, ...rest }: NumericInputProps) => {
  return (
    <NumberFormatInput
      inputPrefix={inputPrefix}
      inputSuffix={inputSuffix}
      onValueChange={onValueChange}
      {...rest}
    />
  )
}

export default NumericInput
