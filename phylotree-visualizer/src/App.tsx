import PhytoTree from './components/PhyloTree';
import newick from "./files/plant_cytc_tree.tre?raw";
import fasta  from "./files/plant_cytc_sequences.fasta?raw";

function App() {

  return (
    <PhytoTree
              newick={newick}
              fasta={fasta}
              className="min-h-[600px]"
            /> 
  );
}

export default App;