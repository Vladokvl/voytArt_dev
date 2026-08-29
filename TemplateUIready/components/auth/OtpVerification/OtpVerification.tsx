import Alert from '@/components/ui/Alert'
import OtpVerificationForm from './OtpVerificationForm'
import sleep from '@/utils/sleep'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { getServerTranslation } from '@/i18n/server'

export const OtpVerification = async () => {
  const t = await getServerTranslation('auth.otpVerification')
  const [otpVerified, setOtpVerified] = useTimeOutMessage()
  const [otpResend, setOtpResend] = useTimeOutMessage()
  const [message, setMessage] = useTimeOutMessage()

  const handleResendOtp = async () => {
    try {
      /** simulate api call with sleep */
      await sleep(500)
      setOtpResend(t('weHaveSentOtpAgain'))
    } catch (errors) {
      setMessage?.(typeof errors === 'string' ? errors : 'Some error occured!')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h3 className="mb-2">{t('title')}</h3>
        <p className="font-semibold heading-text">{t('weHaveSentOtp')}</p>
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <span className="break-all">{message}</span>
        </Alert>
      )}
      {otpResend && (
        <Alert showIcon className="mb-4" type="info">
          <span className="break-all">{otpResend}</span>
        </Alert>
      )}
      {otpVerified && (
        <Alert showIcon className="mb-4" type="success">
          <span className="break-all">{otpVerified}</span>
        </Alert>
      )}
      <OtpVerificationForm setMessage={setMessage} setOtpVerified={setOtpVerified} />
      <div className="mt-4 text-center">
        <span className="font-semibold">{t('didntReceiveOtp')} </span>
        <button className="heading-text font-bold underline" onClick={handleResendOtp}>
          {t('resendOtp')}
        </button>
      </div>
    </div>
  )
}

export default OtpVerification
