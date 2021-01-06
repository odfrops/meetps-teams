var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    angular.element(document).ready(function () {
        $(".pointcur").css('cursor', 'pointer')

        GetMeetings()
    })

    microsoftTeams.initialize();
    // microsoftTeams.getContext(function (context) {
    //     if (context && context.theme) {
    //         setTheme(context.theme);
    //     }
    // });

    $scope.Meetings = []

    $scope.GoToPolls = function (e, meetingId) {
        e.preventDefault()

        microsoftTeams.settings.registerOnSaveHandler(function (saveEvent) {
            // Let the Microsoft Teams platform know what you want to load based on
            // what the user configured on this page
            var url = GetRedirectURL("Polls.html?meetingId=" + meetingId)
            microsoftTeams.settings.setSettings({
                contentUrl: url,
                suggestedDisplayName: meetingId,
            })
            microsoftTeams.settings.setValidityState(true)
        
            // Tells Microsoft Teams platform that we are done saving our settings. Microsoft Teams waits
            // for the app to call this API before it dismisses the dialog. If the wait times out, you will
            // see an error indicating that the configuration settings could not be saved.
            saveEvent.notifySuccess();
        });
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
