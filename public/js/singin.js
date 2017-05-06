$("#login-form").submit(function(e) {
    e.preventDefault();
    var login = $("[name='login-singin']").val();
    var password = $("[name='password-singin']").val();
    $("#alert-fale-singin").addClass("display-none");

    $.ajax({
        url: "/sessions/create",
        method: "POST",
        data: {
            "email": login,
            "password": password
        },
    }).then(function(res) {
        if (res.success) {
            return location.href = '/today.html'; 
        } else {
            $("#alert-fale-singin").removeClass("display-none");
        }

        // Handle response here
    });
});

$("#registration-form").submit(function(e) {
    $("#notMatchPass").addClass("display-none");
    $("#email-exist").addClass("display-none");
    e.preventDefault();
    var login = $("[name='login-registration']").val();
    var password = $("[name='password-registration2']").val();
    $("#alert-fale-singin").addClass("display-none");

    $.ajax({
        url: "/users/create",
        method: "POST",
        data: {
            "email": login,
            "password": password
        },
    }).then(function(res) {
        if (res.success) {
            return location.href = '/today.html';
        } else {
                $("#email-exist").removeClass("display-none");
        }

        // Handle response here
    });
});
$("[name='password-registration2']").change(function(){
    $("#notMatchPass").addClass("display-none");
    $("#email-exist").addClass("display-none");
    var passwordR2 = $("[name='password-registration2']").val();
    var passwordR1 = $("[name='password-registration1']").val();
    if(passwordR2 != passwordR1){
        $("#notMatchPass").removeClass("display-none");
    }
});
