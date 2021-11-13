import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/message.module.css'
import { socket } from '@/config/web-sockets'


  

export default function Message({conversation}) {

  

  return (
    <div className={styles.main}>
       {conversation ?
        conversation.map((message, i) => {

          if(message.user === "CSR"){
            return(
              <div key={i}  className={styles.csrBox}>
                  <h5 className={styles.csrUser}>{message.user}</h5><h4 className={styles.csrText}>{message.text}</h4>
              </div>
            )
            
          }else{
            return (
              <div key={i}  className={styles.clientBox}>
                  <h4 className={styles.clientText}>{message.text}</h4><h5 className={styles.clientUser}>{message.user}</h5>
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
