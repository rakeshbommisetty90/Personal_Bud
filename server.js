const express=require('express');
const app=express();
const port =3000;
const budget={
    myBudget:[
    {
        title:'Eat out',
        budget: 30
    },
    {
        title:'Rent',
        budget: 300
    },
    {
        title:'Groceries',
        budget: 120
    }
]
}
app.use('/',express.static('public'));

app.get('/h',(req,res)=>{
    res.send("Hello World");
});

app.get('/budget', (req,res)=>{
    res.json(budget);
})
app.listen(port,()=>{
    console.log(`This application is listening at this http://localhost:${port}`)
});