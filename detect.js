(function instrument(obj){

  // create link to root origin

  var notifyQueue = []
  var notify = function(message){
    notifyQueue.push(message)
  }


  var instanceKey = Math.random().toString(32).substr(2)

  // TODO HARDCODE ON BUILD
  var origin = document.currentScript
      .src.replace(/\/detect\.js$/,'')

  var transport_src = origin + '/_transport.html'

  var transport = document.createElement('iframe')
  transport.src = transport_src
  transport.style.display = 'none'
  document.body.appendChild(transport)

  window.addEventListener('message', function(e) {
    if(e.origin == origin) {

      if(e.data == 'READY') {
        notify = function(messsage) {
          transport.contentWindow.postMessage(messsage, origin)
        }

        notifyQueue.forEach(notify)
        notifyQueue = []
      }

    }
  })

  var state = {
    page: document.location.href,
    version: d3.version,
    modules: {}
  }

  var keys = Object.keys(obj)
  .filter(function(k){
    return isFunction(obj[k])
  })

  keys.forEach(function(prop){
    wrap(obj, prop)
    state.modules[prop] = false
  })

  notify(state)

  function wrap(obj, prop) {
    var orig = obj[prop]
    obj[prop] = function __instrumented__() {
      state.modules[prop] = true
      notify(state)
      obj[prop] = orig
      return orig.apply(obj, arguments)
    }
  }

  function isFunction(functionToCheck) {
   var getType = {};
   return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

})(d3)
