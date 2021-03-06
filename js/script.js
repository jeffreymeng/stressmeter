//(function() {
    /* global $ */
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

    var points = 0,
        path = 0,
        advice = "",
        quizvars = {};

    // console.log(questions);
    function endQuiz() {
        var maintext;
        var mainadvice;
        if (points < 0) {
            maintext = "You are not stressed";
            mainadvice = "Go away. Why did you take this test?";
        } else if (points === 0) {
            maintext = "You are not too stressed";
            mainadvice = "You might want to do some more recreational activities";
        } else if (points > 0 && points < 3) {
            maintext = "You are a little stressed";
            mainadvice = "You should do some more recreational activities";
        } else if (points >= 3 && points < 7) {
            maintext = "You mildly stressed";
            mainadvice = "You should do some more recreational activities, or do less homework.";
        } else if (points >= 7 && points < 11) {
            maintext = "You are quite stressed";
            mainadvice = "You should make sure to do some more recreational activities, or do less homework.";
        } else if (points >= 11) {
            maintext = "You are very stressed";
            mainadvice = "Go see a psychiatrist.";
        }
        $("#qid").hide();
        $("#question").css("color", "black");
        $("#question").html("Thank you for taking this quiz. We hope this helps your stress.");
        $("#quiz").hide();
        $("#main").html(maintext);
        $("#main-text-advice").html(mainadvice);
        $("#advice").html(advice);
        $("#result").removeClass("hidden");
    }

    function runActions(actionList) {
        var length = actionList.length;
        // console.log(actionList)
        var actionName;
        var actionValue;
        for (var i = 0; i < length; i++) {
            var action = actionList[i];
            // console.log(action)
            actionName = Object.keys(action)[0];
            actionValue = action[actionName];
            //console.log(actionName);
            //console.log(actionValue);
            if (actionName === "add-points") {
                points += parseInt(actionValue, 10);
            }
            else if (actionName === "add-advice") {
                advice = advice + "<li>" + actionValue + "</li>";
            }
            else if (actionName === "change-path") {
                path = actionValue;
            }
            else if (actionName === "subtract-points") {
                points -= parseInt(actionValue, 10);
            }
            else if (actionName === "create-var") {
                quizvars[actionValue.name] = actionValue.value;
            }
            else {
                //console.log("Unknown Action: '" + actionName + "' with a value of '" + actionValue + "'.")
            }
        }

    }

    function addAnswer(num, ansNum, path) {
        //console.log(num);
        //console.log(ansNum);
        var text;
        if (num === "base") {
            text = questions.base.answers[ansNum].answer;
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

        if (question.indexOf("{{") > -1 && question.indexOf("}}") > -1) {
            //console.log(question.substring(question.indexOf("{{") + 2, question.indexOf("}}")));
            //console.log(quizvars[question.substring(question.indexOf("{{") + 2, question.indexOf("}}"))]);
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
        if (qNumber === -1) {
            $("#question").css("color", "blue");
        }
        var choice = $(this).find('input:radio').val();
        // console.log(choice);
        // console.log(qNumber);
        // console.log(path);
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
                runActions(questions.base.answers[String(choice)].action);
            }
        }
        else if (num === "-1") {
            // do nothing

        }
        else {
            //console.log(questions.base.answers[String(choice)].action);
            //console.log(questions.paths[String(path)][num].answers[choice].action);
            if (questions.paths[String(path)][num].answers[choice].action) {
                //console.log("(questions.paths[" + String(path) + "][" + num + "].answers[" + choice + "].action");
                //console.log(true);
                runActions(questions.paths[String(path)][num].answers[choice].action);
            }
        }
        //console.log(path);
        //console.log(points);
        qNumber = qNumber + 1;
        //console.log(qNumber);
        if (qNumber === 5) {
            endQuiz();
        }
        changeQuestion(qNumber, path);
    };
    $("label.btn").click(buttonclick);
//})();
