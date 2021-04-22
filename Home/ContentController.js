var myCtrl = ['$scope', '$sce', function ($scope, $sce) {

    $scope.frameContext = 'content'
    $scope.loginHint = 'orikon@meetingpulse.net'
    $scope.creator = 'orikon@meetingpulse.net'
    $scope.iframe = {}

    var meeting_id = 'or-meeting'
    // $scope.frameContext = ''
    // $scope.loginHint = ''
    // $scope.creator = decodeURIComponent(getQueryStringValue('creator'))
    // $scope.url = ''

    // var meeting_id = getQueryStringValue('meet')

    // microsoftTeams.initialize()

    // microsoftTeams.getContext(function (context) {
    //     if (context) {
    //         if (context.frameContext) {
    //             $scope.frameContext = context.frameContext
    //         }
    //         if (context.loginHint) {
    //             $scope.user = context.loginHint
    //         }
    //     }

    //     Init()
    // })

    setTimeout(function () {
        Init()
    }, 100);

    function Init() {
        if ($scope.frameContext === 'sidePanel') {
            DisplayAttendee()
        } else if ($scope.frameContext === 'content') {
            var User = getCurrentUser()
            if (User && 'ClientToken' in User) {
                DisplayPresenter()
            } else {
                if ($scope.user == $scope.creator) {
                    $scope.GotoLogoutPage()
                } else {
                    DisplayAttendee()
                }
            }
        }
    }

    function DisplayAttendee() {
        $scope.iframe.url = GetAttendeeURL(meeting_id); // $sce.trustAsResourceUrl(GetAttendeeURL(meeting_id));
        console.log(GetAttendeeURL(meeting_id));
        console.log($scope.iframe.url);
    }

    function DisplayPresenter() {
        $scope.iframe.url = GetPresenterURL(meeting_id); //$sce.trustAsResourceUrl(GetPresenterURL(meeting_id));
        console.log(GetPresenterURL(meeting_id));
        console.log($scope.iframe.url);
    }

    $scope.GotoLogoutPage = function () {
        window.location.href = GetLogoutURL(window.location.href)
    }
}]

app.controller("myCtrl", myCtrl)
