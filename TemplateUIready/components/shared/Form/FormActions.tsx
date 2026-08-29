'use client'

import { useState, ReactNode } from 'react'
import useTranslation from '@/utils/hooks/useTranslation'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { sendData } from '@/services/common/ApiService'

export interface FormActionsProps {
  // Основні дії
  onSave?: () => void
  onBack?: () => void
  onDelete?: () => void

  // Налаштування кнопок
  backText?: string
  saveText?: string
  deleteText?: string

  // Стани завантаження
  isSaving?: boolean
  isDeleting?: boolean

  // Показувати/приховувати кнопки
  showBack?: boolean
  showDelete?: boolean
  showSave?: boolean

  // Додаткові дії
  extraActions?: ReactNode
  extraLeftActions?: ReactNode

  // Налаштування видалення
  deleteUrl?: string
  deleteSuccessMessage?: string
  deleteErrorMessage?: string
  deleteConfirmationTitle?: string
  deleteConfirmationMessage?: string
  onConfirmDelete?: () => void

  // Стилізація
  className?: string
  containerClassName?: string
}

const FormActions = ({
  // Основні дії
  onSave = () => {},
  onBack,
  onDelete,

  // Налаштування кнопок
  backText,
  saveText,
  deleteText,

  // Стани завантаження
  isSaving = false,
  isDeleting = false,

  // Показувати/приховувати кнопки
  showBack = true,
  showDelete = true,
  showSave = true,

  // Додаткові дії
  extraActions,
  extraLeftActions,

  // Налаштування видалення
  deleteUrl,
  deleteSuccessMessage,
  deleteErrorMessage,
  deleteConfirmationTitle,
  deleteConfirmationMessage,
  onConfirmDelete,

  // Стилізація
  className,
  containerClassName,
}: FormActionsProps) => {
  const t = useTranslation('common')
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [internalIsDeleting, setInternalIsDeleting] = useState(false)

  // Використовуємо зовнішній стан або внутрішній
  const deleting = isDeleting || internalIsDeleting

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
    } else if (deleteUrl) {
      setDeleteConfirmationOpen(true)
    }
  }

  const handleCancel = () => {
    setDeleteConfirmationOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!deleteUrl) return

    setInternalIsDeleting(true)

    try {
      await sendData(
        deleteUrl,
        'delete',
        {},
        () => {
          setDeleteConfirmationOpen(false)
          setInternalIsDeleting(false)
          toast.push(
            <Notification type="success">
              {deleteSuccessMessage ?? t('deletedSuccessfully')}
            </Notification>,
            {
              placement: 'top-center',
            }
          )
          onConfirmDelete?.()
          onBack?.()
        },
        (error: any) => {
          console.error('Error deleting item:', error)
          toast.push(
            <Notification type="danger">
              {deleteErrorMessage ?? t('errorDeletingItem')}
            </Notification>,
            {
              placement: 'top-center',
            }
          )
          setInternalIsDeleting(false)
        }
      )
    } catch {
      setInternalIsDeleting(false)
    }
  }

  return (
    <>
      <Container className={containerClassName}>
        <div className={`flex items-center justify-between px-8 ${className || ''}`}>
          <div className="flex items-center">
            {showBack && onBack && (
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                variant="plain"
                icon={<TbArrowNarrowLeft />}
                onClick={onBack}
              >
                {backText ?? t('back')}
              </Button>
            )}
            {extraLeftActions}
          </div>
          <div className="flex items-center">
            {showDelete && (onDelete || deleteUrl) && (
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                loading={deleting}
                customColorClass={() =>
                  'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                }
                icon={<TbTrash />}
                onClick={handleDelete}
              >
                {deleteText ?? t('delete')}
              </Button>
            )}
            {extraActions}
            {showSave && onSave && (
              <Button variant="solid" type="submit" loading={isSaving} onClick={onSave}>
                {saveText ?? t('save')}
              </Button>
            )}
          </div>
        </div>
      </Container>

      {/* Діалог підтвердження видалення */}
      {(onDelete || deleteUrl) && (
        <ConfirmDialog
          isOpen={deleteConfirmationOpen}
          type="danger"
          title={deleteConfirmationTitle ?? t('removeItem')}
          onClose={handleCancel}
          onRequestClose={handleCancel}
          onCancel={handleCancel}
          onConfirm={handleConfirmDelete}
        >
          <p>{deleteConfirmationMessage ?? t('removeItemConfirm')}</p>
        </ConfirmDialog>
      )}
    </>
  )
}

export default FormActions
