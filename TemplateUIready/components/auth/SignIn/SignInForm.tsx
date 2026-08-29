'use client'

import { useMemo, useState, type ReactNode } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, type ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

export type OnSignInPayload = {
  values: SignInFormSchema
  setSubmitting: (isSubmitting: boolean) => void
  setMessage: (message: string) => void
}

export type OnSignIn = (payload: OnSignInPayload) => void

interface SignInFormProps extends CommonProps {
  passwordHint?: string | ReactNode
  setMessage: (message: string) => void
  onSignIn?: OnSignIn
}

type SignInFormSchema = {
  email: string
  password: string
}

const SignInForm = (props: SignInFormProps) => {
  const t = useTranslation('form.validation')
  const tAuth = useTranslation('auth.signIn')
  const tForm = useTranslation('form.labels')
  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const { className, setMessage, onSignIn, passwordHint } = props

  const validationSchema = useMemo<ZodType<SignInFormSchema>>(
    () =>
      z.object({
        email: z
          .string({ required_error: t('emailRequired') })
          .min(1, { message: t('emailRequired') }),
        password: z
          .string({ required_error: t('passwordRequired') })
          .min(1, { message: t('passwordRequired') }),
      }),
    [t]
  )

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignInFormSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(validationSchema),
  })

  const handleSignIn = async (values: SignInFormSchema) => {
    if (onSignIn) {
      onSignIn({ values, setSubmitting, setMessage })
    }
  }

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit(handleSignIn)}>
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
        <FormItem
          label={tForm('password')}
          invalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          className={classNames(passwordHint ? 'mb-0' : '', errors.password?.message ? 'mb-8' : '')}
        >
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <PasswordInput
                type="text"
                placeholder={tForm('password')}
                autoComplete="off"
                {...field}
              />
            )}
          />
        </FormItem>
        {passwordHint}
        <Button block loading={isSubmitting} variant="solid" type="submit">
          {isSubmitting ? tAuth('signingIn') : tAuth('title')}
        </Button>
      </Form>
    </div>
  )
}

export default SignInForm
