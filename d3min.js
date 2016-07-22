var d3 = {
  select: function(qs){
    var el = document.querySelector(qs)
    return {
      text: function(t){
        el.innerText = t
      },
      style: function(rule, value){
        el.style[rule] = value
      }
    }
  },
  foo: function(a){
    return 42 + a
  },
  unused: function(){
    console.log("NOPE")
  }
}





function instrument(obj){

  // create link to root origin

  var notifyQueue = []
  var notify = function(message){
    notifyQueue.push(message)
  }


  var instanceKey = Math.random().toString(32).substr(2)

  // TODO HARDCODE ON BUILD
  var origin = document.currentScript
      .src.replace(/\/d3min\.js$/,'')

  var transport_src = origin + '/_transport.html'

  var transport = document.createElement('iframe')
  transport.src = transport_src
  document.body.appendChild(transport)

  window.addEventListener('message', function(e) {
    if(e.origin == origin) {

      if(e.data == 'READY') {
        console.log('transport ready')
        notify = function(messsage) {
          transport.contentWindow.postMessage(messsage, origin)
        }

        notifyQueue.forEach(notify)
        notifyQueue = []
      }

    }
  })

  Object.keys(obj).forEach(function(prop){
    wrap(obj, prop)
  })

  function wrap(obj, prop) {
    var orig = obj[prop]
    obj[prop] = function(){
      console.log("log", prop)

      notify(prop)
      obj[prop] = orig
      return orig.apply(obj, arguments)
    }
  }

}


instrument(d3)
