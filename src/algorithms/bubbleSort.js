import { sleep } from './sleep';

/**
 * Bubble Sort
 * Two nested loops — compare adjacent elements, swap if needed.
 */
export async function bubbleSort(array, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Mark comparing bars as red
            setBarStates((prev) => {
                const s = [...prev];
                s[j] = 'comparing';
                s[j + 1] = 'comparing';
                return s;
            });
            comparisonsRef.current += 1;
            await sleep(speed);

            if (arr[j] > arr[j + 1]) {
                // Mark swapping bars as yellow
                setBarStates((prev) => {
                    const s = [...prev];
                    s[j] = 'swapping';
                    s[j + 1] = 'swapping';
                    return s;
                });
                // Swap
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapsRef.current += 1;
                setArray([...arr]);
                await sleep(speed);
            }

            // Reset to default
            setBarStates((prev) => {
                const s = [...prev];
                s[j] = 'default';
                s[j + 1] = 'default';
                return s;
            });
        }
        // Mark sorted bar
        setBarStates((prev) => {
            const s = [...prev];
            s[n - 1 - i] = 'sorted';
            return s;
        });
    }
    // Mark first bar as sorted too
    setBarStates((prev) => {
        const s = [...prev];
        s[0] = 'sorted';
        return s;
    });
}
