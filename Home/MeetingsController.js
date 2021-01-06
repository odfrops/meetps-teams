var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    var meetId = ''
    angular.element(document).ready(function () {
        $(".pointcur").css('cursor', 'pointer')

        GetMeetings()
    })

    $("#btnLogout").click(function () {
        SaveUser(null)
        Redirect("Login.html")
    });

    microsoftTeams.initialize();

    microsoftTeams.getContext(function (context) {
        if (context && context.theme) {
            setTheme(context.theme)
        }
    })

    microsoftTeams.registerOnThemeChangeHandler(function (theme) {
        setTheme(theme)
    })

    function setTheme(theme) {
        console.log(theme)
    }

    microsoftTeams.settings.registerOnSaveHandler(function (saveEvent) {
        var url = GetAttendeeURL(meetId)
        microsoftTeams.settings.setSettings({
            contentUrl: url,
            suggestedDisplayName: 'MeetingPulse - ' + meetId,
        })
        saveEvent.notifySuccess();
    });

    $scope.Meetings = []

    $scope.GoToPolls = function (e, meetingId) {
        e.preventDefault()

        meetId = meetingId

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
