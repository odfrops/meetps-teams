var myCtrl = ['$scope', 'AngularServices', function ($scope, AngularServices) {

    $scope.frameContext = '' // sidePanel, content
    $scope.loginHint = ''
    $scope.creator = decodeURIComponent(getQueryStringValue('creator'))

    microsoftTeams.initialize()

    microsoftTeams.getContext(function (context) {
        if (context) {
            if (context.frameContext) {
                $scope.frameContext = context.frameContext
            }
            if (context.loginHint) {
                $scope.loginHint = context.loginHint
            }
        }

        Init()
    })

    function Init() {
        console.log($scope.frameContext)
        console.log($scope.loginHint)
        console.log($scope.creator)
    }
}]

app.controller("myCtrl", myCtrl)
