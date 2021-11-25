import { renderHook } from '@testing-library/react-hooks';

import useVirtualList, { IUseVirtualListResult } from '../useVirtualList';

describe('useVirtualList', () => {
  test('import useVirtualList from "hookdafish/useVirtualList"', () => {
    expect(typeof useVirtualList).toBe('function');
  });

  let containerEl: HTMLElement;
  let listEl: HTMLElement;
  let resHook: IUseVirtualListResult;
  let rerender: Function;

  beforeAll(() => {
    containerEl = document.createElement('div');
    listEl = document.createElement('div');
    jest
      .spyOn(containerEl, 'clientHeight', 'get')
      .mockImplementation(() => 100);
    jest.spyOn(containerEl, 'scrollTop', 'get').mockImplementation(() => 0);

    // We have 10 items
    const { result, rerender: tmpRerender } = renderHook(() => {
      const value = useVirtualList({
        containerRef: containerEl,
        listRef: listEl,
        numOfItems: 10,
        itemHeight: 50,
        overscan: 2,
      });
      return value;
    });

    resHook = result.current;
    rerender = tmpRerender;
  });

  test(`
      - Container Height: 100
      - 10 items - 1 item 's height = 50
      - buffered items count: 2 
      => render maximum 5 items
  `, async () => {
    expect(resHook.isItemVisible(0)).toEqual(true);
    expect(resHook.isItemVisible(1)).toEqual(true);
    expect(resHook.isItemVisible(2)).toEqual(true);
    expect(resHook.isItemVisible(3)).toEqual(true);
    expect(resHook.isItemVisible(4)).toEqual(true);
    // 0-> 4 should be true
    // 5 is out of view -> not rendering
    expect(resHook.isItemVisible(5)).toEqual(false);
  });

  test(`
     Scroll down 50px
     -> render 0..5
     -> 6..9 not
    `, async () => {
    // Scroll  50px  -> 5 should be rendrered, 0 - 1 should keep (buffered is 2)
    jest.spyOn(containerEl, 'scrollTop', 'get').mockImplementation(() => 50);
    rerender();
    expect(resHook.isItemVisible(0)).toEqual(true);
    expect(resHook.isItemVisible(5)).toEqual(true);
    expect(resHook.isItemVisible(6)).toEqual(false);
  });

  test(`
  Continue Scrolling down 50px
  -> render 1..6
  -> 0 & 7..9 not
 `, async () => {
    jest.spyOn(containerEl, 'scrollTop', 'get').mockImplementation(() => 100);
    rerender();
    // 0 not
    expect(resHook.isItemVisible(0)).toEqual(false);

    // 1 keep
    expect(resHook.isItemVisible(1)).toEqual(true);
    expect(resHook.isItemVisible(5)).toEqual(true);
    // 6 appear
    expect(resHook.isItemVisible(6)).toEqual(true);
    // 7 not
    expect(resHook.isItemVisible(7)).toEqual(false);
  });
});
