'use client'

import { useMemo, useState } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Input from '@/components/ui/Input'
import PasswordInput from '@/components/shared/PasswordInput'
import PhoneInput from '@/components/shared/PhoneInput'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, type ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'

type SignUpFormSchema = {
  firstName: string
  lastName: string
  password: string
  email: string
  phone: string
}

export type OnSignUpPayload = {
  values: SignUpFormSchema
  setSubmitting: (isSubmitting: boolean) => void
  setMessage: (message: string) => void
}

export type OnSignUp = (payload: OnSignUpPayload) => void

interface SignUpFormProps extends CommonProps {
  setMessage: (message: string) => void
  onSignUp?: OnSignUp
}

const SignUpForm = (props: SignUpFormProps) => {
  const t = useTranslation('form.validation')
  const tForm = useTranslation('form.labels')
  const tAuth = useTranslation('auth.signUp')
  const { onSignUp, className, setMessage } = props

  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const validationSchema = useMemo<ZodType<SignUpFormSchema>>(
    () =>
      z.object({
        email: z.string({ required_error: t('emailRequired') }),
        firstName: z.string({ required_error: t('firstNameRequired') }),
        lastName: z.string({ required_error: t('lastNameRequired') }),
        password: z.string({ required_error: t('passwordRequired') }),
        phone: z.string({ required_error: t('phoneRequired') }),
      }),
    [t]
  )

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(validationSchema),
  })

  const handleSignUp = async (values: SignUpFormSchema) => {
    if (onSignUp) {
      onSignUp({ values, setSubmitting, setMessage })
    }
  }

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit(handleSignUp)}>
        {/* Name fields in one row for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
          <FormItem
            label={tForm('firstName')}
            invalid={Boolean(errors.firstName)}
            errorMessage={errors.firstName?.message}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder={tForm('placeholderFirstName')}
                  autoComplete="off"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label={tForm('lastName')}
            invalid={Boolean(errors.lastName)}
            errorMessage={errors.lastName?.message}
          >
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder={tForm('placeholderLastName')}
                  autoComplete="off"
                  {...field}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
          <FormItem
            label={tForm('phone')}
            invalid={Boolean(errors.phone)}
            errorMessage={errors.phone?.message}
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput placeholder={tForm('placeholderPhone')} {...field} />
              )}
            />
          </FormItem>
          <FormItem
            label={tForm('email')}
            invalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder={tForm('placeholderEmail')}
                  autoComplete="off"
                  {...field}
                />
              )}
            />
          </FormItem>
        </div>

        <FormItem
          label={tForm('password')}
          invalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput
                type="password"
                autoComplete="off"
                placeholder={tForm('placeholderPassword')}
                {...field}
              />
            )}
          />
        </FormItem>

        <Button block loading={isSubmitting} variant="solid" type="submit">
          {isSubmitting ? tAuth('creatingAccount') : tAuth('title')}
        </Button>
      </Form>
    </div>
  )
}

export default SignUpForm
