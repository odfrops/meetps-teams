var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    angular.element(document).ready(function () {
        $(".pointcur").css('cursor', 'pointer')

        GetMeetings()
    })

    $scope.Meetings = []

    $scope.GoToPolls = function (e, meetingId) {
        e.preventDefault()

        let url = GetRedirectURL("Polls.html?meetingId=" + meetingId)
        microsoftTeams.settings.setSettings({
            contentUrl: url,
            suggestedDisplayName: meetingId,
        })

        microsoftTeams.settings.setValidityState(true)
    }

    function GetMeetings() {
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
                        $scope.Meetings = response.data.result
                        if ($scope.Meetings.length == 0) {
                            document.getElementById("error").innerText = "No meetings have been created in this account."
                        }
                        break
                    case 401:
                        AngularServices.RenewTokenOrLogout(GetMeetings)
                        break
                    default:
                        // Redirect("Login.html")
                        break
                }
            })
    }
}]

app.controller("myCtrl", myCtrl)
