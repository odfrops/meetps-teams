﻿// Available endpoints and their configs.

var configs = {
    "development": {
        "domain": "dev.meet.ps"
    },
    "default": {
        "domain": "app.meet.ps"
    },
    "local": {
        "domain": "local.meet.ps:8443"
    }
}

var mode = 'default'
var config = configs[mode] || configs.default

var BaseURL = "https://" + config.domain + "/"
var BaseAPIURI = BaseURL + "api/"

var basePath = "/Home"


// Reprototypings.

Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}

Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
}


// Common funcs.

function removeObj(myObjects, prop, value) {
    return myObjects.filter(function (val) {
        return val[prop] !== value
    })
}

function SaveUser(User) {
    localStorage.setObj("User", User)
}

function getCurrentUser() {
    return localStorage.getObj("User")
}

// Relative URL redirector with support for customized views depending on config/endpoint.
function Redirect(q) {
    window.location.href = GetRedirectURL(q)
}

function GetRedirectURL(q) {
    console.log(q)
    // Honour base relative path.
    var currentPath = window.location.pathname.indexOf(basePath)
    var basePrefix = window.location.pathname.substring(0, currentPath)
    // Get the target view name, check if it has custom version.
    var view = String(q).trim().split(".").shift()
    var isCustom = config.customViews && config.customViews[view] && config.customPath
    var prefix = basePrefix + (isCustom ? (config.customPath + "/") : "/Home/")
    // Carry over the endpoint/mode thing. Note that other strings might already be present there.
    return prefix + q
}

function ForgotPassword () {
    window.open(BaseURL + "login/forgot", "_blank")
}

function GetAttendeeURL (meetingid) {
    var User = getCurrentUser()
    // return BaseURL + 'presenter/' + meetingid + '?t=' + User.ClientToken
    return BaseURL + meetingid
}

function getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"))
}


// "main"

if (window.angular) {
    var app
    if (window.location.href.endsWith('Login.html')) {
        app = angular.module('myApp', ['ngSanitize', 'ngMaterial', 'ngMessages'])
    } else {
        app = angular.module('myApp', ['ngSanitize'])
    }

    app.filter('encodeURIComponent', function () {
        return window.encodeURIComponent
    })

    app.filter('sanitizer', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url)
        }
    }])

    app.service('AngularServices', ['$http', function ($http) {
        var API = {
            GET: function (EndPoint,headers) {

                return $http(
                    {
                        method: 'GET',
                        url: BaseAPIURI + EndPoint,
                        headers: headers
                    })
                    .then(function (response) {
                        return response
                    }).catch(function (response) {
                        return response
                    })
            },
            POST: function (EndPoint, body, headers) {
                var settings = {
                    method: 'POST',
                    url: BaseAPIURI + EndPoint,
                    data: body,
                    headers: headers
                }
                return $http(settings)
                    .then(function (response) {
                        return response
                    }).catch(function (response) {
                        return response
                    })
            },
            PUT: function (EndPoint, body, headers) {
                var settings = {
                    method: 'PUT',
                    url: BaseAPIURI + EndPoint,
                    data: body,
                    headers: headers
                }
                return $http(settings)
                    .then(function (response) {
                        return response
                    }).catch(function (response) {
                        return response
                    })
            }
        }

        API.RenewTokenOrLogout = function (cb) {
            var User = getCurrentUser()
            var data = {
                "email": User.Email,
                "password": User.Password
            }
            var headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }

            API.POST("auth", data, headers).
                then(function (response) {
                    switch (response.status) {
                        case 401:
                            SaveUser(null)
                            Redirect("Login.html")
                            break
                        case 200:
                            User.Token = response.data.result.token
                            User.ClientToken = response.data.result.clientToken
                            SaveUser(User)
                            cb()
                            break

                        default:
                            SaveUser(null)
                            Redirect("Login.html")
                            break
                    }
                })
        }

        return API
    }])
}
