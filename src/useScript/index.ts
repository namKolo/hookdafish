import { useEffect, useState } from 'react';

type LoadingStatus = 'idle' | 'loading' | 'ready' | 'error';
type ScriptElement = HTMLScriptElement | null;

const LOADING_STATUS_KEY = 'loading-status';

/**
 * Create a new script and append to document
 */
const createScript = (url: string): HTMLScriptElement => {
  let script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.setAttribute(LOADING_STATUS_KEY, 'loading');
  document.body.appendChild(script);

  const setAttributeFromEvent = (event: Event) => {
    script.setAttribute(
      LOADING_STATUS_KEY,
      event.type === 'load' ? 'ready' : 'error'
    );
  };

  script.addEventListener('load', setAttributeFromEvent);
  script.addEventListener('error', setAttributeFromEvent);
  return script;
};

function useScript(url: string): LoadingStatus {
  const [status, updateStatus] = useState<LoadingStatus>(
    url ? 'loading' : 'idle'
  );

  useEffect(() => {
    let script: ScriptElement = document.querySelector(`script[src="${url}"]`);
    if (!script) {
      script = createScript(url);
    } else {
      updateStatus(script.getAttribute(LOADING_STATUS_KEY) as LoadingStatus);
    }

    const setStateFromEvent = (event: Event) => {
      updateStatus(event.type === 'load' ? 'ready' : 'error');
    };

    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [url]);

  return status;
}

export default useScript;
