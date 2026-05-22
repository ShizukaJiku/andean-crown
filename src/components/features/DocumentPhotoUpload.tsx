import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Check, ImageOff } from 'lucide-react'
import { cn } from '../../lib/cn'

type Status = 'idle' | 'verifying' | 'valid' | 'error'

const panelMotion = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2 },
}

/**
 * Carga de foto del documento (mockup de KYC).
 *
 * Acepta cualquier imagen, simula la verificación con un loader y termina
 * en un estado "verificado" con check. No persiste el archivo: solo recrea
 * la experiencia para la demo.
 */
export function DocumentPhotoUpload() {
  const [status, setStatus] = useState<Status>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewRef = useRef<string | null>(null)

  // Limpieza al desmontar: timer y object URL del preview
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
  }, [])

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length > 0 || !accepted[0]) {
      setStatus('error')
      return
    }
    const file = accepted[0]
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    const url = URL.createObjectURL(file)
    previewRef.current = url
    setPreview(url)
    setFileName(file.name)
    setStatus('verifying')
    timerRef.current = setTimeout(() => setStatus('valid'), 1900)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
  })

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current)
      previewRef.current = null
    }
    setPreview(null)
    setFileName('')
    setStatus('idle')
  }

  return (
    <div>
      <p className="text-sm font-medium text-text mb-2">Foto del documento (frente)</p>
      <AnimatePresence mode="wait">
        {(status === 'idle' || status === 'error') && (
          <motion.div key={status} {...panelMotion}>
            <div
              {...getRootProps({ 'aria-label': 'Subir foto del documento' })}
              className={cn(
                'border-2 border-dashed rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors',
                status === 'error'
                  ? 'border-error/50 bg-error-bg/40'
                  : isDragActive
                    ? 'border-crown-gold bg-crown-gold/5'
                    : 'border-border bg-subtle hover:border-crown-gold/50',
              )}
            >
              <input {...getInputProps()} />
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center',
                  status === 'error' ? 'bg-error-bg' : 'bg-surface',
                )}
              >
                {status === 'error'
                  ? <ImageOff size={22} className="text-error" aria-hidden="true" />
                  : <Camera size={22} className="text-muted" aria-hidden="true" />}
              </motion.div>
              <p className="text-sm font-medium text-text text-center">
                {status === 'error'
                  ? 'Ese archivo no es una imagen'
                  : isDragActive
                    ? 'Suelta la foto aquí'
                    : 'Toca para subir la foto'}
              </p>
              <p className="text-xs text-muted text-center">
                {status === 'error'
                  ? 'Sube una imagen JPG, PNG o WEBP del documento'
                  : 'JPG, PNG o WEBP · frente del documento'}
              </p>
            </div>
          </motion.div>
        )}

        {status === 'verifying' && (
          <motion.div
            key="verifying"
            {...panelMotion}
            className="border-2 border-border rounded-2xl p-4 bg-surface flex items-center gap-3"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
              {preview && <img src={preview} alt="" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-crown-navy/45 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text">Verificando documento…</p>
              <p className="text-xs text-muted">Comprobando legibilidad y datos</p>
            </div>
          </motion.div>
        )}

        {status === 'valid' && (
          <motion.div
            key="valid"
            {...panelMotion}
            className="border-2 border-success rounded-2xl p-4 bg-success-bg/40 flex items-center gap-3"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
              {preview && (
                <img
                  src={preview}
                  alt="Foto del documento subida"
                  className="w-full h-full object-cover"
                />
              )}
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 15, delay: 0.1 }}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-success rounded-full flex items-center justify-center border-2 border-surface"
              >
                <Check size={14} className="text-white" strokeWidth={3} aria-hidden="true" />
              </motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-success">Documento verificado</p>
              <p className="text-xs text-muted truncate">{fileName}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-semibold text-crown-gold-dim min-h-[44px] px-2 shrink-0"
            >
              Cambiar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
