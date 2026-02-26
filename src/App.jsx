import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.css';
import BarVisualizer from './components/BarVisualizer';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import { bubbleSort } from './algorithms/bubbleSort';
import { insertionSort } from './algorithms/insertionSort';
import { mergeSort } from './algorithms/mergeSort';
import { quickSort } from './algorithms/quickSort';
import { heapSort } from './algorithms/heapSort';

const ALGORITHM_MAP = {
  bubble: bubbleSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

const ALGORITHM_NAMES = {
  bubble: 'Bubble Sort',
  insertion: 'Insertion Sort',
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  heap: 'Heap Sort',
};

/** Generate an array of random integers in [10, 400] */
function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 391) + 10);
}

export default function App() {
  const [array, setArray] = useState(() => generateArray(20));
  const [arraySize, setArraySize] = useState(20);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [speed, setSpeed] = useState(80); // ms per step
  const [isSorting, setIsSorting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [barStates, setBarStates] = useState(() => new Array(20).fill('default'));
  const [elapsedTime, setElapsedTime] = useState(null);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  // Refs for live counters accessible inside async sort functions
  const comparisonsRef = useRef(0);
  const swapsRef = useRef(0);
  const sortingRef = useRef(false); // guard against double-run

  // Sync counter refs → state periodically while sorting
  const syncStatsInterval = useRef(null);

  // Generate new random array when size changes
  useEffect(() => {
    const newArr = generateArray(arraySize);
    setArray(newArr);
    setBarStates(new Array(arraySize).fill('default'));
    resetStats();
    setIsDone(false);
  }, [arraySize]);

  // Reset stats when algorithm changes
  useEffect(() => {
    resetStats();
    setIsDone(false);
    setBarStates((prev) => prev.map(() => 'default'));
  }, [algorithm]);

  function resetStats() {
    comparisonsRef.current = 0;
    swapsRef.current = 0;
    setComparisons(0);
    setSwaps(0);
    setElapsedTime(null);
  }

  function handleNewArray() {
    if (isSorting) return;
    const newArr = generateArray(arraySize);
    setArray(newArr);
    setBarStates(new Array(arraySize).fill('default'));
    resetStats();
    setIsDone(false);
  }

  async function handleRun() {
    if (isSorting || sortingRef.current) return;

    sortingRef.current = true;
    setIsSorting(true);
    setIsDone(false);
    resetStats();
    setBarStates(new Array(array.length).fill('default'));

    // Start live stat sync
    syncStatsInterval.current = setInterval(() => {
      setComparisons(comparisonsRef.current);
      setSwaps(swapsRef.current);
    }, 50);

    const sortFn = ALGORITHM_MAP[algorithm];
    const startTime = performance.now();

    try {
      await sortFn(array, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    } catch (err) {
      console.error('Sort error:', err);
    }

    const endTime = performance.now();

    clearInterval(syncStatsInterval.current);
    setComparisons(comparisonsRef.current);
    setSwaps(swapsRef.current);
    setElapsedTime(Math.round(endTime - startTime));
    setIsSorting(false);
    setIsDone(true);
    sortingRef.current = false;
  }

  const handleSetAlgorithm = useCallback((algo) => {
    if (isSorting) return;
    setAlgorithm(algo);
  }, [isSorting]);

  const handleSetArraySize = useCallback((size) => {
    if (isSorting) return;
    setArraySize(size);
  }, [isSorting]);

  const maxValue = Math.max(...array, 1);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #060d1f 0%, #0a1628 50%, #060d1f 100%)',
        padding: '0 0 40px 0',
      }}
    >
      {/* Header / Hero */}
      <header
        style={{
          padding: '24px 0 20px',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
          background: 'rgba(6,13,31,0.8)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '28px',
                fontWeight: 900,
                color: '#00d4ff',
                textShadow: '0 0 20px rgba(0,212,255,0.5)',
                letterSpacing: '0.05em',
                lineHeight: 1,
              }}
            >
              VISU<span style={{ color: '#ffffff' }}>ALGO - BY <span style={{ color: '#00d4ff' }}>ARYAVEER</span></span>
            </h1>
            <p style={{ color: '#475569', fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', marginTop: '3px' }}>
              ALGORITHM VISUALIZER
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#00d4ff', fontWeight: 700, fontSize: '13px' }}>
                {ALGORITHM_NAMES[algorithm]}
              </div>
              <div style={{ color: '#475569', fontSize: '10px', letterSpacing: '0.08em' }}>
                {arraySize} ELEMENTS
              </div>
            </div>
            {/* Status indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isSorting ? '#ef4444' : isDone ? '#22c55e' : '#00d4ff',
                  boxShadow: isSorting ? '0 0 10px #ef4444' : isDone ? '0 0 10px #22c55e' : '0 0 10px #00d4ff',
                }}
              />
              <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em' }}>
                {isSorting ? 'RUNNING' : isDone ? 'DONE' : 'READY'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 0' }}>
        {/* Subtitle */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: '#334155', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em' }}>
            {'> '}
            <span style={{ color: '#94a3b8' }}>
              Select an algorithm, configure the array size, adjust speed, and hit{' '}
            </span>
            <span style={{ color: '#00d4ff' }}>RUN</span>
            <span style={{ color: '#94a3b8' }}> to visualize the sort.</span>
            <span className="cursor-blink" style={{ color: '#00d4ff' }}>_</span>
          </p>
        </div>

        {/* Visualizer */}
        <BarVisualizer array={array} barStates={barStates} maxValue={maxValue} />

        {/* Controls */}
        <div className="mt-5">
          <ControlPanel
            algorithm={algorithm}
            setAlgorithm={handleSetAlgorithm}
            arraySize={arraySize}
            setArraySize={handleSetArraySize}
            speed={speed}
            setSpeed={setSpeed}
            isSorting={isSorting}
            onRun={handleRun}
            onNewArray={handleNewArray}
          />
        </div>

        {/* Stats */}
        <StatsPanel
          elapsedTime={elapsedTime}
          comparisons={comparisons}
          swaps={swaps}
          algorithm={algorithm}
          isSorting={isSorting}
          isDone={isDone}
        />
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#ffffff', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em' }}>
        VISUALGO · ALGORITHM VISUALIZER · BY ARYAVEER SINGH YADAV
      </footer>
    </div>
  );
}
