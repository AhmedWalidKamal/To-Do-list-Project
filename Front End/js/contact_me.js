/*$(function() {

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            alert("failed to submit");
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#myname").val();
            alert(name);
            var email = $("input#myEmail").val();
            alert(email);
            var password = $("input#myPassword").val();
            alert(password);
            
            var arrays = {
              'name': name,
              'email': email,
              'password': password
             }
             alert("ok arrays");
            $.ajax({
                url: "http://127.0.0.1:8081/register",
                type: "POST",
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(arrays),
                error: function() {
                    $('#contactForm').trigger("reset");
                }
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

*/
/*When clicking on Full hide fail/success boxes 
$('#name').focus(function() {
    $('#success').html('');
});
*/