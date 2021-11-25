import { useMemo, useRef } from 'react';
import * as React from 'react';
import { VirtualList } from '../../src/useVirtualList';

export default () => {
  const originalList = useMemo(() => Array.from(Array(10000).keys()), []);

  return (
    <VirtualList
      itemHeight={60}
      overscan={10}
      containerStyle={{
        height: '300px',
        overflow: 'auto',
        border: '1px solid',
      }}
      items={originalList}
      renderItem={(ele, index) => {
        return (
          <div
            style={{
              height: 52,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid #e8e8e8',
              marginBottom: 8,
            }}
            key={index}
          >
            Row: {ele}
          </div>
        );
      }}
    />
  );
};
