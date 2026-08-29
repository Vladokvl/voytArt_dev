'use client'

import { useMemo, useState } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, type ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

type ForgotPasswordFormSchema = {
  email: string
}

export type OnForgotPasswordSubmitPayload = {
  values: ForgotPasswordFormSchema
  setSubmitting: (isSubmitting: boolean) => void
  setMessage: (message: string) => void
  setEmailSent: (complete: boolean) => void
}

export type OnForgotPasswordSubmit = (payload: OnForgotPasswordSubmitPayload) => void

interface ForgotPasswordFormProps extends CommonProps {
  onForgotPasswordSubmit?: OnForgotPasswordSubmit
  emailSent: boolean
  setEmailSent: (compplete: boolean) => void
  setMessage: (message: string) => void
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const t = useTranslation('form.validation')
  const tForm = useTranslation('form.labels')
  const tAuth = useTranslation('auth.forgotPassword')
  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const { className, onForgotPasswordSubmit, setMessage, setEmailSent, emailSent, children } = props

  const validationSchema = useMemo<ZodType<ForgotPasswordFormSchema>>(
    () =>
      z.object({
        email: z
          .string()
          .email({ message: t('emailInvalid') })
          .min(5, { message: t('emailInvalid') }),
      }),
    [t]
  )

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(validationSchema),
  })

  const onForgotPassword = async (values: ForgotPasswordFormSchema) => {
    if (onForgotPasswordSubmit) {
      onForgotPasswordSubmit({
        values,
        setSubmitting,
        setMessage,
        setEmailSent,
      })
    }
  }

  return (
    <div className={className}>
      {!emailSent ? (
        <Form onSubmit={handleSubmit(onForgotPassword)}>
          <FormItem
            label={tForm('email')}
            invalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input type="email" placeholder={tForm('email')} autoComplete="off" {...field} />
              )}
            />
          </FormItem>
          <Button block loading={isSubmitting} variant="solid" type="submit">
            {isSubmitting ? tAuth('submitting') : tAuth('submit')}
          </Button>
        </Form>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export default ForgotPasswordForm
