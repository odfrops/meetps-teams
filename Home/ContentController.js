var myCtrl = ['$scope', '$sce', function ($scope, $sce) {

    $scope.frameContext = ''
    $scope.loginHint = ''
    $scope.creator = decodeURIComponent(getQueryStringValue('creator'))
    var meeting_id = getQueryStringValue(meet)

    Init()
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
        $scope.url = $sce.trustAsResourceUrl(GetAttendeeURL(meeting_id));
    }

    function DisplayPresenter() {
        $scope.url = $sce.trustAsResourceUrl(GetPresenterURL(meeting_id));
    }

    $scope.GotoLogoutPage = function () {
        window.location.href = GetLogoutURL(window.location.href)
    }
}]

app.controller("myCtrl", myCtrl)
