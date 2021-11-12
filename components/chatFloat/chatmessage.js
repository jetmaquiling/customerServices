import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/chatmessage.module.css'
import { socket } from '@/config/web-sockets'


  

export default function ChatMessage({conversation}) {

  

  return (
    <div className={styles.main}>
      
       {
        conversation.map((message, i) => {
          if(message.user === "DELETE"){
            document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
            return(     
                  <h5 className={styles.endText}>This Chat has Ended.</h5>
            )
          }
          if(message.user === "CSR"){
            return(
                <div key={i}  className={styles.clientBox}>
                <h4 className={styles.clientText}>{message.text}</h4><h5 className={styles.clientUser}>{message.user}</h5>
                </div>
            )
          }else{
            return (
            <div key={i}  className={styles.csrBox}>
            <h5 className={styles.csrUser}>{message.user}</h5><h4 className={styles.csrText}>{message.text}</h4>
            </div>
            )
          }
         
        }
        )
    }
        
    </div>
  )
}
