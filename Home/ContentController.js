var myCtrl = ['$scope', '$sce', function ($scope, $sce) {

    $scope.frameContext = ''
    $scope.user = ''
    $scope.creator = decodeURIComponent(getQueryStringValue('creator'))
    var meeting_id = getQueryStringValue('meet')

    microsoftTeams.initialize()

    microsoftTeams.getContext(function (context) {
        if (context) {
            if (context.frameContext) {
                $scope.frameContext = context.frameContext
            }
            if (context.loginHint) {
                $scope.user = context.loginHint
            }
        }

        Init()
    })

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
        $('#iframe').attr('src', GetAttendeeURL(meeting_id));
        $('.header').hide();
        $('.content').show();
    }

    function DisplayPresenter() {
        $('#iframe').attr('src', GetPresenterURL(meeting_id));
        $('.header').show();
        $('.content').show();
    }

    $scope.GotoLogoutPage = function () {
        SaveUser(null)
        window.location.href = GetLogoutURL(window.location.href)
    }
}]

app.controller("myCtrl", myCtrl)
