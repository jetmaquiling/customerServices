import React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/table.module.css'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import moment from 'moment';
import { socket } from '@/config/web-sockets';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  label:{
    fontSize: "18px",
    fontWeight: 600
  }
});

function createData(status,clientId, date, service, roomId, data) {
  return {status,clientId, date, service, roomId , data};
}

function statusProcess(status){
  switch(status) {
    case "ONLINE":
      return "#008000"
      break;
    case "OFFLINE":
      return "#DC143C"
      break;
    case "PROCESSING":
      return "#FFA500"
      break;
    default:
      return "#DC143C"
      break;
  }
}







const rows = [
  createData("#008000",'User_1203912', "a minute ago", "Track Order",  'Room_533433912'),
  createData("#FFA500",'User_1238921', "1 hour ago" , "Transaction Trouble",   'Room_412023212'),
  createData("#008000",'User_5673434', "5 hours ago", "Report Product", 'Room_223203912'),
  createData("#DC143C",'User_8695656', "20 hours ago",  "Report Merchant",   'Room_212323912'),
  createData('#DC143C','User_2342433', "3 days ago",  "Others",  'Room_780123232'),
];



export default function MainTable({user, setConnection, connection}) {
  const [ data, setData] = React.useState([]);
  const [connect, setConnect] = React.useState();
  const classes = useStyles();


  function openConnection(id,data){

    setConnect(id)
    if(window.confirm("START CONNECTION")){
      setConnection(data)
    }else{
      return
    }
  }


  function deleteUser(username){

    if(window.confirm(`Are you sure you want to delete ${username} permanently?`)){
      if(connect === username){
        setConnection(null)
      }
      socket.emit('deleteUser',{username: username});
      
    }
  }


  React.useEffect(() => {
    setData([])
    user.reverse().map((d) => {
      setData(former => [...former, createData(statusProcess(d.status), d.username, moment(d.created_at).fromNow() , d.service, d.room, d) ]);
    })

    
  }, [user,connect])

  return (
    <div className={styles.main}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={classes.label} align="center">Open</TableCell>
                <TableCell className={classes.label} align="center">Status</TableCell>
                <TableCell className={classes.label} align="center">Client ID</TableCell>
                <TableCell className={classes.label} align="center">Created At</TableCell>
                <TableCell className={classes.label} align="center">Service</TableCell>
                <TableCell className={classes.label} align="center">RoomID</TableCell>
                <TableCell className={classes.label} align="center">Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.clientId}>
                  <TableCell align="center"><OpenInNewIcon onClick={()=> openConnection(row.clientId,row.data)} /></TableCell>
                  <TableCell align="center" ><FiberManualRecordIcon style={{ color: row.status }}/></TableCell>
                  <TableCell align="center" >{row.clientId}
                  </TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                  <TableCell align="center">{row.service}</TableCell>
                  <TableCell align="center">{row.roomId}</TableCell>
                
                  <TableCell align="center"><DeleteIcon onClick={()=> deleteUser(row.clientId)}/></TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        

        
    </div>
  )
}
