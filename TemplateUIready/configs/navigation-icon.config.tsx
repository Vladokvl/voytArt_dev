import {
  PiBellDuotone,
  PiChartLineUpDuotone,
  PiGearSixDuotone,
  PiGraphDuotone,
  PiHouseLineDuotone,
  PiShieldCheckDuotone,
  PiSlidersHorizontalDuotone,
  PiTicketDuotone,
  PiUsersDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
  dashboard: <PiHouseLineDuotone />,
  users: <PiUsersDuotone />,
  invitations: <PiTicketDuotone />,
  graph: <PiGraphDuotone />,
  scoring: <PiSlidersHorizontalDuotone />,
  notifications: <PiBellDuotone />,
  moderation: <PiShieldCheckDuotone />,
  settings: <PiGearSixDuotone />,
  home: <PiHouseLineDuotone />,
  analytics: <PiChartLineUpDuotone />,
}

export default navigationIcon
