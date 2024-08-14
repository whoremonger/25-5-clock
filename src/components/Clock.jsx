import { useState, useEffect } from 'react'
import '../App.css'

function Clock() {

  const defBreakTime = 5 * 60
  const defSessionTime = 25 * 60
  const min = 60
  const max = 60 * 60
  const interval = 60

  const [breakTime, setBreakTime] = useState(defBreakTime)
  const [sessionTime, setSessionTime] = useState(defSessionTime)
  const [displayState, setDisplayState] = useState({
    time: defSessionTime,
    timeType: "Session",
    timeRunning: false
  })

  useEffect(() => {
    let timer
    if (displayState.timeRunning) {
      timer = setInterval(() => {
        setDisplayState(prevState => {
          if (prevState.time === 0) {
            alarmSound()
            return {
              ...prevState,
              time: prevState.timeType === "Session" ? breakTime : sessionTime,
              timeType: prevState.timeType === "Session" ? "Break" : "Session"
            }
          }
          return { ...prevState, time: prevState.time - 1 }
        })
      }, 1000)
    } else if (!displayState.timeRunning && displayState.time !== 0) {
      clearInterval(timer)
    }
    return () => clearInterval(timer) 
  }, [displayState.timeRunning, displayState.time, breakTime, sessionTime])

  function handleBreakIncrement() {
    if (breakTime < max) {
      setBreakTime(breakTime + interval)
    }
  }

  function handleBreakDecrement() {
    if (breakTime > min) {
      setBreakTime(breakTime - interval)
    }
  }

  function handleSessionIncrement() {
    if (sessionTime < max) {
      setSessionTime(sessionTime + interval) 
      if (!displayState.timeRunning) {
        setDisplayState({ ... displayState, time: sessionTime + interval })
      }
    }
  }

  function handleSessionDecrement() {
    if (sessionTime > min) {
      setSessionTime(sessionTime - interval)
      if (!displayState.timeRunning) {
        setDisplayState({ ...displayState, time: sessionTime - interval })
      }
    }
  }
  function handleStartStop() {
    setDisplayState(prevState => ({
      ...prevState,
      timeRunning: !prevState.timeRunning
    }))
  }

  function handleReset() {
    setBreakTime(defBreakTime)
    setSessionTime(defSessionTime)
    setDisplayState({
      time: defSessionTime,
      timeType: "Session",
      timeRunning: false
    })
    const audio = document.getElementById("beep")
    audio.pause()
    audio.currentTime = 0
  }

  function alarmSound() {
    const audio = document.getElementById("beep")
    audio.play()

  }

 //works! passes all tests!

  return (

    <div id="clock">
      <h3 id="break-label">Break Session Length</h3>
      <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
      <span id="break-length">{Math.floor(breakTime / 60)}</span>
      <button id="break-increment" onClick={handleBreakIncrement}>+</button>

      <h3 id="session-label">Session Length</h3>
      <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
      <span id="session-length">{Math.floor(sessionTime / 60)}</span>
      <button id="session-increment" onClick={handleSessionIncrement}>+</button>
      <h3 id="timer-label">{displayState.timeType}</h3>
      <h2 id="time-left">{`${Math.floor(displayState.time / 60).toString().padStart(2, "0")}:${(displayState.time % 60).toString().padStart(2, "0")}`}</h2>

      <button id="start_stop" onClick={handleStartStop}>{displayState.timeRunning ? "Pause" : "Play"}</button>
      <button id="reset" onClick={handleReset}>Reset</button>
      <audio preload="auto" id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
  )
}

export default Clock












