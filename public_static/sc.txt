
const socket=io()
socket.on('connected',()=>{
    console.log("Connected to"+socket.id)
}) 

   function load(){
       
       var ftl=document.getElementById('f1').files[0]
       var fr=new FileReader()
       fr.onload=function(event){
          var  text=event.target.result
          document.getElementById('area').value=text
       }
       fr.readAsText(ftl,'urf-8')
      
   } 
   function comp(text,type){
    var Heap = function(fn) {
      this.fn = fn || function(e) {
        return e;
      };
      this.items = [];
    };
    
    Heap.prototype = {
      swap: function(i, j) {
        this.items[i] = [
          this.items[j],
          this.items[j] = this.items[i]
        ][0];
      },
      bubble: function(index) {
        var parent = ~~((index - 1) / 2);
        if (this.item(parent) < this.item(index)) {
          this.swap(index, parent);
          this.bubble(parent);
        }
      },
      item: function(index) {
        return this.fn(this.items[index]);
      },
      pop: function() {
        return this.items.pop();
      },
      sift: function(index, end) {
        var child = index * 2 + 1;
        if (child < end) {
          if (child + 1 < end && this.item(child + 1) > this.item(child)) {
            child++;
          }
          if (this.item(index) < this.item(child)) {
            this.swap(index, child);
            return this.sift(child, end);
          }
        }
      },
      push: function() {
        var lastIndex = this.items.length;
        for (var i = 0; i < arguments.length; i++) {
          this.items.push(arguments[i]);
          this.bubble(lastIndex++);
        }
      },
      get length() {
        return this.items.length;
      }
    };
    
    var Huffman = {
      encode: function(data) {
        var prob = {};
        var tree = new Heap(function(e) {
          return e[0];
        });
        for (var i = 0; i < data.length; i++) {
          if (prob.hasOwnProperty(data[i])) {
            prob[data[i]]++;
          } else {
            prob[data[i]] = 1;
          }
        }
        Object.keys(prob).sort(function(a, b) {
          return ~~(Math.random() * 2);
        }).forEach(function(e) {
          tree.push([prob[e], e]);
        });
        while (tree.length > 1) {
          var first = tree.pop(),
              second = tree.pop();
          tree.push([first[0] + second[0], [first[1], second[1]]]);
        }
        var dict = {};
        var recurse = function(root, string) {
          if (root.constructor === Array) {
            recurse(root[0], string + '0');
            recurse(root[1], string + '1');
          } else {
            dict[root] = string;
          }
        };
        tree.items = tree.pop()[1];
        recurse(tree.items, '');
        var result = '';
        for (var i = 0; i < data.length; i++) {
          result += dict[data.charAt(i)];
        }
        var header = Object.keys(dict).map(function(e) {
          return e.charCodeAt(0) + '|' + dict[e];
        }).join('-') + '/';
        return header + result;
      },
      decode: function(string) {
        string = string.split('/');
        var data = string[1].split(''),
            header = {};
        string[0].split('-').forEach(function(e) {
          var values = e.split('|');
          header[values[1]] = String.fromCharCode(values[0]);
        });
        var result = '';
        while (data.length) {
          var i = 0,
              cur = '';
          while (data.length) {
            cur += data.shift();
            if (header.hasOwnProperty(cur)) {
              result += header[cur];
              break;
            }
          }
        }
        return result;
      }
    };
   
    if(type){
    var enc = Huffman.encode(text);
    return enc
    }
    else{
    var dec = Huffman.decode(text);
    return dec
    }
    
    
   }
   function create(msg){
    var objUrl=null;
    function exportFile(msg,downlink){
      if(objUrl!=null){
        window.URL.revokeObjectURL(objUrl);
      }
      var data=new Blob([msg],{type:'text/plain'});
      objUrl=window.URL.createObjectURL(data)
      btn=document.getElementById(downlink)
      btn.href=objUrl;
    }
    exportFile(msg,'a_btn')

  }
$(function(){
    let btn=$('#btn')
    let txtarea=$('#area')
    let loginbox=$('#loginbox')
    let user=""
    let loginbtn=$('#login')
    let logindiv=$('#login-div')
    let recvname=$('#recvname')
     loginbtn.click(function(){
        user=loginbox.val()
        $('#file_send').show()
        logindiv.hide()
        socket.emit('login',{
            user:user
        })
    })
    btn.click(function(){
     load()
    var text=txtarea.val()
name=recvname.val()
    // console.log(text)
     var textcmp=comp(text,1)
        socket.emit('send_msg',{
            user:user,
            message:textcmp,
        recever:name,
        value:1})
    })
    socket.on('recv_msg',function(data){
    //    console.log(data.user+" "+data.message)
        var msg=comp(data.message,0)
        txtarea.text("Sent by: "+data.user+"=>"+msg)
        $('#a_btn').click(
          create(msg)
        )
        })
    })

   