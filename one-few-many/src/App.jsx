import React from 'react'
import { useGameStore } from './store/useGameStore'
import { moodFromN } from './components/Darwin'
import Darwin from './components/Darwin'
import { BtnPrimary, Screen } from './components/ui'
import IntroScreen from './screens/IntroScreen'
import Q1Screen from './screens/Q1Screen'
import Q2Screen from './screens/Q2Screen'
import Q3Screen from './screens/Q3Screen'
import EndLucaStays from './screens/EndLucaStays'
import EndLucaReappears from './screens/EndLucaReappears'
import EndMany from './screens/EndMany'

export default function App() {
  const s = useGameStore()
  const mood = (s.step === 'q3_exponent' || s.step === 'end_many')
    ? moodFromN(s.n)
    : (s.q2Choice === 'no' || s.q2 === 'no')
      ? 'skeptical'
      : (s.q2Choice === 'yes' || s.q2 === 'yes')
        ? 'neutral'
        : (s.q1Choice === 'population' || s.q1 === 'population')
          ? 'skeptical'
          : 'neutral'

  const muted = s.step === 'intro';
  console.log(s.q2Choice)

  const button = {
    intro: { label: 'Begin the argument →', action: s.start, disabled: false },
    q1_single_or_pop: { label: 'Continue →', action: s.commitQ1, disabled: !s.q1Choice },
    q2_one_ancestor: { label: 'Continue →', action: s.commitQ2, disabled: !s.q2Choice },
    q3_exponent: { label: 'This is my answer →', action: s.commitN, disabled: false },
    end_luca_stays: { label: 'Start over →', action: s.restart, disabled: false },
    end_luca_reappears: { label: 'Try again →', action: s.restart, disabled: false },
    end_many: { label: 'Restart →', action: s.restart, disabled: false },
  }[s.step]

  return (
    <Screen className="flex flex-col min-h-dvh max-w-md mx-auto w-full">

      {/* Scrollable content */}
      <div className="">
        {s.step === 'intro' && <IntroScreen />}
        {s.step === 'q1_single_or_pop' && <Q1Screen q1Choice={s.q1Choice} onSelect={s.setQ1Choice} />}
        {s.step === 'q2_one_ancestor' && <Q2Screen q2Choice={s.q2Choice} onSelect={s.setQ2Choice} />}
        {s.step === 'q3_exponent' && <Q3Screen n={s.n} onSetN={s.setN} />}
        {s.step === 'end_luca_stays' && <EndLucaStays />}
        {s.step === 'end_luca_reappears' && <EndLucaReappears />}
        {s.step === 'end_many' && <EndMany n={s.n} />}
      </div>

      {/* Fixed bottom: Darwin + button */}
      <div className="w-full px-5 pb-6 pt-2 flex flex-col items-center gap-3 bg-white border-border">
        {s.step === 'intro' && <Darwin mood={mood} showLabel={false} muted />}
        {s.step !== 'intro' && <Darwin mood={mood} showLabel={false} />}
        {button && (
          <BtnPrimary onClick={button.action} disabled={button.disabled} className="w-full">
            {button.label}
          </BtnPrimary>
        )}
      </div>

    </Screen>
  )
}
