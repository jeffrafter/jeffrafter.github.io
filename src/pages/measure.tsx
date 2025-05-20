import React, {useState, useRef, useEffect} from 'react'
import {graphql} from 'gatsby'

import Layout from '../components/layout'
import Head from '../components/head'

interface Sample {
  timestamp: number
  accelX: number | null
  accelY: number | null
  accelZ: number | null
  rotAlpha: number | null
  rotBeta: number | null
  rotGamma: number | null
  ride: string
  user: string
  device: string
}

interface Props {
  readonly data: PageQueryData
}

const Measure: React.FC<Props> = ({data}) => {
  const siteTitle = data.site.siteMetadata.title
  const siteKeywords = data.site.siteMetadata.keywords

  const [recording, setRecording] = useState(false)
  const [samples, setSamples] = useState<Sample[]>([])
  const [ride, setRide] = useState('')
  const [userName, setUserName] = useState('')
  const motionHandler = useRef<(e: DeviceMotionEvent) => void>()
  const deviceInfo = navigator.userAgent

  useEffect(() => {
    // define handler once
    motionHandler.current = (e: DeviceMotionEvent) => {
      const {acceleration, rotationRate} = e
      const sample = {
        timestamp: Date.now(),
        accelX: acceleration?.x ?? null,
        accelY: acceleration?.y ?? null,
        accelZ: acceleration?.z ?? null,
        rotAlpha: rotationRate?.alpha ?? null,
        rotBeta: rotationRate?.beta ?? null,
        rotGamma: rotationRate?.gamma ?? null,
        ride,
        user: userName,
        device: deviceInfo,
      } as Sample
      setSamples(prev => [...prev, sample])
    }
  }, [ride, userName, deviceInfo])

  const requestPermissionAndListen = async () => {
    // iOS 13+ requires this
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      const resp = await (DeviceMotionEvent as any).requestPermission()
      if (resp !== 'granted') {
        alert('Motion permission denied')
        return
      }
    } else {
      alert('Motion permission not available')
      return
    }
    window.addEventListener('devicemotion', motionHandler.current!)
    setRecording(true)
  }

  const stopListening = () => {
    window.removeEventListener('devicemotion', motionHandler.current!)
    setRecording(false)
  }

  const buildCSV = () => {
    const header = [
      'timestamp',
      'accelX',
      'accelY',
      'accelZ',
      'rotAlpha',
      'rotBeta',
      'rotGamma',
      'ride',
      'user',
      'device',
    ].join(',')
    const rows = samples.map(s =>
      [
        s.timestamp,
        s.accelX,
        s.accelY,
        s.accelZ,
        s.rotAlpha,
        s.rotBeta,
        s.rotGamma,
        s.ride,
        `"${s.user.replace(/"/g, '""')}"`,
        `"${s.device.replace(/"/g, '""')}"`,
      ].join(','),
    )
    return [header, ...rows].join('\n')
  }

  const downloadCSV = () => {
    const csv = buildCSV()
    const blob = new Blob([csv], {type: 'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `motion-data-ride${ride}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareCSV = async () => {
    const csv = buildCSV()
    const blob = new Blob([csv], {type: 'text/csv'})
    const filesArray = [new File([blob], `motion-ride${ride}.csv`, {type: 'text/csv'})]
    if (navigator.canShare?.({files: filesArray})) {
      try {
        await (navigator as any).share({
          files: filesArray,
          title: 'Motion Data',
          text: `Ride ${ride} data from ${userName}`,
        })
      } catch (err) {
        console.error('Share failed', err)
      }
    } else {
      alert('Sharing not supported; please download instead.')
    }
  }

  const lastSample = samples[samples.length - 1]

  return (
    <Layout title={siteTitle}>
      <Head title="Measure me" keywords={siteKeywords} />
      <article>
        <h2>🎢 Motion Recorder</h2>

        <label>
          Your name:
          <br />
          <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
        </label>

        <br />
        <br />

        <label style={{marginTop: '1rem'}}>
          Ride:
          <br />
          <input type="text" value={ride} onChange={e => setRide(e.target.value)} />
        </label>

        <p>
          <button onClick={recording ? stopListening : requestPermissionAndListen}>
            {recording ? 'Stop Recording' : 'Start Recording'}
            {lastSample && (
              <>
                <br />
                <small>
                  Last sample: {lastSample.timestamp} <br />
                  Accel: {lastSample.accelX}, {lastSample.accelY}, {lastSample.accelZ} <br />
                  Rot: {lastSample.rotAlpha}, {lastSample.rotBeta}, {lastSample.rotGamma}
                </small>
              </>
            )}
          </button>
          <button onClick={downloadCSV} disabled={samples.length === 0} style={{marginLeft: '1rem'}}>
            Download CSV
          </button>
          <button onClick={shareCSV} disabled={samples.length === 0} style={{marginLeft: '1rem'}}>
            Share CSV
          </button>
        </p>

        <p>
          {recording
            ? `Recording… samples collected: ${samples.length}`
            : `Not recording. Total samples: ${samples.length}`}
        </p>
      </article>
    </Layout>
  )
}

interface PageQueryData {
  site: {
    siteMetadata: {
      title: string
      keywords: [string]
    }
  }
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        keywords
      }
    }
  }
`

export default Measure
