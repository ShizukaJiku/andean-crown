export type OperationStatus =
  | 'pendiente_pago'
  | 'validando_voucher'
  | 'procesando'
  | 'completado'
  | 'observado'
  | 'rechazado'

export type OperationType = 'buy' | 'sell'

export interface TimelineEvent {
  status: OperationStatus
  label: string
  description: string
  timestamp: Date | null
  isCurrent?: boolean
}

export interface Operation {
  id: string
  number: string
  type: OperationType
  amountSent: number
  amountReceived: number
  currencySent: 'PEN' | 'USD'
  currencyReceived: 'PEN' | 'USD'
  rate: number
  status: OperationStatus
  bank: string
  createdAt: Date
  timeline: TimelineEvent[]
  voucherRef?: string
  observationNote?: string
}

const buildTimeline = (status: OperationStatus, base: Date): TimelineEvent[] => {
  // Lenguaje humano: descripciones en primera persona del sistema hacia el cliente.
  // Nielsen #2: match between system and the real world.
  const steps: Array<{ status: OperationStatus; label: string; description: string }> = [
    { status: 'pendiente_pago',    label: 'Listo para tu pago',        description: 'Tu orden está creada. Realiza la transferencia desde tu app bancaria.' },
    { status: 'validando_voucher', label: 'Revisando tu comprobante',  description: 'Estamos verificando que tu transferencia llegó correctamente.' },
    { status: 'procesando',        label: 'Enviando tu dinero',        description: 'Confirmamos tu pago. Tu abono llega en menos de 15 minutos.' },
    { status: 'completado',        label: '¡Tu dinero llegó!',         description: 'El abono fue acreditado en tu cuenta bancaria.' },
  ]
  const statusOrder = ['pendiente_pago', 'validando_voucher', 'procesando', 'completado']
  const currentIdx = statusOrder.indexOf(status)

  return steps.map((step, idx) => ({
    ...step,
    timestamp: idx < currentIdx
      ? new Date(base.getTime() + idx * 15 * 60 * 1000)
      : idx === currentIdx
        ? new Date(base.getTime() + idx * 15 * 60 * 1000)
        : null,
    isCurrent: idx === currentIdx,
  }))
}

const d = (daysAgo: number, hoursAgo = 0) => {
  const dt = new Date()
  dt.setDate(dt.getDate() - daysAgo)
  dt.setHours(dt.getHours() - hoursAgo)
  return dt
}

export const mockOperations: Operation[] = [
  {
    id: 'op-001',
    number: 'AC-20260501-0041',
    type: 'buy',
    amountSent: 1880.00,
    amountReceived: 500.00,
    currencySent: 'PEN',
    currencyReceived: 'USD',
    rate: 3.760,
    status: 'completado',
    bank: 'BCP',
    createdAt: d(1, 3),
    timeline: buildTimeline('completado', d(1, 3)),
    voucherRef: 'OP-8821934',
  },
  {
    id: 'op-002',
    number: 'AC-20260502-0058',
    type: 'sell',
    amountSent: 200.00,
    amountReceived: 744.00,
    currencySent: 'USD',
    currencyReceived: 'PEN',
    rate: 3.720,
    status: 'procesando',
    bank: 'BBVA',
    createdAt: d(0, 2),
    timeline: buildTimeline('procesando', d(0, 2)),
    voucherRef: 'OP-9034512',
  },
  {
    id: 'op-003',
    number: 'AC-20260502-0063',
    type: 'buy',
    amountSent: 3760.00,
    amountReceived: 1000.00,
    currencySent: 'PEN',
    currencyReceived: 'USD',
    rate: 3.760,
    status: 'validando_voucher',
    bank: 'Interbank',
    createdAt: d(0, 1),
    timeline: buildTimeline('validando_voucher', d(0, 1)),
    voucherRef: 'OP-9045123',
  },
  {
    id: 'op-004',
    number: 'AC-20260430-0027',
    type: 'buy',
    amountSent: 752.00,
    amountReceived: 200.00,
    currencySent: 'PEN',
    currencyReceived: 'USD',
    rate: 3.760,
    status: 'observado',
    bank: 'BCP',
    createdAt: d(3),
    timeline: buildTimeline('validando_voucher', d(3)),
    observationNote: 'No pudimos leer el comprobante. Toma una nueva foto con buena luz y vuelve a subirla; no te cobramos nada hasta que validemos.',
  },
  {
    id: 'op-005',
    number: 'AC-20260428-0014',
    type: 'sell',
    amountSent: 500.00,
    amountReceived: 1860.00,
    currencySent: 'USD',
    currencyReceived: 'PEN',
    rate: 3.720,
    status: 'completado',
    bank: 'Scotiabank',
    createdAt: d(5),
    timeline: buildTimeline('completado', d(5)),
    voucherRef: 'OP-8765904',
  },
]
