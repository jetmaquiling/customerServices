import React from 'react'
import MainTable from '@/components/caveat/table'
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { socket } from '@/config/web-sockets';
import ChatBox from '@/components/caveat/chatBox'
import Chat from '@/components/chatFloat/chat'


export default function Float() {
  


  return (
    <div className={styles.main}>

        <Chat/>
        
    </div>
  )
}
