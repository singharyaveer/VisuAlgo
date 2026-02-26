import React from 'react';

const ALGORITHMS = [
    {
        id: 'bubble',
        name: 'Bubble Sort',
        tag: 'O(n²)',
        color: '#ef4444',
        desc: 'Adjacent comparison & swap',
    },
    {
        id: 'insertion',
        name: 'Insertion Sort',
        tag: 'O(n²)',
        color: '#f97316',
        desc: 'Shift & insert in place',
    },
    {
        id: 'merge',
        name: 'Merge Sort',
        tag: 'O(n log n)',
        color: '#a855f7',
        desc: 'Recursive divide & conquer',
    },
    {
        id: 'quick',
        name: 'Quick Sort',
        tag: 'O(n log n)',
        color: '#00d4ff',
        desc: 'Pivot-based partitioning',
    },
    {
        id: 'heap',
        name: 'Heap Sort',
        tag: 'O(n log n)',
        color: '#22c55e',
        desc: 'Max-heap extraction',
    },
];

/**
 * ControlPanel
 * Algorithm selector cards, array size slider, speed slider, Run and New Array buttons.
 */
export default function ControlPanel({
    algorithm,
    setAlgorithm,
    arraySize,
    setArraySize,
    speed,
    setSpeed,
    isSorting,
    onRun,
    onNewArray,
}) {
    // Speed: slider 1 (slowest=500ms) → 10 (fastest=5ms)
    const speedLabel = speed <= 20 ? 'BLAZING' : speed <= 60 ? 'FAST' : speed <= 150 ? 'MEDIUM' : speed <= 300 ? 'SLOW' : 'CRAWL';
    const speedSliderValue = Math.round(((500 - speed) / (500 - 5)) * 100);

    const handleSpeedChange = (e) => {
        const pct = parseInt(e.target.value);
        // Map 0–100 slider → 500ms–5ms (inverted: higher slider = lower ms = faster)
        const ms = Math.round(500 - (pct / 100) * 495);
        setSpeed(ms);
        e.target.style.setProperty('--val', `${pct}%`);
    };

    const handleSizeChange = (e) => {
        const val = parseInt(e.target.value);
        const pct = ((val - 5) / (45 - 5)) * 100;
        e.target.style.setProperty('--val', `${pct}%`);
        setArraySize(val);
    };

    return (
        <div className="w-full" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {/* Algorithm Selection */}
            <div className="mb-14">
                <div style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', marginBottom: '10px' }}>
                    SELECT ALGORITHM
                </div>
                <div className="grid grid-cols-5 gap-2">
                    {ALGORITHMS.map((algo) => (
                        <button
                            key={algo.id}
                            id={`algo-${algo.id}`}
                            onClick={() => !isSorting && setAlgorithm(algo.id)}
                            disabled={isSorting}
                            className="algo-card card text-left"
                            style={{
                                padding: '14px 10px',
                                border: `1px solid ${algorithm === algo.id ? algo.color : 'rgba(0,212,255,0.12)'}`,
                                background: algorithm === algo.id ? `${algo.color}15` : '#0d1a35',
                                boxShadow: algorithm === algo.id ? `0 0 16px ${algo.color}40` : 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                opacity: isSorting ? 0.5 : 1,
                                cursor: isSorting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <span style={{ color: algorithm === algo.id ? algo.color : '#e2e8f0', fontSize: '11px', fontWeight: 700, lineHeight: 1.3 }}>
                                {algo.name}
                            </span>
                            <span style={{ color: algo.color, fontSize: '10px', fontWeight: 600, opacity: 0.8 }}>
                                {algo.tag}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Array Size + Speed + Buttons row */}
            <div className="grid grid-cols-2 gap-5 mb-10">
                {/* Array Size */}
                <div className="card p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em' }}>ARRAY SIZE</span>
                        <span style={{ color: '#00d4ff', fontSize: '18px', fontWeight: 800 }}>{arraySize}</span>
                    </div>
                    <input
                        type="range"
                        id="array-size-slider"
                        min={5}
                        max={45}
                        value={arraySize}
                        disabled={isSorting}
                        onChange={handleSizeChange}
                        style={{ '--val': `${((arraySize - 5) / 40) * 100}%` }}
                    />
                    <div className="flex justify-between mt-1">
                        <span style={{ color: '#475569', fontSize: '9px' }}>5</span>
                        <span style={{ color: '#475569', fontSize: '9px' }}>45</span>
                    </div>
                </div>

                {/* Speed */}
                <div className="card p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em' }}>SPEED</span>
                        <span style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 800 }}>{speedLabel}</span>
                    </div>
                    <input
                        type="range"
                        id="speed-slider"
                        min={0}
                        max={100}
                        value={speedSliderValue}
                        disabled={isSorting}
                        onChange={handleSpeedChange}
                        style={{ '--val': `${speedSliderValue}%` }}
                    />
                    <div className="flex justify-between mt-1">
                        <span style={{ color: '#475569', fontSize: '9px' }}>SLOW</span>
                        <span style={{ color: '#475569', fontSize: '9px' }}>FAST</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    id="run-btn"
                    onClick={onRun}
                    disabled={isSorting}
                    className="btn-accent flex-1"
                    style={{ padding: '12px', fontSize: '13px', letterSpacing: '0.1em' }}
                >
                    {isSorting ? '⏳ SORTING...' : '▶  RUN SORT'}
                </button>
                <button
                    id="new-array-btn"
                    onClick={onNewArray}
                    disabled={isSorting}
                    className="btn-secondary"
                    style={{ padding: '12px 20px', fontSize: '13px', letterSpacing: '0.06em' }}
                >
                    ↺ NEW ARRAY
                </button>
            </div>

            {/* Color Legend */}
            <div className="flex gap-5 mt-10" style={{ fontSize: '10px', color: '#94a3b8' }}>
                <span className="flex items-center gap-1">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#22c55e', borderRadius: '2px' }} />
                    DEFAULT
                </span>
                <span className="flex items-center gap-1">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }} />
                    COMPARING
                </span>
                <span className="flex items-center gap-1">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#facc15', borderRadius: '2px' }} />
                    SWAPPING
                </span>
                <span className="flex items-center gap-1">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#00d4ff', borderRadius: '2px' }} />
                    SORTED
                </span>
            </div>
        </div>
    );
}
