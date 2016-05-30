/* global $ */
var questions = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "questions.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 
var points = 0;
var path = 0;
console.log(questions);
function addAnswer(num, ansNum, path) {
    console.log(num);
    console.log(ansNum);
    var text;
    if (path < 1) {
        text = questions[num].answers[ansNum].answer;
    } else {
        text = questions.paths[path][num].answers[ansNum].answer;   
    }
    var template = '<label class="btn btn-lg btn-primary btn-block"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span><input type="radio" name="q_answer" value="' + ansNum + '">' + text + '</label>';
    $("#quiz").append(template);
    
}
function changeQuestion(number, path) {

    $("#quiz").html("");
    
    var num;
    if (number === 1) {
        $("#qid").removeClass("hidden");
        num = "base";
    } else {
        $("#qid").html(String(number));
        num = String(number);
    }
    var numOfAnswers = questions[num].answers.entries;
    for (var i = 0; i < numOfAnswers; i ++) {
        addAnswer(num, i + 1, String(path));
    }
    
    $('#quiz').fadeOut;
    $("#quiz").show();
    $("label.btn").click(buttonclick);

}
var qNumber = 0; // 0 is start secren

$("label.btn").click(buttonclick);

var buttonclick = function() {
    var choice = $(this).find('input:radio').val();
    // console.log(choice);
    // console.log(qNumber);
    var num;
    if (qNumber === 1) {
        $("#qid").removeClass("hidden");
        num = "base";
    } else {
        $("#qid").html(String(qNumber));
        num = String(qNumber);
    }
    if (questions[num].answers[String(choice)].action) {
        eval(questions[num].answers[String(choice)].action);
    }
    console.log(path);
    console.log(points)
    qNumber = qNumber + 1;
    // console.log(qNumber);
    changeQuestion(qNumber, path);
};