import { useState } from 'react'
import VegasIntro from './components/screens/VegasIntro'
import WapperScreen from './components/screens/WapperScreen'
import GambleSimulationApp from './components/GambleSimulation'

function App() {
  const [screen, setScreen] = useState('intro') // 'intro' | 'wapper' | 'game'

  if (screen === 'intro') return <VegasIntro onPlay={() => setScreen('wapper')} />
  if (screen === 'wapper') return <WapperScreen onContinue={() => setScreen('game')} />
  return <GambleSimulationApp />
}

export default App