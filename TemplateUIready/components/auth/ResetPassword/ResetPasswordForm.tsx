'use client'

import { useMemo, useState } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, type ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

type ResetPasswordFormSchema = {
  newPassword: string
  confirmPassword: string
}

export type OnResetPasswordSubmitPayload = {
  values: ResetPasswordFormSchema
  setSubmitting: (isSubmitting: boolean) => void
  setMessage: (message: string) => void
  setResetComplete?: (complete: boolean) => void
}

export type OnResetPasswordSubmit = (payload: OnResetPasswordSubmitPayload) => void

interface ResetPasswordFormProps extends CommonProps {
  onResetPasswordSubmit?: OnResetPasswordSubmit
  resetComplete: boolean
  setResetComplete: (complete: boolean) => void
  setMessage: (message: string) => void
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const t = useTranslation('form.validation')
  const tForm = useTranslation('form.labels')
  const tAuth = useTranslation('auth.resetPassword')
  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const {
    className,
    setMessage,
    setResetComplete,
    resetComplete,
    onResetPasswordSubmit,
    children,
  } = props

  const validationSchema = useMemo<ZodType<ResetPasswordFormSchema>>(
    () =>
      z
        .object({
          newPassword: z.string({ required_error: t('passwordRequired') }),
          confirmPassword: z.string({
            required_error: t('confirmPasswordRequired'),
          }),
        })
        .refine(data => data.newPassword === data.confirmPassword, {
          message: t('passwordsDoNotMatch'),
          path: ['confirmPassword'],
        }),
    [t]
  )

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(validationSchema),
  })

  const handleResetPassword = async (values: ResetPasswordFormSchema) => {
    if (onResetPasswordSubmit) {
      onResetPasswordSubmit({
        values,
        setSubmitting,
        setMessage,
        setResetComplete,
      })
    }
  }

  return (
    <div className={className}>
      {!resetComplete ? (
        <Form onSubmit={handleSubmit(handleResetPassword)}>
          <FormItem
            label={tForm('password')}
            invalid={Boolean(errors.newPassword)}
            errorMessage={errors.newPassword?.message}
          >
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  autoComplete="off"
                  placeholder={tForm('placeholderPasswordMask')}
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label={tForm('confirmPassword')}
            invalid={Boolean(errors.confirmPassword)}
            errorMessage={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  autoComplete="off"
                  placeholder={tForm('confirmPassword')}
                  {...field}
                />
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

export default ResetPasswordForm
