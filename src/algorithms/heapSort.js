import { sleep } from './sleep';

/**
 * Heap Sort
 * Builds a max-heap, then repeatedly swaps root with last element and heapifies.
 */
export async function heapSort(array, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    const arr = [...array];
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
        // Swap root (max) with last element
        setBarStates((prev) => {
            const s = [...prev];
            s[0] = 'swapping';
            s[i] = 'swapping';
            return s;
        });

        [arr[0], arr[i]] = [arr[i], arr[0]];
        swapsRef.current += 1;
        setArray([...arr]);
        await sleep(speed);

        // Mark the placed element as sorted
        setBarStates((prev) => {
            const s = [...prev];
            s[0] = 'default';
            s[i] = 'sorted';
            return s;
        });

        // Heapify reduced heap
        await heapify(arr, i, 0, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    }

    // Mark first element as sorted
    setBarStates((prev) => {
        const s = [...prev];
        s[0] = 'sorted';
        return s;
    });
}

async function heapify(arr, n, i, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    // Highlight the node being heapified
    setBarStates((prev) => {
        const s = [...prev];
        s[i] = 'comparing';
        if (left < n) s[left] = 'comparing';
        if (right < n) s[right] = 'comparing';
        return s;
    });
    await sleep(speed);

    if (left < n) {
        comparisonsRef.current += 1;
        if (arr[left] > arr[largest]) {
            largest = left;
        }
    }

    if (right < n) {
        comparisonsRef.current += 1;
        if (arr[right] > arr[largest]) {
            largest = right;
        }
    }

    if (largest !== i) {
        // Mark swap as yellow
        setBarStates((prev) => {
            const s = [...prev];
            s[i] = 'swapping';
            s[largest] = 'swapping';
            if (left < n && left !== largest) s[left] = 'default';
            if (right < n && right !== largest) s[right] = 'default';
            return s;
        });

        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swapsRef.current += 1;
        setArray([...arr]);
        await sleep(speed);

        setBarStates((prev) => {
            const s = [...prev];
            s[i] = 'default';
            s[largest] = 'default';
            return s;
        });

        await heapify(arr, n, largest, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    } else {
        setBarStates((prev) => {
            const s = [...prev];
            s[i] = 'default';
            if (left < n) s[left] = 'default';
            if (right < n) s[right] = 'default';
            return s;
        });
    }
}
