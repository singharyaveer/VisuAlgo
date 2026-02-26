import { sleep } from './sleep';

/**
 * Insertion Sort
 * Iterates from index 1, shifts larger elements right, inserts key in correct place.
 */
export async function insertionSort(array, setArray, setBarStates, speed, comparisonsRef, swapsRef) {
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        // Mark key bar as comparing (red)
        setBarStates((prev) => {
            const s = [...prev];
            s[i] = 'comparing';
            return s;
        });
        await sleep(speed);

        while (j >= 0 && arr[j] > key) {
            comparisonsRef.current += 1;
            // Mark comparing
            setBarStates((prev) => {
                const s = [...prev];
                s[j] = 'comparing';
                s[j + 1] = 'swapping';
                return s;
            });
            await sleep(speed);

            arr[j + 1] = arr[j];
            swapsRef.current += 1;
            setArray([...arr]);

            setBarStates((prev) => {
                const s = [...prev];
                s[j] = 'default';
                s[j + 1] = 'default';
                return s;
            });

            j--;
        }

        // One more comparison that failed the while condition
        if (j >= 0) {
            comparisonsRef.current += 1;
        }

        arr[j + 1] = key;
        swapsRef.current += 1;
        setArray([...arr]);

        // Reset bar states for this pass
        setBarStates((prev) => {
            const s = [...prev];
            for (let k = 0; k <= i; k++) {
                s[k] = 'default';
            }
            return s;
        });
        await sleep(speed);
    }

    // Mark all as sorted
    setBarStates(arr.map(() => 'sorted'));
}
