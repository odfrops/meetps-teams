var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    $scope.frameContext = ''
    $scope.loginHint = ''
    $scope.creator = ''
    $scope.url = location.href

    microsoftTeams.initialize()

    microsoftTeams.getContext(function (context) {
        if (context) {
            if (context.frameContext) {
                $scope.frameContext = context.frameContext
            }
            if (context.loginHint) {
                $scope.loginHint = context.loginHint
            }
            if (context.creator) {
                $scope.creator = context.creator
            }
        }
    })
}]

app.controller("myCtrl", myCtrl)
