import * as React from "react"

/**
 * Ambil level volume mic asli (RMS dari time-domain data) via Web Audio API
 * dan panggil `onLevel` tiap frame — lewat ref (bukan React state) supaya
 * update ~60fps tidak memicu re-render. Level dipaksa balik ke 0 begitu
 * `active` mati, jadi pemanggilnya bisa "mengendurkan" tampilan lagi.
 * Kalau izin mic ditolak/tidak tersedia, level tetap 0 (bukan error) —
 * reaksi ke suara jadi progressive enhancement.
 */
export function useMicLevel(active: boolean, onLevel: (level: number) => void) {
  const onLevelRef = React.useRef(onLevel)
  onLevelRef.current = onLevel

  React.useEffect(() => {
    if (!active) {
      onLevelRef.current(0)
      return
    }
    let stream: MediaStream | null = null
    let audioCtx: AudioContext | null = null
    let raf = 0
    let cancelled = false

    ;(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        audioCtx = new AudioContext()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 512
        source.connect(analyser)
        const data = new Uint8Array(analyser.fftSize)

        const tick = () => {
          analyser.getByteTimeDomainData(data)
          let sumSquares = 0
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128
            sumSquares += v * v
          }
          const rms = Math.sqrt(sumSquares / data.length)
          // Gain + kurva akar supaya suara volume ngobrol biasa dari jarak
          // wajar ke mic sudah kerasa reaktif, tanpa terlalu berlebihan
          const boosted = Math.min(1, rms * 7)
          const level = Math.pow(boosted, 0.55)
          onLevelRef.current(level)
          raf = requestAnimationFrame(tick)
        }
        tick()
      } catch {
        // Izin mic ditolak / tidak didukung browser — biarkan di level 0
      }
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      audioCtx?.close()
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [active])
}
