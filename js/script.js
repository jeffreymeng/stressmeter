/* global jquery $ */

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
    // get answers

    $('#quiz').show();


});

var answer = 3;

function check(ck) {
    if (ck != answer)
        return 'INCORRECT';
    else
        return 'CORRECT';
};
