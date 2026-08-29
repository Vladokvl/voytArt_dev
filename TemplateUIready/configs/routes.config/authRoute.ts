import type { Routes } from '@/@types/routes'

const authRoute: Routes = {
  '/sign-in': {
    key: 'signIn',
    authority: [],
    meta: {
      pageBackgroundType: 'plain',
      layout: 'blank',
      pageContainerType: 'contained',
      footer: false,
    },
  },
}

export default authRoute
