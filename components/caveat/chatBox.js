import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/chatbox.module.css'
import { socket } from '@/config/web-sockets'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Icon from '@material-ui/core/Icon';
import Message from './message'

const useStyles = makeStyles((theme) => ({
    root: {
      width: '80%',
      backgroundColor: '#fff',
      margin:  '0px 10px'
    },
   


  }));

  function scrollToBottom (id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
 }


export default function ChatBox({connection, setConnection}) {
    const [messages, setMessages] =  React.useState([]);
    const [message, setMessage] =  React.useState([]);
    const classes = useStyles();


    const handleChange = (e) => {
      setMessage(e.target.value);
    }

    const handleEnter = (e) => {
     
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage(message)
      }
      
    }

    
    const handleClick = (e) => {
      sendMessage(message);
    }


    const sendMessage = (message) => {
      console.log(message)
      if(message && connection.conversation.id) {
          socket.emit('adminMessage',{ userId: connection.id,conversationId: connection.conversation.id , room: connection.room, message, messages }, (error) => {
              if(error) {
                  alert(error)
                  history.push('/join');
              }
          });
          
          setMessage('')
      } else {
          alert("Message can't be empty")
      }
}


  React.useEffect(() => {
    if(connection){
      socket.emit('getConversation',{connection}, (data) => { 

      });
    }
        
      // if(true) {
      //     setMessages(JSON.parse(connection.conversation.messages))    
      //     socket.on('message', (newmessage, error) => {
      //         setMessages(msgs => [ ...msgs, newmessage ]);
      //     });
      // } 
      
   }, [connection])


   const offConnection = () => {
      setConnection(false)
      console.log(connection)
  }

   React.useEffect(() => {
      socket.on('deliverAdminMessages', (data) => {
        console.log("Get Delivery from Server" , data)
        try{
          if(typeof data.conversation.messages == "string"){
            setMessages(JSON.parse(data.conversation.messages))
          }else{
              setMessages(data.conversation.messages)
          }
          scrollToBottom("messageBox")
          socket.removeAllListeners("details");
        }catch(err){console.log(err)}
        
      });
    
    }, [])
  

  return (
    <div className={styles.main}>
        <div className={styles.head}>
            <h1 className={styles.title}>CHAT BOX</h1>
            <h1 className={styles.title} onClick={offConnection}>X</h1>
        </div>

        <div className={styles.messageBox} id="messageBox">
            <Message conversation={messages}/>
        </div>

        <div className={styles.inputBox}>
            <TextField
            id="outlined-multiline-static"
            multiline
            variant="outlined"
            className={classes.root}
            value={message}
            
            onKeyPress={handleEnter}
            onChange={handleChange}
            />
            <h4 className={styles.sendButton} onClick={handleClick} >Send</h4>
        </div>
        
    </div>
  )
}
