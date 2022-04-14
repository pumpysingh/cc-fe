import Raven from 'raven-js';
DirectlineRequest.$inject = ['$http', '$q', 'config', '$rootScope'];
export default function DirectlineRequest($http, $q, config, $rootScope) {
    this.sendRequest = function (requestdata, url, header) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url:url,
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
            console.log("Satatus ",status);
            console.log("Data ",data);
            Raven.captureException("Directline Send message request failure ",status);
            $rootScope.showAlert();
            $rootScope.status = status;
            if (status == 503 || status == 403 || status == 504 || status == 500) {
                
            }
            deferred.reject(requestdata, status);
        });
        return deferred.promise;
    };
}
