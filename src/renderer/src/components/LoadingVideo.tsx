import React, { useEffect, useRef } from 'react'
import VIDEO_SRC from '../assets/loading-video.mp4'
import POSTER_SRC from '../assets/preview.png'

interface LoadingVideoProps {
  deviceFound: boolean
}

const LoadingVideo: React.FC<LoadingVideoProps> = ({ deviceFound }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const loopHandler = useRef<(() => void) | null>(null) // Ref to store the loop handler function

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Define the loop video function
    const loopVideo = () => {
      if (video.currentTime >= 4) {
        video.currentTime = 0
        video.play()
      }
    }

    loopHandler.current = loopVideo // Store the reference to the loop handler
    video.addEventListener('timeupdate', loopVideo)
    video.play()

    return () => {
      if (loopHandler.current) {
        video.removeEventListener('timeupdate', loopHandler.current) // Use the same function reference
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !loopHandler.current) return

    if (deviceFound) {
      video.removeEventListener('timeupdate', loopHandler.current) // Remove the event listener using the same reference
    } else {
      video.addEventListener('timeupdate', loopHandler.current) // Re-add if deviceFound changes back
    }
  }, [deviceFound])

  return (
    <video ref={videoRef} width="832" height="400" loop muted poster={POSTER_SRC}>
      Your browser does not support the video tag.
    </video>
  )
}

export default LoadingVideo
