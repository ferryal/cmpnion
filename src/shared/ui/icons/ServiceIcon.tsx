import type { ServiceType } from '@entities/order/model/types'
import { BedDouble, Flower2, Sparkles, UtensilsCrossed, WashingMachine } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

const SERVICE_ICONS: Record<ServiceType, React.ComponentType<LucideProps>> = {
  'Room Service': UtensilsCrossed,
  Housekeeping: Sparkles,
  Laundry: WashingMachine,
  'Extra Bed': BedDouble,
  'Spa & Massage': Flower2,
}

interface ServiceIconProps extends LucideProps {
  service: ServiceType
}

export function ServiceIcon({ service, ...props }: ServiceIconProps) {
  const Icon = SERVICE_ICONS[service]
  return <Icon {...props} />
}
