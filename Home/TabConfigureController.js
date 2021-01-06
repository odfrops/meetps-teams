var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {
    angular.element(document).ready(function () {
        var User = getCurrentUser()
        if (User == null) {
            Redirect("Login.html")
        }
        else {
            ValidateToken()
        }
    })

    function RedirectToMeetings() {
        Redirect("Meetings.html")
    }

    function ValidateToken() {
        var User = getCurrentUser()
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + User.Token
        }

        AngularServices.GET("meetings", headers).
            then(function (response) {
                switch (response.status) {
                    case 200:
                        RedirectToMeetings()
                        break
                    case 401:
                        AngularServices.RenewTokenOrLogout(RedirectToMeetings)
                        break
                    default:
                        // Redirect("Login.html")
                        break
                }
            })
    }
}]

app.controller("myCtrl", myCtrl)
