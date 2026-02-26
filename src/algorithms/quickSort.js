import { sleep } from './sleep';

/**
 * Quick Sort
 * Recursive. Last element as pivot. Partition + swap with visualization.
 */
export async function quickSort(array, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    setBarStates(arr.map(() => 'sorted'));
}

async function quickSortHelper(arr, low, high, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    if (low < high) {
        const pivotIndex = await partition(arr, low, high, setArray, setBarStates, speed, comparisonsRef, swapsRef);
        await quickSortHelper(arr, low, pivotIndex - 1, setArray, setBarStates, speed, comparisonsRef, swapsRef);
        await quickSortHelper(arr, pivotIndex + 1, high, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    }
}

async function partition(arr, low, high, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    const pivot = arr[high];
    let i = low - 1;

    // Mark pivot as comparing
    setBarStates((prev) => {
        const s = [...prev];
        s[high] = 'comparing';
        return s;
    });
    await sleep(speed);

    for (let j = low; j < high; j++) {
        comparisonsRef.current += 1;

        // Highlight current element being compared with pivot
        setBarStates((prev) => {
            const s = [...prev];
            s[j] = 'comparing';
            s[high] = 'comparing';
            return s;
        });
        await sleep(speed);

        if (arr[j] <= pivot) {
            i++;

            // Highlight swap
            setBarStates((prev) => {
                const s = [...prev];
                s[i] = 'swapping';
                s[j] = 'swapping';
                return s;
            });

            [arr[i], arr[j]] = [arr[j], arr[i]];
            swapsRef.current += 1;
            setArray([...arr]);
            await sleep(speed);
        }

        // Reset current element, keep pivot highlighted
        setBarStates((prev) => {
            const s = [...prev];
            s[j] = 'default';
            if (i >= low && i !== j) s[i] = 'default';
            s[high] = 'comparing';
            return s;
        });
    }

    // Place pivot in its correct position
    setBarStates((prev) => {
        const s = [...prev];
        s[i + 1] = 'swapping';
        s[high] = 'swapping';
        return s;
    });

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swapsRef.current += 1;
    setArray([...arr]);
    await sleep(speed);

    // Reset
    setBarStates((prev) => {
        const s = [...prev];
        for (let k = low; k <= high; k++) s[k] = 'default';
        return s;
    });

    return i + 1;
}
