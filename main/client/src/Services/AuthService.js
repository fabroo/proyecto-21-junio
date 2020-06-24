import axios from 'axios'
const ip = "192.168.0.109"

export default {
    login : user =>{
        return fetch('/user/login',{
            method : "post",
            body : JSON.stringify(user),
            headers : {
                'Content-Type' : 'application/json'
            }
        }).then(res => {
            if(res.status !== 401)
                return res.json().then(data => data);
            else
                return { isAuthenticated : false, user : {username : "",role : "", dni:"",mail:"",companyID:""},error:true};
        })
    },
    register : async user => {
        
        return await axios.put('http://'+ ip + ':5000/user/register',user)
        .then(res => res)
    },
    registerNew :async user =>{
        return await axios.post('http://'+ ip + ':5000/user/registerNew',user)
        .then(res => res)
    },
    logout : ()=>{
        return fetch('/user/logout')
                .then(res => res.json())
                .then(data => data);
    },
    getData : async (companyid)=>{
        //cambiar con la ip de tu casa
        return await axios.get('http://'+ ip + ':5000/user/users/'+ companyid)
        .then(res => res)
        
    },
    upload: async (data, user) =>{
        return await axios.post('http://'+ ip + ':5000/user/upload',data )
        .then(res => res)
        
    },
    removeUser : async (id)=>{
        //cambiar con la ip de tu casa
        return await axios.get('http://'+ ip + ':5000/user/delete/'+ id)
        .then(res => res)
        
    },
    isAuthenticated : ()=>{
        return fetch('/user/authenticated')
                .then(res=>{
                    if(res.status !== 401)
                        return res.json().then(data => data);
                    else
                        return { isAuthenticated : false, user : {username : "",role : "",dni:"",mail:"",companyid:""},error:true};
                });
    },  postPython: async (link) =>{
        //cambiar con la ip de tu casa
        return await axios.post('http://'+ ip + ':5000/python',link)
        .then(res => res)
    }

}