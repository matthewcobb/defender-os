import React, { useEffect, useRef } from 'react'
import VIDEO_SRC from '../assets/loading-video.mp4'
import POSTER_SRC from '../assets/preview.png'

interface LoadingVideoProps {
  deviceFound: boolean
}

const LoadingVideo: React.FC<LoadingVideoProps> = ({ deviceFound }) => {
  const statusMessage = deviceFound ? '.: Connecting :.' : '.: Connect iPhone :.'

  const videoRef = useRef<HTMLVideoElement>(null)
  const loopHandler = useRef<(() => void) | null>(null) // Ref to store the loop handler function

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Define the loop video function
    const loopVideo = () => {
      if (video.currentTime > 3) {
        video.currentTime = 0
        video.play()
      }
    }

    loopHandler.current = loopVideo
    video.addEventListener('timeupdate', loopVideo)
    video.play()

    return () => {
      if (loopHandler.current) {
        video.removeEventListener('timeupdate', loopHandler.current)
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !loopHandler.current) return

    if (deviceFound) {
      video.removeEventListener('timeupdate', loopHandler.current)
    } else {
      video.addEventListener('timeupdate', loopHandler.current)
    }
  }, [deviceFound])

  return (
    <div className="loading-video">
      <div className="message">{statusMessage}</div>
      <video ref={videoRef} width="1248" height="600" muted poster={POSTER_SRC}>
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
    </div>
  )
}

export default LoadingVideo
