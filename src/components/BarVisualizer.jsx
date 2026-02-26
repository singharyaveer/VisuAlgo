import React from 'react';

/**
 * BarVisualizer
 * Renders a row of animated bars whose width auto-adjusts to fit the container.
 * Bar colors: green (default), red (comparing), yellow (swapping), cyan (sorted).
 */

const BAR_COLORS = {
    default: '#22c55e',
    comparing: '#ef4444',
    swapping: '#facc15',
    sorted: '#00d4ff',
};

export default function BarVisualizer({ array, barStates, maxValue }) {
    const n = array.length;

    return (
        <div
            className="relative w-full flex items-end gap-[2px] scanlines"
            style={{
                height: '360px',
                background: 'linear-gradient(180deg, #060d1f 0%, #0a1628 100%)',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: '8px',
                padding: '12px 12px 0 12px',
                overflow: 'hidden',
            }}
        >
            {/* Y-axis grid lines */}
            {[25, 50, 75, 100].map((pct) => (
                <div
                    key={pct}
                    style={{
                        position: 'absolute',
                        bottom: `${pct * (360 - 12) / 100 + 12}px`,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'rgba(0,212,255,0.07)',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />
            ))}

            {array.map((value, i) => {
                const heightPct = maxValue > 0 ? (value / maxValue) * 100 : 0;
                const color = BAR_COLORS[barStates[i]] || BAR_COLORS.default;
                const isActive = barStates[i] === 'comparing' || barStates[i] === 'swapping';

                return (
                    <div
                        key={i}
                        className="sort-bar"
                        style={{
                            flex: '1 1 0',
                            minWidth: 0,
                            height: `${heightPct}%`,
                            backgroundColor: color,
                            position: 'relative',
                            zIndex: 1,
                            boxShadow: isActive
                                ? `0 0 8px ${color}, 0 0 20px ${color}60`
                                : barStates[i] === 'sorted'
                                    ? `0 0 6px ${color}80`
                                    : 'none',
                            transition: 'height 0.05s ease, background-color 0.05s ease, box-shadow 0.05s ease',
                        }}
                        title={`Value: ${value}`}
                    />
                );
            })}

            {/* Empty state */}
            {n === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span style={{ color: 'rgba(0,212,255,0.3)', fontFamily: 'JetBrains Mono', fontSize: '14px' }}>
                        No array data
                    </span>
                </div>
            )}
        </div>
    );
}
