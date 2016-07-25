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
  },
  version: '5.0.214'
}
