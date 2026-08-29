export type LocationData = {
  id?: string
  name?: string
  code?: string
}

export type SignInCredential = {
  email: string
  password: string
}

export type SignInResponse = {
  token: {
    accessToken: string
  }
  user: {
    userId: string
    userName: string
    firstName: string
    lastName: string
    authority: string[]
    avatar: string
    email: string
    phone?: string
    country?: LocationData
    state?: LocationData
    city?: LocationData
    address?: string
    fullAddress?: string
    postalCode?: string
    dateOfBirth?: string
    about?: string
  }
}

export type SignUpResponse = SignInResponse & {
  message?: string
  status?: string
}

export type SignUpCredential = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  newPassword: string
  confirmPassword: string
  token: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
  status: AuthRequestStatus
  message: string
}>

export type User = {
  userId?: string | null
  avatar?: string | null
  userName?: string | null
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  authority?: string[]
  phone?: string | null
  phoneFormatted?: string | null
  country?: LocationData | null
  state?: LocationData | null
  city?: LocationData | null
  address?: string | null
  fullAddress?: string | null
  postalCode?: string | null
  dateOfBirth?: string | null
  about?: string | null
  googleId?: string | null
}

export type Token = {
  accessToken: string
  refereshToken?: string
}

export type OauthSignInCallbackPayload = {
  onSignIn: (tokens: Token, user?: User) => void
  redirect: () => void
}

export type ProfileUpdateData = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  phoneFormatted?: string
  country?: LocationData
  state?: LocationData
  city?: LocationData
  address?: string
  fullAddress?: string
  postalCode?: string
  dateOfBirth?: string
  about?: string
}
