const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req,res) => {
    res.send('Hello Routes!!!');
});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.post('/api/courses', (req,res)=>{
    //validation
    const {error} = validateCourse(req.body);// equiv to getting result.error

    if(/*result.error ==> cos we destructured we have*/error)        //400 bad request
        return res.status(400).send(error.details[0].message);
        
    

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req,res)=>{
    //look up the course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given id was not found');

    //validate
    //const result = validateCourse(req.body);
    //using object destructuring
    const {error} = validateCourse(req.body);// equiv to getting result.errr

    if(/*result.error ==> cos we destructured we have*/error)
        //400 bad request
       return res.status(400).send(error.details[0].message);
        
    
    //update course

    course.name = req.body.name;
    res.send(course);
    //return the updated course
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

app.delete('/api/courses/:id', (req,res)=>{
    //lookup the course
    //returnn 404 not existing
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given id not found');

    //delete
    const index = courses.indexOf(course);
    courses.splice(index,1);

    //return the same course
    res.send(course);
});


app.get('/api/courses/:id', (req,res)=>{
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('The course with the given id not found');
  res.send(course);
    //res.send(/*to read the parameter*/req.params.id);
});

/**
 * HINT:
 */
/*app.get('/api/posts/:year/:month', (req,res)=>{
    //we use "req.params" when dealing with request parameters
    //we use "req.query" when dealing with query parameters
    res.send(req.params);
});*/

//using an environment variable to get a port number
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}....`);
})