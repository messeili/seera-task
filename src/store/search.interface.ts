export interface ISearchLabel<T> {
    search: (query: string, page: number) => void;
    reset: () => void;
    data: T
}
