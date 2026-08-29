import type { InputProps } from '@/components/ui'
import Input from '@/components/ui/Input'
import type { ComponentType, ReactNode } from 'react'
import { NumberFormatBase, NumberFormatBaseProps } from 'react-number-format'

interface InputAffix {
  inputSuffix?: string | ReactNode
  inputPrefix?: string | ReactNode
}

type NumberInputProps = Omit<InputProps, 'prefix' | 'suffix'> & InputAffix

type NumberFormatInputProps = Omit<NumberFormatBaseProps, 'form'> & InputAffix

type NumberFormatBasePropsOptional = {
  format?: (value: string) => string
  removeFormatting?: (value: string) => string
  getCaretBoundary?: (formattedValue: string) => boolean[]
}

type CustomFormatInputProps = NumberInputProps &
  Omit<NumberFormatInputProps, 'format' | 'removeFormatting' | 'getCaretBoundary'> &
  NumberFormatBasePropsOptional

function charIsNumber(char?: string) {
  return !!(char || '').match(/\d/)
}
function caretUnknownFormatBoundary(formattedValue: string) {
  const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(() => true)

  for (let i = 0, ln = boundaryAry.length; i < ln; i++) {
    boundaryAry[i] = Boolean(charIsNumber(formattedValue[i]) || charIsNumber(formattedValue[i - 1]))
  }

  return boundaryAry
}

function defaultRemoveFormatting(value: string) {
  return value.replace(/[^0-9]/g, '')
}

const NumberInput = ({ inputSuffix, inputPrefix, ...props }: NumberInputProps) => {
  return <Input {...props} value={props.value} suffix={inputSuffix} prefix={inputPrefix} />
}

const NumberFormatInput = ({ onValueChange, ...rest }: NumberFormatInputProps) => {
  return (
    <NumberFormatBase
      customInput={NumberInput as ComponentType}
      onValueChange={onValueChange}
      {...rest}
    />
  )
}

const FormCustomFormatInput = ({
  inputSuffix,
  inputPrefix,
  onValueChange,
  format = (value: string) => value,
  getCaretBoundary = caretUnknownFormatBoundary,
  removeFormatting = defaultRemoveFormatting,
  ...rest
}: CustomFormatInputProps) => {
  return (
    <NumberFormatInput
      inputPrefix={inputPrefix}
      inputSuffix={inputSuffix}
      format={format}
      getCaretBoundary={getCaretBoundary}
      removeFormatting={removeFormatting}
      onValueChange={onValueChange}
      {...rest}
    />
  )
}

export default FormCustomFormatInput
