
const socket=io()
socket.on('connected',()=>{
    console.log("Connected to"+socket.id)
}) 
function getval(radios){//to get radio button value
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
        // do whatever you want with the checked radio
        return radios[i].value
              // only one radio can be logically checked, don't check the rest
    }
}
}
   function create(msg){//to convert received data to downloadlink
     var objUrl=null;
     function exportFile(msg,downlink){
       if(objUrl!=null){
         window.URL.revokeObjectURL(objUrl);
       }   if(getval(document.getElementsByName('sendtype'))=="image"){
       var message=new Uint8Array(msg)
       var data=new Blob([message.buffer]);
       }else{
         var data=new Blob([msg],{type:'text/plain'});
       }
       objUrl=window.URL.createObjectURL(data)
       btn=document.getElementById(downlink)
       btn.href=objUrl;
     }
     exportFile(msg,'a_btn')

   }
$(function(){
    var btn=$('#btn')
    var txtarea=$('#area')
    var loginbox=$('#loginbox')
    var user=""
    var loginbtn=$('#login')
    var logindiv=$('#login-div')
    var recvname=$('#recvname')
     loginbtn.click(function(){
        user=loginbox.val()
        $('#file_send').show()
        logindiv.hide()
        socket.emit('login',{
            user:user
        })
    })
    btn.click(function(){
      var radios = document.getElementsByName('sendtype');
      var rvalue=getval(radios)
          name=recvname.val()
    var ftl=document.getElementById('f1').files[0]
       var fr=new FileReader()
       fr.onload=function(event){
          var  text=event.target.result
          socket.emit('send_msg',{
            user:user,
            message:text,
        recever:name,
        value:1})
       }
       if(rvalue=="image"){
         console.log("hi ")
       fr.readAsArrayBuffer(ftl)
       }
       else{
         fr.readAsText(ftl,'utf-8')
       }
    })
    socket.on('recv_msg',function(data){
        txtarea.text("Sent by: "+data.user+"=>"+data.message)
        $('#a_btn').click(
        create(data.message)
        )
        })
    })

   