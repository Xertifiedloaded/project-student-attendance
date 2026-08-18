'use client'

import { useEffect, useRef, useState } from 'react'

function getDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const toRad = (v: number) => (v * Math.PI) / 180
  const R = 6371000

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 5) return 'Still dark out'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 20) return 'Good evening'

  return 'Working late'
}

type Farm = {
  name: string
  latitude: number
  longitude: number
  radius: number
}

type Coordinates = {
  latitude: number
  longitude: number
}

export default function StudentDashboard() {
  const [step, setStep] = useState<
    'start' | 'location' | 'photo' | 'confirm' | 'done'
  >('start')

  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [withinGeofence, setWithinGeofence] = useState<boolean | null>(null)

  const [farm, setFarm] = useState<Farm | null>(null)

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetch('/api/farm')
      .then((r) => r.json())
      .then((data) => {
        if (data?.farm) {
          setFarm(data.farm)

          // If location was already obtained before farm data loaded,
          // calculate the geofence now.
          if (coords) {
            const d = getDistanceMeters(
              coords.latitude,
              coords.longitude,
              data.farm.latitude,
              data.farm.longitude
            )

            setDistance(Math.round(d))
            setWithinGeofence(d <= (data.farm.radius || 0))
          }
        }
      })
      .catch(() => {})
  }, [coords])

  async function handleGetLocation() {
    setMsg(null)

    if (!navigator.geolocation) {
      setMsg(
        'Your browser can’t share location. Try a different browser or device.'
      )
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude

        const newCoords = {
          latitude,
          longitude,
        }

        setCoords(newCoords)

        if (farm) {
          const d = getDistanceMeters(
            latitude,
            longitude,
            farm.latitude,
            farm.longitude
          )

          setDistance(Math.round(d))
          setWithinGeofence(d <= (farm.radius || 0))
        }

        setStep('location')
        setLoading(false)
      },
      (err) => {
        setLoading(false)

        if (err.code === 1) {
          setMsg(
            'We need permission to see your location. Check your browser or phone settings and try again.'
          )
        } else if (err.code === 2) {
          setMsg(
            'Couldn’t find your location. Step outside or wait a moment for a signal.'
          )
        } else if (err.code === 3) {
          setMsg('That took too long. Give it another try.')
        } else {
          setMsg('Something went wrong finding you: ' + err.message)
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    )
  }

  function handleOpenCamera() {
    setMsg(null)

    if (!fileInputRef.current) {
      const input = document.createElement('input')

      input.type = 'file'
      input.accept = 'image/*'
      input.capture = 'environment'
      input.style.display = 'none'

      input.onchange = async () => {
        const file = input.files?.[0]

        if (!file) {
          setMsg('No photo was taken.')
          return
        }

        const reader = new FileReader()

        reader.onload = () => {
          const result = reader.result

          if (typeof result === 'string') {
            setPhotoDataUrl(result)
          }

          setStep('photo')
        }

        reader.readAsDataURL(file)
      }

      document.body.appendChild(input)

      fileInputRef.current = input
    }

    fileInputRef.current.click()
  }

  async function handleSubmit(shift = 'Morning') {
    if (!coords) {
      setMsg('Let’s find your location first.')
      return
    }

    if (!photoDataUrl) {
      setMsg('One photo and you’re done.')
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      const base64 = photoDataUrl.split(',')[1]

      const res = await fetch('/api/attendance/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shiftName: shift,
          latitude: coords.latitude,
          longitude: coords.longitude,
          photoBase64: base64,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStep('done')

        setMsg(
          data.locationVerified
            ? 'You’re checked in. Have a good shift.'
            : 'You’re checked in. A supervisor will confirm your location shortly.'
        )
      } else {
        setMsg(
          data.error || 'That didn’t go through. Try submitting again.'
        )
      }
    } catch (e) {
      setMsg('Couldn’t reach the server: ' + String(e))
    }

    setLoading(false)
  }

  const steps = [
    {
      key: 'location',
      label: 'Find your spot',
      done: !!coords,
    },
    {
      key: 'photo',
      label: 'Say hello to the camera',
      done: !!photoDataUrl,
    },
    {
      key: 'confirm',
      label: 'Send it in',
      done: step === 'done',
    },
  ]

  return (
    <main className="min-h-screen w-full bg-[#f6f3ee] px-3 py-5 font-sans text-[#2a2822] sm:px-5 sm:py-8 md:px-6 md:py-10">
      <div className="mx-auto w-full max-w-[560px]">
        <section className="w-full overflow-hidden rounded-2xl border border-[#e2dccf] bg-[#fffdfa] shadow-sm sm:rounded-[20px]">
          {/* Header */}
          <div className="border-b border-[#eee8dc] px-5 py-6 sm:px-7 sm:py-8 md:px-9">
            <span className="text-xs tracking-wide text-[#837a6c] sm:text-[13px]">
              {getGreeting()}
            </span>

            <h1 className="mt-1.5 text-[24px] font-semibold leading-tight text-[#26241e] sm:text-[28px]">
              Let’s get you checked in
            </h1>

            <p className="mt-2 max-w-[480px] text-[13.5px] leading-6 text-[#6f6759] sm:text-sm">
              {farm
                ? `You’re marking attendance at ${farm.name}.`
                : 'Three quick things and you’re on record for today.'}
            </p>
          </div>

          {/* Steps */}
          <div className="px-5 py-6 sm:px-7 sm:py-8 md:px-9">
            <div className="flex flex-col">
              {steps.map((s, i) => (
                <div
                  className="flex min-w-0 gap-3.5 sm:gap-4"
                  key={s.key}
                >
                  {/* Step indicator */}
                  <div className="flex w-4 shrink-0 flex-col items-center">
                    <span
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 transition-colors ${
                        s.done
                          ? 'border-[#56684a] bg-[#56684a]'
                          : 'border-[#cfc7b6] bg-[#e2dccf]'
                      }`}
                    />

                    {i < steps.length - 1 && (
                      <span
                        className={`my-1 min-h-[70px] w-0.5 flex-1 transition-colors sm:min-h-[80px] ${
                          s.done ? 'bg-[#56684a]' : 'bg-[#e2dccf]'
                        }`}
                      />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="min-w-0 flex-1 pb-8 last:pb-0 sm:pb-9">
                    <h3 className="mb-1 text-[15px] font-semibold leading-5 text-[#26241e] sm:text-base">
                      {s.label}
                    </h3>

                    {/* Location */}
                    {s.key === 'location' && (
                      <div className="w-full">
                        <p className="mb-3 max-w-[470px] text-[13px] leading-5 text-[#746c60] sm:text-[13.5px] sm:leading-relaxed">
                          Share where you are right now so we know you’ve
                          arrived.
                        </p>

                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={loading}
                          className="flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[#56684a] px-4 py-2.5 text-sm font-semibold text-[#fdfbf7] transition-colors hover:bg-[#47563d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[170px]"
                        >
                          {loading
                            ? 'Finding you…'
                            : coords
                              ? 'Update my location'
                              : 'Share my location'}
                        </button>

                        {coords && (
                          <p className="mt-2 break-all text-[11.5px] leading-5 text-[#8c8474] sm:text-[12.5px]">
                            {coords.latitude.toFixed(5)},{' '}
                            {coords.longitude.toFixed(5)}
                          </p>
                        )}

                        {distance !== null && (
                          <p
                            className={`mt-2.5 w-full rounded-lg px-3 py-2.5 text-[12.5px] leading-5 sm:text-[13px] ${
                              withinGeofence
                                ? 'bg-[#eef2ea] text-[#3f6b4b]'
                                : 'bg-[#f4ece6] text-[#9c5a3c]'
                            }`}
                          >
                            {withinGeofence
                              ? `You’re on the field — ${distance} m from the marker.`
                              : `You seem to be ${distance} m away. Move a little closer if you can.`}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Photo */}
                    {s.key === 'photo' && (
                      <div className="w-full">
                        <p className="mb-3 max-w-[470px] text-[13px] leading-5 text-[#746c60] sm:text-[13.5px] sm:leading-relaxed">
                          Just a quick photo so there’s a record it was really
                          you.
                        </p>

                        <button
                          type="button"
                          onClick={handleOpenCamera}
                          className="flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[#efe9dd] px-4 py-2.5 text-sm font-semibold text-[#3d382e] transition-colors hover:bg-[#e5ddca] sm:w-auto sm:min-w-[140px]"
                        >
                          {photoDataUrl ? 'Retake photo' : 'Open camera'}
                        </button>

                        {photoDataUrl && (
                          <div className="mt-3 w-full">
                            <div className="relative w-full max-w-[240px] overflow-hidden rounded-xl border border-[#e2dccf] bg-[#f4f0e8] sm:max-w-[180px]">
                              <img
                                src={photoDataUrl}
                                alt="Your check-in photo"
                                className="aspect-square h-auto w-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Confirmation */}
                    {s.key === 'confirm' && (
                      <div className="w-full">
                        <p className="mb-3 max-w-[470px] text-[13px] leading-5 text-[#746c60] sm:text-[13.5px] sm:leading-relaxed">
                          Everything looks good? Send it and you’re done for
                          now.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleSubmit('Morning')}
                          disabled={loading || !coords || !photoDataUrl}
                          className="flex min-h-11 w-full items-center justify-center rounded-[10px] bg-[#56684a] px-4 py-2.5 text-sm font-semibold text-[#fdfbf7] transition-colors hover:bg-[#47563d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[170px]"
                        >
                          {loading ? 'Sending…' : 'Submit attendance'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message */}
            {msg && (
              <div
                role="status"
                className={`mt-1 w-full rounded-[10px] px-3.5 py-3 text-[13px] leading-5 sm:text-[13.5px] ${
                  step === 'done'
                    ? 'bg-[#eef2ea] text-[#3f6b4b]'
                    : 'bg-[#f1ede3] text-[#4a4436]'
                }`}
              >
                {msg}
              </div>
            )}
          </div>
        </section>

        {/* Small-screen footer spacing */}
        <div className="h-2 sm:h-0" />
      </div>
    </main>
  )
}