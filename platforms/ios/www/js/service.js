var adminurl = "http://www.wohlig.co.in";

var post = [];

var myservices = angular.module('myservices', []);

myservices.factory('MyServices', function($http, EMERGENCY_API, LOGIN_API, SERVICE_API, PAYMENT_API) {

    var returnval = {};

    returnval.getloginapi = function(callback) {
        return $http.post(LOGIN_API, data).success(callback);
    };

    // returnval.getFlickrGallaryPhotos = function(id, callback) {
    //     return $http.get(FLICKR_GALLERY_API_URL + "gallery_id=" + id + "&format=json&nojsoncallback=1").success(callback);
    // };

    // returnval.getWordpressPosts = function(callback) {
    //     var getdata = function(data, status) {
    //         return $http.get(data.meta.links.posts).success(callback);
    //     }
    //     $http.get(WORDPRESS_API_URL + "sites/"+Wordpress_UserName).success(getdata);
    // };
    // returnval.getSiteComment = function(callback) {
    //     var getdata = function(data, status) {
    //         console.log("in services");
    //         console.log(data);
    //         return $http.get(data.meta.links.comments).success(callback);
    //     }
    //     $http.get(WORDPRESS_API_URL + "sites/"+Wordpress_UserName).success(getdata);
    // };

    // returnval.getWordpressPostsById = function(callback) {
    //     $http.get($.jStorage.get('detail')).success(callback);
    // };

    // returnval.getFreshlyPressed = function(callback) {
    //     $http.get(WORDPRESS_API_URL + "freshly-pressed/?number=20").success(callback);
    // };

    // returnval.postDetail = function(post) {
    //     $.jStorage.set("detail", post);
    // };

    // returnval.getPostDetail = function() {
    //     return $.jStorage.get("detail");
    // };

    return returnval;
});