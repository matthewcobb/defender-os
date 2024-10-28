import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import LoadingVideo from './LoadingVideo'
import { findDevice, requestDevice, CommandMapping } from 'node-carplay/web'
import { CarPlayWorker } from './worker/types'
import useCarplayAudio from './useCarplayAudio'
import { useCarplayTouch } from './useCarplayTouch'
import { useLocation, useNavigate } from 'react-router-dom'
import { ExtraConfig } from '../../../main/Globals'
import { useCarplayStore } from '../store/store'
import { InitEvent } from './worker/render/RenderEvents'

const videoChannel = new MessageChannel()
const micChannel = new MessageChannel()

const RETRY_DELAY_MS = 15000

interface CarplayProps {
  width: number
  height: number
  receivingVideo: boolean
  setReceivingVideo: (receivingVideo: boolean) => void
  settings: ExtraConfig
  command: string
  commandCounter: number
}

function Carplay({
  width,
  height,
  receivingVideo,
  setReceivingVideo,
  settings,
  command,
  commandCounter
}: CarplayProps) {
  const [isPlugged, setPlugged] = useState(false)
  const [deviceFound, setDeviceFound] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
  const mainElem = useRef<HTMLDivElement>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const stream = useCarplayStore((state) => state.stream)

  const config = {
    fps: settings.fps,
    width: width,
    height: height,
    mediaDelay: settings.mediaDelay,
    dpi: settings.dpi,
    micType: settings.micType,
    microphone: settings.microphone,
    camera: settings.camera
  }
  // const pathname = "/"
  console.log(pathname)

  const renderWorker = useMemo(() => {
    if (!canvasElement) return

    const worker = new Worker(new URL('./worker/render/Render.worker.ts', import.meta.url), {
      type: 'module'
    })
    const canvas = canvasElement.transferControlToOffscreen()
    worker.postMessage(new InitEvent(canvas, videoChannel.port2), [canvas, videoChannel.port2])
    return worker
  }, [canvasElement])

  useLayoutEffect(() => {
    if (canvasRef.current) {
      setCanvasElement(canvasRef.current)
    }
  }, [])

  const carplayWorker = useMemo(() => {
    const worker = new Worker(new URL('./worker/CarPlay.worker.ts', import.meta.url), {
      type: 'module'
    }) as CarPlayWorker
    const payload = {
      videoPort: videoChannel.port1,
      microphonePort: micChannel.port1
    }
    worker.postMessage({ type: 'initialise', payload }, [videoChannel.port1, micChannel.port1])
    return worker
  }, [])

  const { processAudio, getAudioPlayer, startRecording, stopRecording } = useCarplayAudio(
    carplayWorker,
    micChannel.port2
  )

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  // subscribe to worker messages
  useEffect(() => {
    carplayWorker.onmessage = (ev) => {
      const { type } = ev.data
      switch (type) {
        case 'plugged':
          setPlugged(true)
          break
        case 'unplugged':
          setPlugged(false)
          break
        case 'requestBuffer':
          clearRetryTimeout()
          getAudioPlayer(ev.data.message)
          break
        case 'audio':
          clearRetryTimeout()
          processAudio(ev.data.message)
          break
        case 'media':
          //TODO: implement
          break
        case 'command':
          const {
            message: { value }
          } = ev.data
          switch (value) {
            case CommandMapping.startRecordAudio:
              startRecording()
              break
            case CommandMapping.stopRecordAudio:
              stopRecording()
              break
            case CommandMapping.requestHostUI:
              navigate('/settings')
          }
          break
        case 'failure':
          if (retryTimeoutRef.current == null) {
            console.error(`Carplay initialization failed -- Reloading page in ${RETRY_DELAY_MS}ms`)
            retryTimeoutRef.current = setTimeout(() => {
              window.location.reload()
            }, RETRY_DELAY_MS)
          }
          break
      }
    }
  }, [
    carplayWorker,
    clearRetryTimeout,
    getAudioPlayer,
    processAudio,
    renderWorker,
    startRecording,
    stopRecording
  ])

  useEffect(() => {
    const element = mainElem?.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      console.log('size change')
      carplayWorker.postMessage({ type: 'frame' })
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    carplayWorker.postMessage({ type: 'keyCommand', command: command })
  }, [commandCounter])

  const checkDevice = useCallback(
    async (request: boolean = false) => {
      const device = request ? await requestDevice() : await findDevice()
      if (device) {
        console.log('starting in check')
        setDeviceFound(true)
        setReceivingVideo(true)
        carplayWorker.postMessage({ type: 'start', payload: { config } })
      } else {
        setDeviceFound(false)
      }
    },
    [carplayWorker]
  )

  // usb connect/disconnect handling and device check
  useEffect(() => {
    navigator.usb.onconnect = async () => {
      checkDevice()
    }

    navigator.usb.ondisconnect = async () => {
      const device = await findDevice()
      if (!device) {
        carplayWorker.postMessage({ type: 'stop' })
        setDeviceFound(false)
        setReceivingVideo(false)
      }
    }

    //checkDevice()
  }, [carplayWorker, checkDevice])

  // const onClick = useCallback(() => {
  //   checkDevice(true)
  // }, [checkDevice])

  const sendTouchEvent = useCarplayTouch(carplayWorker, width, height)

  const isLoading = !isPlugged

  return (
    <div id={'carplay-container'} ref={mainElem}>
      {(deviceFound === false || isLoading) && (
        <div className="loading">
          <LoadingVideo deviceFound={deviceFound} receivingVideo={receivingVideo} />
        </div>
      )}
      <div
        id="videoContainer"
        onPointerDown={sendTouchEvent}
        onPointerMove={sendTouchEvent}
        onPointerUp={sendTouchEvent}
        onPointerCancel={sendTouchEvent}
        onPointerOut={sendTouchEvent}
      >
        <canvas ref={canvasRef} id={'video'} style={isPlugged ? { height: '100%' } : undefined} />
      </div>
    </div>
  )
}

export default React.memo(Carplay)
