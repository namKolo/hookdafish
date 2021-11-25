import * as React from 'react';
import * as ReactDOM from 'react-dom';

import VirtualList from './useVirtualList';
const App = () => {
  return <VirtualList />;
};

ReactDOM.render(<App />, document.getElementById('root'));
