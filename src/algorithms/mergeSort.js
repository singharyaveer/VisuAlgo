import { sleep } from './sleep';

/**
 * Merge Sort
 * Recursive implementation. Updates visualization during each overwrite in the merge step.
 */
export async function mergeSort(array, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    setBarStates(arr.map(() => 'sorted'));
}

async function mergeSortHelper(arr, left, right, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    await mergeSortHelper(arr, left, mid, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    await mergeSortHelper(arr, mid + 1, right, setArray, setBarStates, speed, comparisonsRef, swapsRef);
    await merge(arr, left, mid, right, setArray, setBarStates, speed, comparisonsRef, swapsRef);
}

async function merge(arr, left, mid, right, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
        comparisonsRef.current += 1;

        // Highlight the two elements being compared
        setBarStates((prev) => {
            const s = [...prev];
            s[left + i] = 'comparing';
            s[mid + 1 + j] = 'comparing';
            return s;
        });
        await sleep(speed);

        if (leftArr[i] <= rightArr[j]) {
            arr[k] = leftArr[i];
            i++;
        } else {
            arr[k] = rightArr[j];
            j++;
        }

        swapsRef.current += 1;

        // Mark overwrite position as yellow
        setBarStates((prev) => {
            const s = [...prev];
            // Reset previous highlights
            for (let x = left; x <= right; x++) s[x] = 'default';
            s[k] = 'swapping';
            return s;
        });

        setArray([...arr]);
        await sleep(speed);

        setBarStates((prev) => {
            const s = [...prev];
            s[k] = 'default';
            return s;
        });

        k++;
    }

    // Copy remaining left elements
    while (i < leftArr.length) {
        arr[k] = leftArr[i];
        swapsRef.current += 1;

        setBarStates((prev) => {
            const s = [...prev];
            s[k] = 'swapping';
            return s;
        });
        setArray([...arr]);
        await sleep(speed);

        setBarStates((prev) => {
            const s = [...prev];
            s[k] = 'default';
            return s;
        });

        i++;
        k++;
    }

    // Copy remaining right elements
    while (j < rightArr.length) {
        arr[k] = rightArr[j];
        swapsRef.current += 1;

        setBarStates((prev) => {
            const s = [...prev];
            s[k] = 'swapping';
            return s;
        });
        setArray([...arr]);
        await sleep(speed);

        setBarStates((prev) => {
            const s = [...prev];
            s[k] = 'default';
            return s;
        });

        j++;
        k++;
    }
}
