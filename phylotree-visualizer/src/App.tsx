import { useState } from "react";
import PhytoTree from './components/PhyloTree';
import IntroScreen from './components/IntroScreen';
import newick from "./files/plant_cytc_tree.tre?raw";
import fasta from "./files/plant_cytc_sequences.fasta?raw";

const INTRO_SEEN_KEY = "phylotree-intro-seen";

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem(INTRO_SEEN_KEY) !== "1";
    } catch {
      return true;
    }
  });

  function finishIntro() {
    try {
      localStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
    setShowIntro(false);
  }

  return (
    <>
      {showIntro && <IntroScreen onFinish={finishIntro} />}
      <PhytoTree
        newick={newick}
        fasta={fasta}
        className="min-h-[600px]"
        onOpenIntro={() => setShowIntro(true)}
      />
    </>
  );
}

export default App;