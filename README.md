# stressmeter
Stressmeter uses a simple custom quiz engine that we created ourself.
## questions.json file
All of the questions are stored in the questions.json file. The questions.json file is where all of the questions, paths, answers, and actions.
###Format
the base question is the question that decided what set of questions(a path) that you will go on.
the basic format is
```
{
"base":{
"question":"which path would you like to go on?",
"answers":{
    "1":{
    "answer":"path one",
    "actions":[
    {"change-path":"1"}
    ]
    },
    "2":{
    "answer":"path two",
    "actions":[
    {"change-path":"2"}
    ]
    },
    
}
}
```
## actions
a table of actions

