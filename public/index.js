localStorage.setItem("counter", 0);


function login() {

    //console.log("ABCD");

    var username = document.getElementById("usernameLog").value;
    var password = document.getElementById("passwordLog").value;

    var user = {
        username,
        password
    }

    $.ajax( {
        url: 'http://localhost:3000/index/' + username,
        type: 'POST',
        data: user,
        success: function(data) {

            //console.log(data);
            var wrong = document.getElementById("wrongPassword");

            if(data == '0') {
                
                wrong.setAttribute("style", "display: inline;");

                nr = parseInt(localStorage.getItem("counter"));
                nr += 1;
                console.log(nr);
                localStorage.setItem("counter", nr);

                wrong.innerHTML = "wrong password! " + (5 - nr) + " more possible attempts.";


                if(nr >= 5) {
                    
                    document.getElementById("enter").disabled = true;
                    setTimeout(function(){document.getElementById("enter").disabled = false;},5000);
                    localStorage.setItem("counter", 0);

                    wrong.innerHTML = "";

                }

                }
            else {
                //console.log("1234");
                localStorage.setItem("counter", 0);

                wrong.setAttribute("style", "display: none;");

                window.open('chat/' + data);
            }
        },
        error: function(error) {
            console.log(error);

      }
    });
}


function saveUser() {

    //console.log("ana are mere")

    var prenume = document.getElementById("prenume").value;
    var nume = document.getElementById("nume").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var user = {
        prenume,
        nume,
        username,
        password
    }

    $.ajax({
        url: 'http://localhost:3000/register',
        type: 'POST',
        data: user,
        success: function(data) {
            console.log("user inserat")
            window.open('http://localhost:3000/index')
        },
        error: function(error) {
            console.log(error);
        }
    });
}
