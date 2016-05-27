/* global $ */
var questions;
$.getJSON("questions.json", function(data){window.questions = data;});
console.log(questions);
function changeQuestion(number) {
    
}
var qNumber = 1;
var loading = $('#loadbar').hide();
$(document)
    .ajaxStart(function() {
        loading.show();
    }).ajaxStop(function() {
        loading.hide();
    });

$("label.btn").on('click', function() {
    var choice = $(this).find('input:radio').val();
    $('#quiz').fadeOut();
    console.log(choice);
    changeQuestion(qNumber);
    qNumber += 1;
    $('#quiz').show();


});

