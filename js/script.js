    /* global $ */
    "use strict";
    var questions = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "questions.json",
            'dataType': "json",
            'success': function(data) {
                json = data;
            }
        });
        return json;
    })();

    var points = 0;
    var path = 0;
    var advice = "";
    var quizvars = {};
    function getMainAdviceFromPoints(points, path) {
        // calculate percentage
        var tottal; // tottal points
        switch(path) {
            case 1:
                tottal = 20;//TODO: update tottals based on path
                break;
            case 2:
                tottal = 20;//TODO: update tottals based on path
                break;
            case 3:
                tottal = 20;//TODO: update tottals based on path
                break;
            case 4:
                tottal = 20;//TODO: update tottals based on path
                break;
        }
        var percentage = points / tottal;
        if (percentage > 10) {
            // extremly low risk
        } else if (percentage >= 10 && percentage < 20) {
            // very low risk
        }  else if (percentage >= 20 && percentage < 30) {
            // low risk
        }  else if (percentage >= 30 && percentage < 40) {
            // relatively low risk
        }  else if (percentage >= 40 && percentage < 50) {
            // slightly low  risk
        }  else if (percentage >= 50 && percentage < 60) {
            // medium risk
        }  else if (percentage >= 60 && percentage < 70) {
            // slightly high risk
        }  else if (percentage >= 70 && percentage < 80) {
            // high risk
        } else if (percentage >= 90) {
            // very high risk
        }
        
    }
    function endQuiz() {
        // end the quiz
        $("#question").html("Thank you for taking this quiz. We hope this helps your stress.");
        $("#quiz").remove();
        $("#advice").html(advice);
        $("#main").html(getMainAdviceFromPoints(points, path)[0]);
        $("#main-text").html(getMainAdviceFromPoints(points, path)[0]);
        $("#results").removeClass("hidden");
    }

    function runActions(actionList) {
        console.log(actionList.length);
        for (var i = 0; i < actionList.length; i++) {
            var currentAction = actionList[i]; // returns something like {"add points":"7"}
            console.log(currentAction);
            console.log(Object.keys(currentAction)[0]);
            if (Object.keys(currentAction)[0] === "change-path") {
                path = currentAction[Object.keys(currentAction)[0]];
            }
            else if (Object.keys(currentAction)[0] === "add-points") {
                points += currentAction[Object.keys(currentAction)[0]];
            }
            else if (Object.keys(currentAction)[0] === "remove-points") {
                points -= currentAction[Object.keys(currentAction)[0]];
            }
            else if (Object.keys(currentAction)[0] === "add-advice") {
                advice += currentAction[Object.keys(currentAction)[0]] + "\n";
            }
            else if (Object.keys(currentAction)[0] === "end-quiz") {
                endQuiz();
            }
            else if (Object.keys(currentAction)[0] === "create-var") {
                console.log(currentAction["create-var"].name);
                console.log(currentAction["create-var"].value);
                quizvars[currentAction["create-var"].name] = currentAction["create-var"].value;
            }
            else {
                console.log("unknown action: " + Object.keys(currentAction)[0]);
            }
        }
    }
    //console.log(questions);
    function addAnswer(num, ansNum, path) {
        //console.log(num);
        //console.log(ansNum);
        var text;
        if (num === "base") {
            text = questions[num].answers[ansNum].answer;
        }
        else {
            text = questions.paths[String(path)][num].answers[ansNum].answer;
        }
        var template = '<label class="btn btn-lg btn-primary btn-block"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span><input type="radio" name="q_answer" value="' + ansNum + '">' + text + '</label>';
        $("#quiz").append(template);

    }

    function changeQuestion(number, path) {

        $("#quiz").html("");
        $("#qid").html(String(number + 1));

        var num;
        if (number === 0) {
            $("#qid").removeClass("hidden");
            num = "base";
        }
        else {

            num = String(number);
        }
        var question;
        if (num === "base" || num === "-1") {
            question = questions[num].question;
        }
        else {
            //console.log(num);
            question = questions.paths[String(path)][num].question;
        }
        if (question === "end-quiz") {
            endQuiz();
        }
        if (question.indexOf("{{") > -1 && question.indexOf("}}") > -1) {
            console.log(question.substring(question.indexOf("{{") + 2, question.indexOf("}}")));
            console.log(quizvars[question.substring(question.indexOf("{{") + 2, question.indexOf("}}"))]);
            question = question.substring(0, question.indexOf("{{")) + // before variable
            quizvars[question.substring(question.indexOf("{{") + 2, question.indexOf("}}"))] + // variable name
            question.substring(question.indexOf("}}") + 2); // after variable
        }
        $("#question").html(question);
        var numOfAnswers;
        if (num === "base" || num === "-1") {
            numOfAnswers = questions[num].answers.entries;
        }
        else {
            //console.log(num);
            numOfAnswers = questions.paths[String(path)][num].answers.entries;
        }

        for (var i = 0; i < numOfAnswers; i++) {
            addAnswer(num, i + 1, String(path));
        }

        $('#quiz').fadeOut;
        $("#quiz").show();
        $("label.btn").click(buttonclick);

    }
    var qNumber = -1; // -1 is start secren, 0 is base, 1+ is normal.


    var buttonclick = function() {
        var choice = $(this).find('input:radio').val();
        //console.log(choice);
        //console.log(qNumber);
        //console.log(path);
        var num;
        if (qNumber === 0) {
            $("#qid").removeClass("hidden");
            num = "base";
        }
        else {
            $("#qid").html(String(qNumber));
            num = String(qNumber);
        }
        if (num === "base") {
            if (questions.base.answers[choice].action) {
                runActions(questions.base.answers[choice].action);
            }
        }
        else if (num === "-1") {
            // do nothing
        }
        else {

            if (questions.paths[String(path)][num].answers[choice].action) {
                runActions(questions.base.answers[choice].action);
            }
        }
        //console.log(path);
        //console.log(points);
        qNumber = qNumber + 1;
        // console.log(qNumber);
        changeQuestion(qNumber, path);
    };
    $("label.btn").click(buttonclick);

