const express=require('express');
const app=express();
const port =3000;
const budget=require('./budget.json');
app.use('/',express.static('public'));

app.get('/h',(req,res)=>{
    res.send("Hello World");
});

app.get('/budget', (req,res)=>{
    res.send(budget);
})
app.listen(port,()=>{
    console.log(`This application is listening at this http://localhost:${port}`)
});