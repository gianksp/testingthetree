function shuffle(array) {
  const clone = [...array]
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[clone[i], clone[j]] = [clone[j], clone[i]]
  }
  return clone
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function buildExperimentRound(library) {
  const target = randomItem(library)
  const correctStep = target.steps[Math.floor(target.steps.length / 2)]

  const distractors = shuffle(
    library
      .filter((item) => item.id !== target.id)
      .map((item) => ({
        src: randomItem(item.steps),
        sourceName: item.name,
        correct: false,
      }))
  ).slice(0, 3)

  const options = shuffle([
    {
      src: correctStep,
      sourceName: target.name,
      correct: true,
    },
    ...distractors,
  ]).map((item, index) => ({
    ...item,
    id: `option-${index + 1}`,
    label: `Option ${index + 1}`,
  }))

  return { target, options }
}