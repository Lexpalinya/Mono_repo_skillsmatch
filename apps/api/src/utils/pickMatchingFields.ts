type AnyObject = Record<string, any>;
export function pickMatchingFields<T extends AnyObject, U extends AnyObject>(
    source: T,
    filter: U
): Partial<T> {
    const result: Partial<T> = {};

    for (const key in source) {
        if (key in filter) {
            result[key] = source[key];
        }
    }

    return result;
}
