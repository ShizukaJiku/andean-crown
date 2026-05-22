/** Validadores reutilizables para los formularios de la app. */

/** Quita todo lo que no sea dígito. */
export const digitsOnly = (v: string): string => v.replace(/\D/g, '')

/** Formato de correo electrónico. */
export const isEmail = (v: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** DNI peruano: exactamente 8 dígitos. */
export const isDNI = (v: string): boolean => /^\d{8}$/.test(v)

/** CCI: exactamente 20 dígitos. */
export const isCCI = (v: string): boolean => /^\d{20}$/.test(v)

/** Teléfono: al menos 9 dígitos (número local peruano). */
export const isPhone = (v: string): boolean => digitsOnly(v).length >= 9

/** Número de cuenta bancaria: al menos 10 dígitos (admite guiones de formato). */
export const isAccountNumber = (v: string): boolean => digitsOnly(v).length >= 10
