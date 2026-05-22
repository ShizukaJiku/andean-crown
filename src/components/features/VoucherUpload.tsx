import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileCheck, X, Hash } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Input } from '../ui/Input'

interface VoucherUploadProps {
  onVoucherReady: (ref: string) => void
}

export function VoucherUpload({ onVoucherReady }: VoucherUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'file' | 'code'>('file')

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      onVoucherReady(`FILE:${accepted[0].name}`)
    }
  }, [onVoucherReady])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'], 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  const handleCodeChange = (v: string) => {
    setCode(v)
    if (v.length >= 6) onVoucherReady(`CODE:${v}`)
    else onVoucherReady('')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mode toggle */}
      <div className="flex bg-subtle rounded-xl p-1">
        <button
          type="button"
          onClick={() => setMode('file')}
          aria-pressed={mode === 'file'}
          className={cn(
            'flex-1 py-2 min-h-[40px] text-sm font-medium rounded-lg transition-all',
            mode === 'file' ? 'bg-white text-text shadow-sm' : 'text-muted'
          )}
        >
          Subir imagen / PDF
        </button>
        <button
          type="button"
          onClick={() => setMode('code')}
          aria-pressed={mode === 'code'}
          className={cn(
            'flex-1 py-2 min-h-[40px] text-sm font-medium rounded-lg transition-all',
            mode === 'code' ? 'bg-white text-text shadow-sm' : 'text-muted'
          )}
        >
          Código de operación
        </button>
      </div>

      {mode === 'file' ? (
        <>
          {!file ? (
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors',
                isDragActive ? 'border-crown-gold bg-crown-gold/5' : 'border-border hover:border-crown-gold/50'
              )}
            >
              <input {...getInputProps()} />
              <div className="w-14 h-14 bg-subtle rounded-2xl flex items-center justify-center">
                <Upload size={24} className="text-muted" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-text">
                  {isDragActive ? 'Suelta aquí el archivo' : 'Arrastra tu voucher aquí'}
                </p>
                <p className="text-xs text-muted mt-1">o toca para seleccionar</p>
                <p className="text-xs text-muted mt-0.5">JPG, PNG o PDF · Máx. 5 MB</p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-success rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-success-bg rounded-xl flex items-center justify-center shrink-0">
                <FileCheck size={20} className="text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{file.name}</p>
                <p className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                type="button"
                aria-label="Quitar archivo"
                onClick={() => { setFile(null); onVoucherReady('') }}
                className="tap-target hover:bg-subtle rounded-lg transition-colors"
              >
                <X size={16} className="text-muted" aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      ) : (
        <Input
          label="Código / número de operación"
          placeholder="Ej. 8821934"
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          prefix={<Hash size={16} />}
          hint="Ingresa el código que figura en tu comprobante de transferencia"
        />
      )}

      <div className="bg-info-bg rounded-xl p-3">
        <p className="text-xs text-info font-medium">
          💡 Asegúrate que el voucher sea legible y muestre el monto enviado
        </p>
      </div>
    </div>
  )
}
