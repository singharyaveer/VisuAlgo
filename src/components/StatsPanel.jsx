import React from 'react';

/**
 * StatsPanel
 * Displays elapsed time, comparisons, and swaps/overwrites after sorting.
 */
export default function StatsPanel({ elapsedTime, comparisons, swaps, algorithm, isSorting, isDone }) {
    const formatTime = (ms) => {
        if (ms === null) return '—';
        if (ms < 1000) return `${ms} ms`;
        return `${(ms / 1000).toFixed(2)} s`;
    };

    const algoComplexity = {
        bubble: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        insertion: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
        merge: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
        quick: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
        heap: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    };

    const complexity = algoComplexity[algorithm] || null;

    return (
        <div
            className="card w-full mt-4 p-5"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
            <div className="flex items-center gap-2 mb-4">
                <div
                    style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isSorting ? '#ef4444' : isDone ? '#00d4ff' : '#94a3b8',
                        boxShadow: isSorting ? '0 0 8px #ef4444' : isDone ? '0 0 8px #00d4ff' : 'none',
                        animation: isSorting ? 'blink 0.8s step-end infinite' : 'none',
                    }}
                />
                <h3 style={{ color: '#00d4ff', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em' }}>
                    {isSorting ? 'SORTING...' : isDone ? 'SORT COMPLETE' : 'RUNTIME STATISTICS'}
                </h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Elapsed Time */}
                <div
                    style={{
                        background: '#0a1628',
                        border: '1px solid rgba(0,212,255,0.15)',
                        borderRadius: '8px',
                        padding: '14px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '6px' }}>
                        ELAPSED TIME
                    </div>
                    <div style={{ color: '#00d4ff', fontSize: '22px', fontWeight: 800 }}>
                        {formatTime(elapsedTime)}
                    </div>
                </div>

                {/* Comparisons */}
                <div
                    style={{
                        background: '#0a1628',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '8px',
                        padding: '14px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '6px' }}>
                        COMPARISONS
                    </div>
                    <div style={{ color: '#ef4444', fontSize: '22px', fontWeight: 800 }}>
                        {comparisons.toLocaleString()}
                    </div>
                </div>

                {/* Swaps / Overwrites */}
                <div
                    style={{
                        background: '#0a1628',
                        border: '1px solid rgba(250,204,21,0.2)',
                        borderRadius: '8px',
                        padding: '14px',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '6px' }}>
                        SWAPS / WRITES
                    </div>
                    <div style={{ color: '#facc15', fontSize: '22px', fontWeight: 800 }}>
                        {swaps.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Complexity Info */}
            {complexity && (
                <div
                    style={{
                        background: '#060d1f',
                        border: '1px solid rgba(0,212,255,0.1)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        display: 'flex',
                        gap: '24px',
                        flexWrap: 'wrap',
                    }}
                >
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Best: <span style={{ color: '#22c55e', fontWeight: 700 }}>{complexity.best}</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Avg: <span style={{ color: '#facc15', fontWeight: 700 }}>{complexity.avg}</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Worst: <span style={{ color: '#ef4444', fontWeight: 700 }}>{complexity.worst}</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Space: <span style={{ color: '#00d4ff', fontWeight: 700 }}>{complexity.space}</span>
                    </span>
                </div>
            )}
        </div>
    );
}
