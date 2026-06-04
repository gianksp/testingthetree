import { useReducer } from 'react'

const initial = {
  step: 'intro',
  q1: null,
  q2: null,
  q1Choice: null,  // pending selection before commit
  q2Choice: null,  // pending selection before commit
  n: 1,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, step: 'q1_single_or_pop' }
    case 'SET_Q1_CHOICE':
      return { ...state, q1Choice: action.choice }
    case 'SET_Q2_CHOICE':
      return { ...state, q2Choice: action.choice }
    case 'Q1':
      return action.choice === 'single'
        ? { ...state, q1: 'single', step: 'end_luca_stays' }
        : { ...state, q1: 'population', step: 'q2_one_ancestor' }
    case 'Q2':
      return action.choice === 'yes'
        ? { ...state, q2: 'yes', step: 'end_luca_reappears' }
        : { ...state, q2: 'no', step: 'q3_exponent' }
    case 'SET_N':
      return { ...state, n: action.n }
    case 'COMMIT_N':
      return { ...state, step: 'end_many' }
    case 'RESTART':
      return { ...initial }
    default:
      return state
  }
}

export function useGameStore() {
  const [state, dispatch] = useReducer(reducer, initial)
  return {
    ...state,
    start:         ()  => dispatch({ type: 'START' }),
    setQ1Choice:   (c) => dispatch({ type: 'SET_Q1_CHOICE', choice: c }),
    setQ2Choice:   (c) => dispatch({ type: 'SET_Q2_CHOICE', choice: c }),
    commitQ1:      ()  => dispatch({ type: 'Q1', choice: state.q1Choice }),
    commitQ2:      ()  => dispatch({ type: 'Q2', choice: state.q2Choice }),
    setN:          (n) => dispatch({ type: 'SET_N', n }),
    commitN:       ()  => dispatch({ type: 'COMMIT_N' }),
    restart:       ()  => dispatch({ type: 'RESTART' }),
  }
}
