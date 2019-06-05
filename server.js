const express=require('express')
const app=express()
const socketio=require('socket.io')
const http=require('http')
const path=require('path')
const server=http.createServer(app)
const io=socketio(server)
let usersockets={}
app.use('/',express.static('public_static'))
io.on('connection',(socket)=>{
    console.log("New socket formed from "+socket.id)
    socket.emit('connected')
    socket.on('login',(data)=>{//keeping user name with there id
        usersockets[data.user]=socket.id;
        console.log(usersockets)
     })
     socket.on('send_msg',(data)=>{
         console.log(data.message)
        if(data.value==1){//to send message to particular user if menstioned in msg
                   let recipient=data.recever
                   let recpsocket=usersockets[recipient]
                   io.to(recpsocket).emit('recv_msg',data)
        }
        else{
        socket.broadcast.emit('recv_msg',data)//broadcast to all user except self
        }
    })
})

server.listen(1234,()=>console.log("Server is available on http://localhost:1234 "))