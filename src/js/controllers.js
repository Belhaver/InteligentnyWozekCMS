var adminApp = angular.module('adminApp',['angular.filter']);


adminApp.controller('AdminController', function($scope, $http) {
    $scope.products = [];
    $scope.product = {};
    $scope.productColumnNumber;
    $scope.productRowNumber;
    $scope.selectedShop = "";
    $scope.shops = [];
    $scope.newShopName = "";
    $scope.newShopColumnCount = 0;
    $scope.newShopRowCount = 0;

    $http.get("http://localhost:8080/Serwer/map/getShops")
        .then(function(response) {
        $scope.shops = response.data;
        console.log($scope.shops);
    });

    $scope.addShop = function() {
        if (!$scope.isShopDataGood()) return;
        $http.get("http://localhost:8080/Serwer/map/addShop?name=" + $scope.newShopName +
            "&columnCount=" + $scope.newShopColumnCount + "&rowCount=" + $scope.newShopRowCount)
            .then(function (response) {
                console.log($scope.shops);
                $scope.shops.push(response.data);
                console.log($scope.shops);
            })
    }

    $scope.isShopSelected = function () {
        if ($scope.selectedShop == "") {
            return false;
        } else {
            return true;
        }
    }

    $scope.isShopDataGood = function () {
        if ($scope.newShopName != "" && $scope.newShopColumnCount == 0 || $scope.newShopRowCount == 0) {
            return false;
        }
        return true;
    }

    $scope.shopSelected = function () {
        if ($scope.selectedShop == "") {
            $scope.products = [];
        } else {
            $http.get("http://localhost:8080/Serwer/map/getShopProducts?shopId=" + $scope.selectedShop)
                .then(function (response) {
                    $scope.products = response.data;
                    console.log($scope.products);
                })
        }
    }

    $scope.addProduct = function () {
        $http.get("http://localhost:8080/Serwer/map/addProductToShop?shopId=" + $scope.selectedShop +
            "&name=" + $scope.product.name + "&columnNumber=" + $scope.productColumnNumber +
            "&rowNumber=" + $scope.productRowNumber)
            .then(function (response) {
                $scope.products.push(response.data);
                console.log($scope.products);
            })
    }

    $scope.deleteProduct = function (productId) {
        console.log("delete");
        $http.get("http://localhost:8080/Serwer/map/deleteProduct?productId=" + productId)
            .then(function () {
                for (var i = 0; i < $scope.products.length; i++) {
                    if ($scope.products[i].id == productId) {
                        $scope.products.splice(i, 1);
                        break;
                    }
                }
            })
    }
})
