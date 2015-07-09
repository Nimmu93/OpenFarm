openFarmModule.factory('cropService', ['$http', '$log', 'alertsService',
  function cropService($http, $log, alertsService) {

    // Should return Crop model:
    // {
    //   id: '',
    //   pictures: '',
    //   binomial_name: '',
    //   ...
    // }

    var buildCrop = function(data, included) {
      var crop = data.attributes;
      crop.id = data.id;
      var pictures = included.filter(function(obj) {
        return obj.type === 'pictures';
      });
      crop.pictures = pictures;
      return crop;
    };

    // Builds Params according to JSON-API from the
    // front-end Crop model
    var buildParams = function(cropObject) {
      var data = {
        type: 'crops',
        id: cropObject.id,
        attributes: cropObject,
        relationships: {
          'pictures': cropObject.images,
        }
      };
      cropObject.images = null;
      return {'data': data};
    }

    // get the guide specified.
    var getCrop = function(cropId, alerts, callback){
      $http({
        url: '/api/v1/crops/' + cropId,
        method: 'GET'
      }).success(function (response) {
        return callback (true, buildCrop(response.data, response.included));
      }).error(function (response, code) {
        alertsService.pushToAlerts(response, code, alerts);
      });
    };

    var updateCrop = function(cropId, cropObject, alerts, callback){
      var url = '/api/v1/crops/' + cropId + '/';
      $log.debug(url);
      $http.put(url, buildParams(cropObject))
        .success(function (response) {
          return callback (true, buildCrop(response.data, response.included));
        })
        .error(function (response) {
          alertsService.pushToAlerts(response, code, alerts);
        });
    };
    return {
      'utilities': {
        'buildCrop': buildCrop,
        'buildParams': buildParams,
      },
      'getCrop': getCrop,
      'updateCrop': updateCrop
    };
}]);
