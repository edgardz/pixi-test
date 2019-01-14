let alreadyTested = false;
let passiveSupported = false;

function isSupported() {
  if (alreadyTested) {
    return passiveSupported;
  } else {
    alreadyTested = true;

    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          passiveSupported = true;
        }
      });
      window.addEventListener('test', null, opts);
    } catch (e) {
      return passiveSupported;
    }
    return passiveSupported;
  }
}

function usePassiveEvent() {
  return isSupported() ? { passive: true } : false;
}

export default usePassiveEvent;
