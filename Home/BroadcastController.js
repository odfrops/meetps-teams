var myCtrl = ['$scope', 'AngularServices', '$sce', function ($scope, AngularServices, $sce) {

    UpdateBroadcastLink()

    this.$onDestroy = function() {
        var BroadcastID = localStorage.getItem('BroadcastID')
        var MeetingID = localStorage.getItem('MeetingID')
        EndBroadcast(MeetingID, BroadcastID)
    }

    function UpdateBroadcastLink() {
        var Link = decodeURIComponent(getQueryStringValue("BroadcastLink"))
        var User = getCurrentUser()
        var BroadcastID = localStorage.getItem('BroadcastID')
        if (BroadcastID == null) {
            Link = Link.replace("#", "?t=" + User.ClientToken + "#")
        } else {
            Link = Link + "?t=" + User.ClientToken
        }
        $scope.BroadcastLink = $sce.trustAsResourceUrl(Link)
        $scope.$apply()
        Begin()
    }

    function Begin() {
        var BroadcastID = localStorage.getItem('BroadcastID')
        var MeetingID = localStorage.getItem('MeetingID')
        if (BroadcastID != null) {
            window.setInterval(function () {
                StartBroadcast(MeetingID, BroadcastID)
            }, 1000)
        }
    }

    function EndBroadcast(MeetingID, BroadcastID) {
        if (GetBroadcastStatus() != "ready") {
            UpdateBroadcast("ready", MeetingID, BroadcastID)
        }
    }
    function StartBroadcast(MeetingID, BroadcastID) {
        if (GetBroadcastStatus() != "live") {
            UpdateBroadcast("live", MeetingID, BroadcastID)
        }
    }
    function UpdateBroadcastStatus(Status) {
        localStorage.setItem('BroadcastStatus', Status)
    }
    function GetBroadcastStatus() {
        return localStorage.getItem('BroadcastStatus')
    }
    function UpdateBroadcast(Status, MeetingID, BroadcastID) {
        var User = getCurrentUser()
        var headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + User.Token
        }
        var data = {
            "state": Status
        }
        AngularServices.PUT("meetings/" + MeetingID + "/polls/" + BroadcastID, data, headers).
            then(function (response) {
                switch (response.status) {
                    case 204:
                        UpdateBroadcastStatus(Status)
                        break
                    case 401:
                        AngularServices.RenewTokenOrLogout(UpdateBroadcast(Status, MeetingID, BroadcastID))
                        break
                    default:
                        break
                }
            })
    }

    $scope.RedirectToMeetings = function () {
        localStorage.removeItem('BroadcastLink')
        var MeetingID = localStorage.getItem('MeetingID')
        Redirect("Polls.html?meetingID=" + MeetingID)
    }
}]

app.controller("myCtrl", myCtrl)






