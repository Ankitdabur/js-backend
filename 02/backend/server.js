import express from 'express'
const app = express()

const port = process.env.PORT || 3000

app.get('/api/jokes',(req , res) => {
    const jokes = [
    {  
        id : 1,
        title : 'a joke',
        content : 'this is a jooke'
    },
    {  
        id : 2,
        title : 'another joke',
        content : 'this is. another joke'
    },
    {  
        id : 3,
        title : 'third joke',
        content : 'this is third joke'
    },
    {  
        id : 4,
        title : 'fourth joke',
        content : "this is fourth joke",
    },
    {  
        id : 5,
        title : 'fifth joke',
        content : "this is fifth joke"
    },
    ]
    res.send(jokes)
})

app.listen(port,() => {
    console.log('server is listnenng')
})