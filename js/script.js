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
console.log(questions);
function addAnswer(num, ansNum) {
    console.log(num);
    console.log(ansNum);
    var text = questions[num].answers[ansNum].answer;
    var template = '<label class="btn btn-lg btn-primary btn-block"><span class="btn-label"><i class="glyphicon glyphicon-chevron-right"></i></span><input type="radio" name="q_answer" value="' + ansNum + '">' + text + '</label>';
    $("#quiz").append(template);
    
}
function changeQuestion(number) {
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
        addAnswer(num, i + 1);
    }
}
var qNumber = 0; // 0 is start secren

$("label.btn").on('click', function() {
    var choice = $(this).find('input:radio').val();
    $('#quiz').fadeOut();
    console.log(choice);
    console.log(qNumber);
    qNumber = qNumber + 1;
    console.log(qNumber);
    changeQuestion(qNumber);
    
    $('#quiz').show();


});

