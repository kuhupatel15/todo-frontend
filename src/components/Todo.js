import React, { useState, useEffect, useRef } from 'react'
import '../index.css'
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
const Todo = () => {
  const [item, setItem] = useState({ title: "", description: "" })
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(false)
  const [title,setTitle]=useState(data.title);
  var [id,setId]=useState(null);
  const [description,setDescription]=useState(data.description);
  const formRef = useRef()
  const handleSubmit = async (e) => {
    e.preventDefault()
    formRef.current.reset();
    let headersList = {
      "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify({
      "title": item.title,
      "description": item.description
    });

    let response = await fetch("https://mern-todo-backend-z7mz.onrender.com/todo", {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });

    let data = await response.json();
    console.log(data);
    formRef.current.reset();
    getTodo()

  }
  useEffect(() => {
    getTodo();
  }, [])
  const deleteItem = async (id) => {
    let headersList = {
      "Accept": "*/*",
      // "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    }

    let response = await fetch(`https://mern-todo-backend-z7mz.onrender.com/todo/${id}`, {
      method: "DELETE",
      headers: headersList
    });

    let data = await response.json();
    console.log(data);
    setData(prevData => prevData.filter(item => item._id !== id))

  }

  const getTodo = async () => {
    let headersList = {
      "Content-Type": "application/json"
    }

    let response = await fetch("https://mern-todo-backend-z7mz.onrender.com/todo", {
      method: "GET",
      headers: headersList
    });

    let data = await response.json();
    console.log(data);
    setData(data.data);

  }
  const handleUpdate =async (e)=>{
    e.preventDefault();
    
    // console.log(title);
    // console.log(description);
    let headersList = {
      "Content-Type": "application/json"
    }

    let bodyContent = JSON.stringify({
      
      "title": title,
      "description": description,
      "id":id
    });
    console.log(bodyContent)
    let response = await fetch("https://mern-todo-backend-z7mz.onrender.com/todo/update", {
      method: "PUT",
      body: bodyContent,
      headers: headersList
    });
    
    let data = await response.json();
    console.log(data);
    
    setEdit(false)
    getTodo();

  }
  useEffect(() => {
    getTodo()
  }, [])

  return (
    <div className='main'>

      <form className='form' ref={formRef} onSubmit={handleSubmit}>


        <TextField id="standard-basic" label="Title" variant="standard" onChange={(e) => { setItem({ ...item, title: e.target.value }) }} />


        <TextField id="standard-basic" label="Description" variant="standard" onChange={(e) => { setItem({ ...item, description: e.target.value }) }} />

        <Button style={{backgroundColor:"black",height:"6vh"}} type='submit' variant="contained">Add</Button>
      </form>
      <div className='card'>

        {
          data.map(item => {
            return (
              <div className='item' key={item._id} >
                   <form onSubmit={handleUpdate} style={{display:"flex",gap:"4vw",alignItems:"center"}} >
                <div style={{ display: "flex", flexDirection: "column" }}>
               
                  <div className='edit' contentEditable={id===item._id} inputMode='text' onInput={(e) => setTitle( e.currentTarget.textContent )}><span style={{ fontWeight: "600", fontSize: "18px" }}>{item.title}</span>
                   

                  </div>
                  <div className='edit' contentEditable={id===item._id} inputMode='text' onInput={(e) => setDescription(e.currentTarget.textContent )}><span style={{ fontWeight: "400", fontSize: "15px" }}>{item.description}</span></div>
                  
                  
                </div>
                
                {(id===item._id&&edit) && <button type='submit' style={{borderRadius:"5px",backgroundColor:"black",color:"white",border:"none",padding:"1vw",height:"5vh",display:"flex",alignItems:"center"}} >Save</button>}
                </form>
                <div className='icons'><BiEdit onClick={() => {setEdit(!edit);setId(item._id)}} /><MdDelete onClick={() => { deleteItem(item._id) }} /></div>

              </div>
            )
          })
        }

      </div>


    </div>
  )
}

export default Todo