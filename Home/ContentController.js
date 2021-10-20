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
        var mode = GetMode()
        if (mode === 'AttendeeHide') {
            DisplayAttendee(true)
        } else if (mode === 'Attendee') {
            DisplayAttendee(false)
        } else if (mode === 'Presenter') {
            DisplayPresenter()
        } else { // Logout
            $scope.GotoLogoutPage()
        }
    }

    function GetMode() {
        var User = getCurrentUser()
        if (User && 'ClientToken' in User) {
            if ($scope.frameContext === 'sidePanel') {
                return 'AttendeeHide'
            } else {
                if ($scope.user == $scope.creator) {
                    // return 'Attendee'
                    return 'Presenter'
                } else {
                    return 'Attendee'
                }
            }
        } else {
            return 'Logout'
        }
    }

    function GetModeOrigin() {
        if ($scope.frameContext === 'sidePanel') {
            return 'Attendee'
        } else if ($scope.frameContext === 'content') {
            var User = getCurrentUser()
            if (User && 'ClientToken' in User) {
                return 'Presenter'
            } else {
                if ($scope.user == $scope.creator) {
                    return 'Logout'
                } else {
                    return 'Attendee'
                }
            }
        } else { // no case
            return 'Logout'
        }
    }

    function DisplayAttendee(hide = true) {
        var attURL = GetAttendeeURL(meeting_id, $scope.user, $scope.user, $scope.user)
        $('#iframe').attr('src', attURL)
        if (hide) {
            $('.header').hide()
        } else {
            $('.header').show()
        }
        $('.content').show()
        StartMonitor()
    }

    function DisplayPresenter() {
        $('#iframe').attr('src', GetPresenterURL(meeting_id))
        $('.header').show()
        $('.content').show()
        StartMonitor()
    }

    var monitor = null

    function StartMonitor() {
        monitor = setInterval(function () {
            if (GetMode() === 'Logout') {
                $scope.GotoLogoutPage()
            }
        }, 5000)
    }

    function StopMonitor() {
        clearInterval(monitor)
    }

    $scope.GotoLogoutPage = function () {
        if (monitor !== null) {
            StopMonitor()
        }
        // console.log(GetLogoutURL(window.location.href))
        SaveUser(null)
        window.location.href = GetLogoutURL(window.location.href)
    }
}]

app.controller("myCtrl", myCtrl)
