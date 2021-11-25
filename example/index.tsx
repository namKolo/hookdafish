import * as React from 'react';
import * as ReactDOM from 'react-dom';

import useEventListener from '../src/useEventListener';
const App = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [count, setCount] = React.useState(0);

  const event2 = () => {
    console.log('event2');
    setCount(1);
  };

  const event1 = () => {
    console.log('event1');
    setCount(0);
  };

  useEventListener(ref, 'click', count === 1 ? event1 : event2);
  return (
    <div>
      <div ref={ref}>hello</div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
