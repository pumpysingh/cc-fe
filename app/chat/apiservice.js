import Raven from 'raven-js';
CallRequest.$inject = ['$http', '$q', 'config', '$rootScope'];
export default function CallRequest($http, $q, config, $rootScope) {
    this.url = config.API_URL;
    this.getRequest = function (url, headers, responseType) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: this.url + url,
            headers:headers,
            responseType: responseType,
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var headers = response.headers;
            var config = response.config;
            var results = [];
            results.data = data;
            results.headers = headers;
            results.status = status;
            results.config = config;
            if (status == 200) {
                $rootScope.status = 200;
            }
            deferred.resolve(results);
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            $rootScope.status = status;
            console.log("Status ",status);
            console.log("Data ",data ? JSON.stringify(data) : data);
            Raven.captureException("API Get request failure ",status);
            if (status == 503 || status == 403 || status == 504 || status == 500) {
            }
            deferred.reject(data, status);
        });
        return deferred.promise;
    };

    this.sendRequest = function (requestdata, url, header) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: this.url + url,
            data: requestdata,
            headers: header
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var headers = response.headers;
            var config = response.config;
            var results = [];
            results.data = data;
            results.headers = headers;
            results.status = status;
            results.config = config;
            if (status == 200) {
                $rootScope.status = 200;
            }
            deferred.resolve(results);
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            $rootScope.status = status;
            console.log("Status ",status);
            console.log("Data ",data ? JSON.stringify(data) : data);
            Raven.captureException("API Send request failure ",status);
            if (status == 503 || status == 403 || status == 504 || status == 500) {
                data.status = status;
            }
            deferred.reject(data, status);
        });
        return deferred.promise;
    };

    this.updateRequest = function (requestdata, url, header) {
        var deferred = $q.defer();
        $http({
            method: 'PUT',
            url: this.url + url,
            data: requestdata,
            headers: header
        }).then(function onSuccess(response) {
            // Handle success
            var data = response.data;
            var status = response.status;
            var headers = response.headers;
            var config = response.config;
            var results = [];
            results.data = data;
            results.headers = headers;
            results.status = status;
            results.config = config;
            // any required additional processing here
            deferred.resolve(data);
        }).catch(function onError(response) {
            // Handle error
            var data = response.data;
            var status = response.status;
            console.log("Status ",status);
            console.log("Data ",data ? JSON.stringify(data) : data);
            Raven.captureException("API Update request failure ",status);
            deferred.reject(data, status);
        });
        return deferred.promise;
    };
}