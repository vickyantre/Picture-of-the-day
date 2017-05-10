$("#singOut").click(function(e) {
    e.preventDefault();
    
    $.ajax({
        url: "/sessions/destroy",
        method: "POST"
    }).then(function() {
            return location.href = '/lending.html'; 
    });
});