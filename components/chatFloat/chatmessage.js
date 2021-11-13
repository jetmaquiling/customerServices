import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/chatmessage.module.css'
import { socket } from '@/config/web-sockets'


  

export default function ChatMessage({conversation, setFirst}) {

  

  return (
    <div className={styles.main}>
      
       {conversation ?
        conversation.map((message, i) => {
          if(message.user === "DELETE"){
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            setFirst(true)
            return(     
                  <h5 className={styles.endText}>This Chat has Ended.</h5>
            )
          }
          if(message.user === "CSR"){
            return(
                <div key={i}  className={styles.clientBox}>
                <h4 className={styles.clientText}>{message.text}</h4>
                </div>
            )
          }else{
            return (
            <div key={i}  className={styles.csrBox}>
            <h4 className={styles.csrText}>{message.text}</h4>
            </div>
            )
          }
         
        }
        ):
        <h5 className={styles.endText}>No Conversation</h5>
    }
        
    </div>
  )
}
