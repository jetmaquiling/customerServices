import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/chat.module.css'
import { socket } from '@/config/web-sockets'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/styles'
import ChatMessage from './chatmessage'
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';

  function scrollToBottom (id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
 }


 
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return ca;
}



function randomNumber() {
    return Math.floor(Math.random() * 10000000) + 1;
}



export default function Chat() {
    const [first, setFirst] = React.useState(true)
    const [open, setOpen] = React.useState(false)
    const [messages, setMessages] =  React.useState([]);
    const [userData, setUserData] =  React.useState();
    const [message, setMessage] =  React.useState([]);
 
    function checkCookie() {
        let username = getCookie("userId")
        let room = getCookie("roomId")
        console.log(username)
        if (username[0] === "") {
            return
        } else {
            console.log("REQUESTIN MY DATA")
            socket.emit('join', { username, room, accounted: true}, (error) => {
                if(error) {
                    alert(error);
                } else {
                    setCookie("userId", username, 3)
                    setCookie("roomId", room, 3)
                    setFirst(false);
                }
            }); 
            
        }
    }
    

    const handleChange = (e) => {
        setMessage(e.target.value);
      }
      
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleClick()
        }
    }


    const handleClick = (e) => {
        console.log(message)
        if(message) {
            
            socket.emit('sendMessage',{ userData, message, messages }, (error) => {
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

    const toggle =  function() {
        setOpen(!open)
    }


    React.useEffect(() => {
        checkCookie()
        socket.on('welcome', (data) => {
            console.log("effect",data)
            setUserData(data);
            if(typeof data.conversation.messages == "string"){
                setMessages(JSON.parse(data.conversation.messages))
            }else{
                setMessages(data.conversation.messages)
            }
           
            scrollToBottom("userMessageBox")
        });
        
        socket.on('deliverClientMessages', (message, error) => {

            setMessages(msgs => [ ...msgs, message ]);
            scrollToBottom("userMessageBox")
        });

        socket.on('resetCookies', (error) => {
            console.log("RESETTING COOKIE")
            setFirst(true)
        });
     

      

    }, [])



    const handleStart = (e) => {
        const service =  e.target.innerText
        const username = `user_${randomNumber()}`
        const room = `room_${randomNumber()}`
        console.log(service,username,room)

        socket.emit('join', { username, room, service }, (error) => {
            if(error) {
                setError(error)
                alert(error);
            } else {
                setCookie("userId", username, 3)
                setCookie("roomId", room, 3)
                setFirst(false);
                socket.on('welcome', (data) => {
                    console.log("conve",data)
                    setUserData(data);
                    setMessages(JSON.parse(data.conversation.messages))
                });
            }
        }); 
    }
    


  return (
    <div className={styles.main}>
    
        <div className={open && !first ? styles.container : styles.offcontainer}>
            <div className={styles.head}>
                <h4 className={styles.label1}>Customer Service Representative</h4>
                <div className={styles.label2} onClick={toggle}><CloseIcon/></div>
            </div>
        
            <div className={styles.messageBox} id="userMessageBox">
                <ChatMessage conversation={messages} setFirst={setFirst}/>
            </div>


            <div className={styles.inputBox}>
                <TextField
                id="outlined-multiline-static"
                placeholder="Aa..."
                multiline
                variant="outlined"
                value={message}
                onKeyPress={handleEnter}
                onChange={handleChange}
                />
                <h4 className={styles.sendButton} onClick={handleClick} > <SendIcon style={{fontSize: '20px', color: '#1877F2'}}/></h4>
            </div>
                
        </div>

        <div className={open && first ? styles.container : styles.offcontainer}>
            <div className={styles.head}>
                <h4 className={styles.label1}>What can we help you with?</h4>
                <div className={styles.label2} onClick={toggle}><CloseIcon/></div>
            </div>
                
            <div className={styles.services}>
                <div className={styles.questionContainer}>
                    <button className={styles.question} onClick={handleStart}>
                        What is This?
                    </button>
                    <button className={styles.question} onClick={handleStart}>
                        What is That?
                    </button>
                    <button className={styles.question} onClick={handleStart}>
                        How to do that?
                    </button>
                    <button className={styles.question} onClick={handleStart}>
                        Where to do this and that with a some of that?
                    </button>

                    <button className={styles.question} onClick={handleStart}>
                        Where to do this and that with a some of that?
                    </button>
                    <button className={styles.question} onClick={handleStart}>
                        Can I order this?
                    </button>
                    <button className={styles.question} onClick={handleStart}>
                        How Much is This?
                    </button>
                    <button className={styles.question} onClick={handleStart}>
                        How to return that?
                    </button>
                    <button className={styles.question} onClick={handleStart}>
                        How Much are you giving me here?
                    </button>
                </div>
                
            </div>                
        </div>



        <div className={open ? styles.closeFloatButton : styles.floatButton} onClick={toggle}>
            Message
        </div>


       
    </div>
  )
}
