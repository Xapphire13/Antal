// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function nonNull<T>(_item: T | null | undefined): _item is T {
  return true;
}
